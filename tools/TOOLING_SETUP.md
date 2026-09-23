# Tooling Setup

Install once on the development machine before running MASTER_PROMPT.md.

## 1. Core
| Tool | Install |
|---|---|
| Node.js LTS (20+) | nodejs.org |
| Git + GitHub CLI | `gh auth login` |
| Claude Code | `npm install -g @anthropic-ai/claude-code` |
| Supabase CLI | `npm install -g supabase` (or `brew install supabase/tap/supabase`) |
| Vercel CLI | `npm install -g vercel` |
| Python 3 | required by UI UX Pro Max's search scripts |

## 2. UI UX Pro Max (design intelligence skill)
Source: github.com/nextlevelbuilder/ui-ux-pro-max-skill

Option A — skills CLI (project scope):
```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
```
Option B — inside Claude Code, through a plugin marketplace that ships it, using `/plugin marketplace add ...` then `/plugin install ui-ux-pro-max@...`.

Check: in Claude Code ask "use the ui-ux-pro-max skill to list available styles". If the skill loads, it's installed. Verify the install command against the repo README first — these tools update often.

## 3. 21st.dev Magic MCP (component generation)
1. Get an API key at 21st.dev (Magic console).
2. Register with Claude Code (user scope):
```bash
claude mcp add magic -s user -- npx -y @21st-dev/magic@latest API_KEY=<your-key>
```
or use the official CLI: `npx @21st-dev/cli@latest install claude --api-key <your-key>`
3. Check: `claude mcp list` shows `magic`.
4. Use: `/ui` project command (see .claude/commands/ui.md) which injects our locked tokens.

The repo's `.mcp.json` also declares Magic at project scope reading `TWENTYFIRST_API_KEY` from your shell env — use one method, not both.

## 4. Other MCP servers (declared in .mcp.json)
| MCP | Why | Env needed |
|---|---|---|
| Supabase MCP | Apply migrations, inspect tables, generate types | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` |
| Context7 | Current docs for Next.js, Supabase, Stripe, Tailwind v4 | – |
| Playwright MCP | Screenshots for design self-review, E2E debugging | – |

## 5. Recommended extra skills
| Skill | Use |
|---|---|
| frontend-design (Anthropic) | Page composition, anti-template review |
| shadcn skill | Component install/management |
| Vercel web-design-guidelines | UI review checklist |

## 6. Motion graphics tools
| Tool | Use |
|---|---|
| Adobe After Effects + Bodymovin/LottieFiles plugin | Create hero, learning-loop and icon animations → export .lottie |
| LottieFiles (web) | Optimise and preview .lottie files, check size |
| Rive (rive.app) | Interactive state animations (seal stamp, chat icon) → export .riv |
| npm packages | `npm i motion gsap @gsap/react @lottiefiles/dotlottie-react @rive-app/react-canvas` |

## 7. Accounts SylJo Tech needs invited to
Vercel team · Supabase org · GitHub repo · Bunny · Stripe (developer role) · Resend · Meta Business (developer) · Google Analytics/Search Console/GTM · Sentry

## 8. First-run check
```bash
node -v && claude --version && supabase --version && vercel --version
claude mcp list        # magic, supabase, context7, playwright
```
Then open the folder: `claude` → paste the kickoff prompt from MASTER_PROMPT.md.
