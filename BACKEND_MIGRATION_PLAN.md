> Historical planning/audit context. Current implementation, configuration and verification are documented in [README.md](README.md) and [VERIFICATION.md](VERIFICATION.md). A fresh installation needs no Supabase migration.

# Backend migration plan (preparation only)

No backend, schema, policy, Storage or production resource was changed in this implementation.

## Critical authorization issue

The current `/admin` login compares a `NEXT_PUBLIC_ADMIN_PASSWORD` value in browser JavaScript and trusts `sessionStorage.atelier_admin`. The fallback password is also in source. Anyone can bypass this UI gate. Public environment values are not secrets. Noindex and robots directives do not protect writes.

Actual deployed database RLS and Storage policies could not be inspected from this repository. A public read failed DNS resolution both inside and outside the sandbox. No writes were attempted. Do not claim writes are protected. Before expanding administrative functionality, review account-controlled policy definitions and replace the browser gate with real authenticated sessions and enforced server/database authorization. Review any reused password and rotate it wherever it is a real secret.

## Current integration and assumptions

- `lib/supabase.ts`: browser/server Supabase client, project CRUD, image upload/delete and artisan setting upsert. Existing admin components use this directly.
- Inferred `projects` fields: id (string), created_at, title, description, category, subcategory, image_url, optional before_image_url, alt_text. This TypeScript shape is not a verified SQL schema. Unique constraints, actual types, defaults and RLS are unknown.
- Category IDs: residential, window, bedroom, automotive. Subcategories are configured in `lib/constants.ts`. Their presence does not prove project evidence.
- `site_settings`: key, value, updated_at; key artisan_image_url stores the profile photo URL. Actual constraints unknown.
- Public Storage bucket: portfolio-uploads. Existing upload object names are time/random based, public URLs retained. Admin compression targets WebP, <=1200px for projects and <=800px for the artisan photo. No renaming or media migration performed.
- Current delete flow removes a row before Storage objects; replacement images may leave old objects. Future cleanup must consider shared references and retriable failures.
- `lib/public-projects.ts` is the new public read boundary, separate from admin writes. It selects known fields, bounds queries, orders by created_at then id and uses no-store with an 8-second timeout. New informational pages do not depend on Supabase.
- Guides/services: typed source-controlled records in `lib/content.ts`; no article database/editor. Case studies and category approval registries in `lib/public-projects.ts` are intentionally empty pending evidence. Registry slugs are immutable and independent of title edits. Existing records/media are intact.

## Environment variables (names only)

Current: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_ADMIN_PASSWORD, NEXT_PUBLIC_WHATSAPP_NUMBER, RESEND_API_KEY, CHARLES_EMAIL. Local configuration also contains GROQ_API_KEY, which has no identified role in this application. New configuration: NEXT_PUBLIC_SITE_URL; optional RESEND_FROM_EMAIL. Never export values in documentation or client code except deliberately public configuration. Retire the browser password after real auth is available.

## Minimal replacement design

1. Inventory actual database schema, policies, row counts and media references through an authorized account. Export metadata and originals into access-controlled backups. Record permissions, copyright/client consent and which records are public.
2. Choose a maintained relational database with persistent availability plus object storage. Compare storage/egress, backup and restore support, retention, region, maintenance burden and cost at the actual portfolio size. Do not choose a provider solely because its free tier exists.
3. Add secure administrator authentication with server-validated sessions, appropriate session expiry, CSRF protections where relevant and authorization on every write. Deny anonymous writes to metadata and media. Keep storage credentials server-side; use constrained signed uploads if necessary.
4. Preserve project IDs, category mapping, timestamps and old image URLs during transition. Add explicit publication status, immutable unique slug, actual update dates and reviewed case-study content through a separately reviewed migration. Do not infer publication from description length.
5. Copy media to object storage, verify byte counts/checksums and content types, and record old-to-new URLs. Preserve alt text and before/after relationships. Keep old URLs usable until replacements and references are verified.
6. Implement the replacement behind the public read boundary and an authenticated admin service. Test add/edit/delete/upload, failures and permissions in staging using disposable fixtures. Preserve the existing admin workflow and source-controlled guide rendering.
7. Compare exported counts and sampled records/media, review publication/privacy, verify canonical routes and sitemap, then perform an owner-approved cutover with rollback. No cutover is authorized by this document.
8. Retain backups and old resources until restore and rollback are demonstrated and deletion is separately authorized. Monitor reads, writes, orphaned media and inquiry delivery.

## Required acceptance checks for that future phase

Anonymous writes denied; authenticated authorized writes work; users cannot acquire privileges by changing browser storage; safe upload types/size limits; stable public URLs; drafts inaccessible; backups restore; media integrity preserved; no service keys in bundles; updates visible without stale caches; no destruction of production data during tests.

## Framework risk, separate from migration

Next.js remains at the existing 14.2.3 version. This is not a security sign-off. The official [Next.js advisory](https://github.com/vercel/next.js/security/advisories/GHSA-5j59-xgg2-r9c4) lists 14.2.35 for that particular DoS fix. Review all current advisories and supported release lines before choosing a tested upgrade; one historical patch does not establish present security. The current [Next.js security updates](https://nextjs.org/blog) should be checked as part of that work. A framework upgrade must not be conflated with replacing Supabase.
