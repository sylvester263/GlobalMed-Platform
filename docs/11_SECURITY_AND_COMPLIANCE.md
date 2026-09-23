# 11 — Security and Compliance

## 1. HIPAA boundary
GlobalMed's service business handles PHI, but **this website and LMS are designed not to**. Rules:
- No form asks for patient information; every form and the chatbot show "Do not include patient information."
- Transcription/billing file exchange stays in GlobalMed's existing HIPAA-compliant systems. A secure client portal is a separate project requiring BAAs with every vendor (hosting, DB, email) and an ADR.
- Privacy policy and HIPAA notice pages reviewed by the client's compliance lead or counsel.

## 2. Auth
Supabase Auth, email verification required before purchase, password rules (min 10 chars, breached-password check if enabled), optional Google OAuth, session refresh via middleware, admin accounts require MFA (TOTP).

## 3. Authorization
- RLS on every table (see docs/04).
- Server-side role check in every Server Action and route handler (`requireRole('admin')`).
- Role changes only by admin; users can't escalate via profile update (policy check).
- Service role key used only in server code for webhooks, grading and certificate generation.

## 4. OWASP checklist
- [ ] Input validation with zod everywhere
- [ ] Output encoding (React default; sanitize markdown with rehype-sanitize)
- [ ] CSRF: Server Actions origin check (Next default) + SameSite cookies
- [ ] Rate limits: login, signup, reset, lead forms, chat, webhooks
- [ ] Turnstile on public forms
- [ ] Security headers: CSP, HSTS, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy
- [ ] File uploads: type + size checks, private buckets, signed URLs
- [ ] Webhook signature verification (Stripe, Meta)
- [ ] Secrets only in env; `.env*` in .gitignore
- [ ] Dependency audit in CI (`npm audit`, Dependabot)
- [ ] Error messages don't leak internals; Sentry scrubs PII

## 5. Data protection
Daily backups + PITR, storage buckets private by default, audit log for admin actions, data export/deletion on request (GDPR-style), cookie consent banner for analytics/pixels.

## 6. Legal pages (client to approve)
Privacy policy · Terms of service · Refund policy (courses) · HIPAA notice · Cookie policy.
