-- Phase 7A — website chatbot (docs/09, 2026-10-01).
-- Extends the 0001 chatbot tables: soft-deletable knowledge documents synced from the site,
-- chunk order and embedding model, conversation status for human handoff, per-visitor
-- token for the widget, message metadata, and realtime for the Sales inbox.
--
-- Embeddings stay vector(1536): OpenAI text-embedding-3-small is 1536 natively and
-- Gemini gemini-embedding-001 is requested at outputDimensionality 1536 (lib/ai/provider.ts).
-- A model with another size needs a migration that changes kb_chunks.embedding and match_kb.

create extension if not exists pg_trgm;

-- ---------- Knowledge base ----------
alter table public.kb_documents
  add column if not exists slug text unique,              -- site:<path> for synced pages; null for admin documents
  add column if not exists kind text not null default 'admin' check (kind in ('site', 'pinned', 'admin')),
  add column if not exists deleted_at timestamptz,         -- soft delete (hidden from retrieval, kept for the record)
  add column if not exists embedded_at timestamptz,
  add column if not exists embedding_model text,
  add column if not exists created_by uuid references profiles(id),
  add column if not exists created_at timestamptz not null default now();

alter table public.kb_chunks
  add column if not exists chunk_index int not null default 0;

create index if not exists kb_chunks_document_idx on public.kb_chunks (document_id, chunk_index);

-- Top matches from live (not soft-deleted) documents, with the document title for context.
drop function if exists public.match_kb(vector, int);
create or replace function public.match_kb(query_embedding vector(1536), match_count int default 5)
returns table (id uuid, document_id uuid, title text, content text, similarity float)
language sql stable
security invoker
set search_path = public
as $$
  select c.id, c.document_id, d.title, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from kb_chunks c
  join kb_documents d on d.id = c.document_id
  where d.deleted_at is null and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------- Conversations ----------
alter table public.chat_conversations
  add column if not exists status text not null default 'bot' check (status in ('bot', 'handoff', 'closed')),
  add column if not exists handoff_reason text,            -- requested | low_confidence | complaint | payment
  add column if not exists handoff_at timestamptz,
  add column if not exists low_confidence_streak int not null default 0,
  add column if not exists visitor_token_hash text,        -- sha256 of the widget's secret; never the secret itself
  add column if not exists lead_flow jsonb,                -- in-progress lead capture (lib/ai/lead-flow.ts)
  add column if not exists summary text;                   -- first question, for the inbox list

create index if not exists chat_conversations_status_idx on public.chat_conversations (status, last_message_at desc);

alter table public.chat_messages
  drop constraint if exists chat_messages_role_check;
alter table public.chat_messages
  add constraint chat_messages_role_check check (role in ('user', 'assistant', 'agent', 'system')),
  add column if not exists meta jsonb not null default '{}'::jsonb,   -- intent, confidence, sources
  add column if not exists author_id uuid references profiles(id);    -- the agent, for role = 'agent'

create index if not exists chat_messages_conversation_idx on public.chat_messages (conversation_id, created_at);

-- Search the logs by message text (admin conversation logs).
create index if not exists chat_messages_content_trgm on public.chat_messages using gin (content gin_trgm_ops);

-- ---------- RLS ----------
-- Visitors never read these tables directly: the widget goes through /api/chat (service role,
-- after checking the visitor token). Staff policies from 0001 stay; sales may read the
-- knowledge base titles in the inbox, admins manage it.
drop policy if exists "staff conversations" on chat_conversations;
drop policy if exists "staff messages" on chat_messages;
create policy "staff conversations" on chat_conversations for all
  using (is_admin() or has_role('sales')) with check (is_admin() or has_role('sales'));
create policy "staff messages" on chat_messages for all
  using (is_admin() or has_role('sales')) with check (is_admin() or has_role('sales'));

-- ---------- Realtime (Sales inbox) ----------
-- Realtime respects RLS, so only staff receive these changes.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.chat_conversations;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.chat_messages;
    exception when duplicate_object then null;
    end;
  end if;
end $$;
