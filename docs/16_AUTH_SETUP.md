# 16 — Auth set-up runbook (Supabase)

Phase 3 code expects these Supabase Auth settings. Apply them to **staging and production** once the projects exist (P0-4). Nothing here is needed for local UI work; without Supabase the app fails closed (dashboards redirect to `/login`, auth forms say accounts aren't open yet).

## 1. URL configuration (Authentication → URL Configuration)
- **Site URL:** `https://globalmedtranscriptions.com` (staging: the staging URL)
- **Redirect URLs:** `https://<site>/auth/callback`, `https://<site>/auth/confirm`, and `http://localhost:3000/**` for local development only.

## 2. Email (Authentication → Providers → Email, and Email Templates)
- **Confirm email:** ON (docs/11 §2: verified email before purchase).
- **Secure password change:** ON. **Minimum password length:** 10. **Leaked password protection:** ON (Pro plan).
- **Custom SMTP:** Resend (same sending domain as the app, SPF/DKIM/DMARC per docs/14 §7).
- **Templates** must use the server-side token-hash links, not the default `{{ .ConfirmationURL }}`:

| Template | Link |
|---|---|
| Confirm signup | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next={{ .RedirectTo }}` |
| Reset password | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery` |
| Change email | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change` |
| Invite user | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/dashboard/account` |

`/auth/confirm` validates `next` (same-site paths only), so a tampered link can't redirect off-site.

## 3. Google sign-in (P3-2)
1. Google Cloud Console → OAuth consent screen (external, app name "GlobalMed", support email, privacy/terms URLs).
2. Credentials → OAuth client (Web). Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Supabase → Providers → Google: paste client ID and secret.

## 4. Two-step verification (P3-6)
Authentication → Multi-Factor → **TOTP enabled**. Admins are forced to enrol (`requireAdminMfa`): without a verified factor they're sent to `/dashboard/account#security`; with one, to `/mfa` until the session reaches `aal2`. Server actions for admin work call `authorize(["admin"])`, which also requires `aal2`.

## 5. Rate limits
Supabase's built-in auth rate limits stay on. The app adds its own per-IP limits (`lib/security/rate-limit.ts`: login 10/5 min, sign-up 5/h, reset 5/h, MFA 10/5 min), backed by Upstash in production.

## 6. First admin account
Roles can only be changed by an admin (RLS), so the first admin is promoted once, in the SQL editor:

```sql
-- 1. Sign up normally at /signup and confirm the email.
-- 2. Then, as the project owner:
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'owner@globalmedtranscriptions.com');
```

The new admin then signs in, is sent to set up two-step verification, and can promote staff (instructor, sales) from the Users page (P8) — until then, with the same SQL using the staff member's email and role.

## 7. Checks after set-up
- `/signup` → confirmation email → link lands on `/dashboard/student`.
- `/reset-password` → email → `/reset-password/update` → new password works.
- Google sign-in returns to the page you started from.
- An admin without MFA can't open `/dashboard/admin` until they enrol; with MFA they're challenged at `/mfa`.
- A student opening `/dashboard/admin` is sent back to their own dashboard.
