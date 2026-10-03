export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string | null
          actor_id: string | null
          created_at: string | null
          diff: Json | null
          entity: string | null
          entity_id: string | null
          id: number
        }
        Insert: {
          action?: string | null
          actor_id?: string | null
          created_at?: string | null
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: never
        }
        Update: {
          action?: string | null
          actor_id?: string | null
          created_at?: string | null
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: never
        }
        Relationships: []
      }
      batch_announcements: {
        Row: {
          author_id: string | null
          batch_id: string
          body: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          author_id?: string | null
          batch_id: string
          body: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          author_id?: string | null
          batch_id?: string
          body?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_announcements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_members: {
        Row: {
          batch_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          batch_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          batch_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_members_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_sessions: {
        Row: {
          batch_id: string
          duration_min: number
          id: string
          join_url: string | null
          recording_lesson_id: string | null
          starts_at: string
          title: string
        }
        Insert: {
          batch_id: string
          duration_min?: number
          id?: string
          join_url?: string | null
          recording_lesson_id?: string | null
          starts_at: string
          title: string
        }
        Update: {
          batch_id?: string
          duration_min?: number
          id?: string
          join_url?: string | null
          recording_lesson_id?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_sessions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_sessions_recording_lesson_id_fkey"
            columns: ["recording_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          course_id: string
          created_at: string
          id: string
          name: string
          schedule: string | null
          seats: number | null
          starts_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          name: string
          schedule?: string | null
          seats?: number | null
          starts_at: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          name?: string
          schedule?: string | null
          seats?: number | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_courses: {
        Row: {
          bundle_id: string
          course_id: string
        }
        Insert: {
          bundle_id: string
          course_id: string
        }
        Update: {
          bundle_id?: string
          course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_courses_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          id: string
          price_pkr: number | null
          price_usd: number
          slug: string
          title: string
        }
        Insert: {
          id?: string
          price_pkr?: number | null
          price_usd: number
          slug: string
          title: string
        }
        Update: {
          id?: string
          price_pkr?: number | null
          price_usd?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          code: string
          course_id: string
          id: string
          issued_at: string
          name_on_cert: string
          pdf_path: string | null
          status: Database["public"]["Enums"]["cert_status"]
          user_id: string
        }
        Insert: {
          code?: string
          course_id: string
          id?: string
          issued_at?: string
          name_on_cert: string
          pdf_path?: string | null
          status?: Database["public"]["Enums"]["cert_status"]
          user_id: string
        }
        Update: {
          code?: string
          course_id?: string
          id?: string
          issued_at?: string
          name_on_cert?: string
          pdf_path?: string | null
          status?: Database["public"]["Enums"]["cert_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          assigned_to: string | null
          channel: Database["public"]["Enums"]["chat_channel"]
          created_at: string
          handoff: boolean
          handoff_at: string | null
          handoff_reason: string | null
          id: string
          last_message_at: string | null
          lead_flow: Json | null
          lead_id: string | null
          low_confidence_streak: number
          status: string
          summary: string | null
          visitor_id: string | null
          visitor_token_hash: string | null
          wa_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          channel: Database["public"]["Enums"]["chat_channel"]
          created_at?: string
          handoff?: boolean
          handoff_at?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_flow?: Json | null
          lead_id?: string | null
          low_confidence_streak?: number
          status?: string
          summary?: string | null
          visitor_id?: string | null
          visitor_token_hash?: string | null
          wa_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          channel?: Database["public"]["Enums"]["chat_channel"]
          created_at?: string
          handoff?: boolean
          handoff_at?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_flow?: Json | null
          lead_id?: string | null
          low_confidence_streak?: number
          status?: string
          summary?: string | null
          visitor_id?: string | null
          visitor_token_hash?: string | null
          wa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          author_id: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          meta: Json
          role: string
        }
        Insert: {
          author_id?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          meta?: Json
          role: string
        }
        Update: {
          author_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          meta?: Json
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          expires_at: string | null
          id: string
          kind: string
          max_uses: number | null
          used: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          expires_at?: string | null
          id?: string
          kind: string
          max_uses?: number | null
          used?: number
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          expires_at?: string | null
          id?: string
          kind?: string
          max_uses?: number | null
          used?: number
          value?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          access_months: number | null
          category_id: string | null
          created_at: string
          description_md: string | null
          id: string
          instructor_id: string | null
          level: string | null
          outcomes: string[] | null
          pass_pct: number
          price_pkr: number | null
          price_usd: number
          seo: Json | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          summary: string | null
          thumbnail_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_months?: number | null
          category_id?: string | null
          created_at?: string
          description_md?: string | null
          id?: string
          instructor_id?: string | null
          level?: string | null
          outcomes?: string[] | null
          pass_pct?: number
          price_pkr?: number | null
          price_usd?: number
          seo?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          summary?: string | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_months?: number | null
          category_id?: string | null
          created_at?: string
          description_md?: string | null
          id?: string
          instructor_id?: string | null
          level?: string | null
          outcomes?: string[] | null
          pass_pct?: number
          price_pkr?: number | null
          price_usd?: number
          seo?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          summary?: string | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          expires_at: string | null
          id: string
          source: string
          starts_at: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          expires_at?: string | null
          id?: string
          source?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          expires_at?: string | null
          id?: string
          source?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string | null
          id: string
          position: number | null
          published: boolean | null
          question: string | null
          topic: string | null
        }
        Insert: {
          answer?: string | null
          id?: string
          position?: number | null
          published?: boolean | null
          question?: string | null
          topic?: string | null
        }
        Update: {
          answer?: string | null
          id?: string
          position?: number | null
          published?: boolean | null
          question?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      kb_chunks: {
        Row: {
          chunk_index: number
          content: string
          document_id: string
          embedding: string | null
          id: string
        }
        Insert: {
          chunk_index?: number
          content: string
          document_id: string
          embedding?: string | null
          id?: string
        }
        Update: {
          chunk_index?: number
          content?: string
          document_id?: string
          embedding?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          embedded_at: string | null
          embedding_model: string | null
          id: string
          kind: string
          slug: string | null
          source: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          embedded_at?: string | null
          embedding_model?: string | null
          id?: string
          kind?: string
          slug?: string | null
          source?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          embedded_at?: string | null
          embedding_model?: string | null
          id?: string
          kind?: string
          slug?: string | null
          source?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          lead_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          lead_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          assigned_to: string | null
          created_at: string
          details: Json
          email: string | null
          id: string
          interest: string | null
          message: string | null
          name: string | null
          phone: string | null
          practice_name: string | null
          source: string
          specialty: string | null
          status: Database["public"]["Enums"]["lead_status"]
          utm: Json | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          interest?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          practice_name?: string | null
          source: string
          specialty?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          utm?: Json | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          interest?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          practice_name?: string | null
          source?: string
          specialty?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          utm?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_answers: {
        Row: {
          body: string
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lesson_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_notes: {
        Row: {
          body: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          enrollment_id: string
          lesson_id: string
          position_sec: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          enrollment_id: string
          lesson_id: string
          position_sec?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          enrollment_id?: string
          lesson_id?: string
          position_sec?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_questions: {
        Row: {
          body: string
          created_at: string | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          id: string
          label: string
          lesson_id: string
          storage_path: string
        }
        Insert: {
          id?: string
          label: string
          lesson_id: string
          storage_path: string
        }
        Update: {
          id?: string
          label?: string
          lesson_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          bunny_video_id: string | null
          content_md: string | null
          duration_sec: number | null
          id: string
          is_preview: boolean
          live_url: string | null
          module_id: string
          pdf_path: string | null
          position: number
          required: boolean
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          unlock_rule: Json | null
          video_meta: Json
          video_status: string
        }
        Insert: {
          bunny_video_id?: string | null
          content_md?: string | null
          duration_sec?: number | null
          id?: string
          is_preview?: boolean
          live_url?: string | null
          module_id: string
          pdf_path?: string | null
          position?: number
          required?: boolean
          title: string
          type?: Database["public"]["Enums"]["lesson_type"]
          unlock_rule?: Json | null
          video_meta?: Json
          video_status?: string
        }
        Update: {
          bunny_video_id?: string | null
          content_md?: string | null
          duration_sec?: number | null
          id?: string
          is_preview?: boolean
          live_url?: string | null
          module_id?: string
          pdf_path?: string | null
          position?: number
          required?: boolean
          title?: string
          type?: Database["public"]["Enums"]["lesson_type"]
          unlock_rule?: Json | null
          video_meta?: Json
          video_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          id: string
          position: number
          title: string
        }
        Insert: {
          course_id: string
          id?: string
          position?: number
          title: string
        }
        Update: {
          course_id?: string
          id?: string
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          link: string | null
          read_at: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          bundle_id: string | null
          course_id: string | null
          id: string
          order_id: string
          price: number
        }
        Insert: {
          bundle_id?: string | null
          course_id?: string | null
          id?: string
          order_id: string
          price: number
        }
        Update: {
          bundle_id?: string | null
          course_id?: string | null
          id?: string
          order_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          currency: string
          discount: number
          id: string
          paid_at: string | null
          proof_path: string | null
          provider: string
          provider_ref: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id: string
          verified_by: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount?: number
          id?: string
          paid_at?: string | null
          proof_path?: string | null
          provider: string
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id: string
          verified_by?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount?: number
          id?: string
          paid_at?: string | null
          proof_path?: string | null
          provider?: string
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          user_id?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          blocks: Json
          seo: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          blocks?: Json
          seo?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          blocks?: Json
          seo?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body_md: string | null
          category_id: string | null
          cover_path: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo: Json | null
          slug: string
          status: string
          title: string
        }
        Insert: {
          author_id?: string | null
          body_md?: string | null
          category_id?: string | null
          cover_path?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo?: Json | null
          slug: string
          status?: string
          title: string
        }
        Update: {
          author_id?: string | null
          body_md?: string | null
          category_id?: string | null
          cover_path?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo?: Json | null
          slug?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          certificate_name: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_path?: string | null
          certificate_name?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_path?: string | null
          certificate_name?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct: Json
          explanation: string | null
          id: string
          options: Json
          prompt: string
          quiz_id: string
          tag: string | null
          type: string
        }
        Insert: {
          correct: Json
          explanation?: string | null
          id?: string
          options: Json
          prompt: string
          quiz_id: string
          tag?: string | null
          type: string
        }
        Update: {
          correct?: Json
          explanation?: string | null
          id?: string
          options?: Json
          prompt?: string
          quiz_id?: string
          tag?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          id: string
          passed: boolean | null
          question_ids: string[]
          quiz_id: string
          score_pct: number | null
          started_at: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          id?: string
          passed?: boolean | null
          question_ids: string[]
          quiz_id: string
          score_pct?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          id?: string
          passed?: boolean | null
          question_ids?: string[]
          quiz_id?: string
          score_pct?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          attempts_allowed: number | null
          course_id: string
          id: string
          kind: Database["public"]["Enums"]["quiz_kind"]
          lesson_id: string | null
          pass_pct: number
          question_count: number | null
          randomize: boolean
          time_limit_min: number | null
          title: string
        }
        Insert: {
          attempts_allowed?: number | null
          course_id: string
          id?: string
          kind?: Database["public"]["Enums"]["quiz_kind"]
          lesson_id?: string | null
          pass_pct?: number
          question_count?: number | null
          randomize?: boolean
          time_limit_min?: number | null
          title: string
        }
        Update: {
          attempts_allowed?: number | null
          course_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["quiz_kind"]
          lesson_id?: string | null
          pass_pct?: number
          question_count?: number | null
          randomize?: boolean
          time_limit_min?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          value: Json | null
        }
        Insert: {
          key: string
          value?: Json | null
        }
        Update: {
          key?: string
          value?: Json | null
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          id: string
          order_id: string | null
          outcome: string
          received_at: string
          type: string
        }
        Insert: {
          id: string
          order_id?: string | null
          outcome: string
          received_at?: string
          type: string
        }
        Update: {
          id?: string
          order_id?: string | null
          outcome?: string
          received_at?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          audience: string | null
          id: string
          name: string | null
          published: boolean | null
          quote: string | null
          role: string | null
        }
        Insert: {
          audience?: string | null
          id?: string
          name?: string | null
          published?: boolean | null
          quote?: string | null
          role?: string | null
        }
        Update: {
          audience?: string | null
          id?: string
          name?: string | null
          published?: boolean | null
          quote?: string | null
          role?: string | null
        }
        Relationships: []
      }
      updates: {
        Row: {
          body_md: string | null
          category: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          image_path: string | null
          link_label: string | null
          link_url: string | null
          pinned: boolean
          publish_at: string
          slug: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          body_md?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_path?: string | null
          link_label?: string | null
          link_url?: string | null
          pinned?: boolean
          publish_at?: string
          slug: string
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_path?: string | null
          link_label?: string | null
          link_url?: string | null
          pinned?: boolean
          publish_at?: string
          slug?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fulfil_order: {
        Args: {
          p_amount_minor?: number
          p_currency?: string
          p_order: string
          p_provider_ref?: string
          p_verified_by?: string
        }
        Returns: string
      }
      has_role: {
        Args: { r: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_batch_member: { Args: { b: string }; Returns: boolean }
      is_course_staff: { Args: { c: string }; Returns: boolean }
      is_enrolled: { Args: { c: string }; Returns: boolean }
      lesson_course: { Args: { l: string }; Returns: string }
      match_kb: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          document_id: string
          id: string
          similarity: number
          title: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      verify_certificate: {
        Args: { p_code: string }
        Returns: {
          course_title: string
          issued_at: string
          name_on_cert: string
          status: Database["public"]["Enums"]["cert_status"]
        }[]
      }
    }
    Enums: {
      cert_status: "valid" | "revoked"
      chat_channel: "web" | "whatsapp"
      course_status: "draft" | "published" | "archived"
      enrollment_status: "active" | "expired" | "revoked"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "won"
        | "lost"
      lesson_type: "video" | "text" | "pdf" | "quiz" | "assignment" | "live"
      order_status:
        | "pending"
        | "awaiting_verification"
        | "paid"
        | "failed"
        | "refunded"
        | "cancelled"
      quiz_kind: "quiz" | "exam"
      user_role: "student" | "instructor" | "sales" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cert_status: ["valid", "revoked"],
      chat_channel: ["web", "whatsapp"],
      course_status: ["draft", "published", "archived"],
      enrollment_status: ["active", "expired", "revoked"],
      lead_status: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      lesson_type: ["video", "text", "pdf", "quiz", "assignment", "live"],
      order_status: [
        "pending",
        "awaiting_verification",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ],
      quiz_kind: ["quiz", "exam"],
      user_role: ["student", "instructor", "sales", "admin"],
    },
  },
} as const
