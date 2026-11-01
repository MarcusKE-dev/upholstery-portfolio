# SEO implementation baseline

Recorded 26 October 2026 before application edits. Branch: main. Existing untracked owner audit `WEBSITE_SEO_CONTENT_AUDIT.md` preserved. AGENTS.md is empty. No existing tracked modifications.

## Verified source
- Routes: `/`, `/all-photos`, `/admin`, POST `/api/inquiry`.
- Next 14.2.3, React 18.3.1, TypeScript 5.9.3, Tailwind 3.4.19, Supabase JS 2.107.0; existing node_modules and lockfile. No test suite or lint configuration.
- Root metadata uses Atelier and placeholder canonical/OG URLs. All-photos inherits homepage canonical. No sitemap, robots, structured data or admin noindex.
- Homepage gallery fetches all rows after hydration; all-photos also uses unbounded reads. Project cards hide descriptions on hover. Unknown routes use framework 404.
- Supabase projects fields: id, created_at, title, description, category, subcategory, image_url, before_image_url, alt_text. No confirmed slug, status or case-study fields. Configured taxonomy is not project evidence.
- Browser CRUD and public Storage bucket portfolio-uploads; site_settings stores artisan_image_url. No schema migrations or policy definitions found.
- Admin compares public environment password (with fallback) and trusts sessionStorage. This is NOT authentication. RLS and Storage write policy status unknown; no mutation tests authorized.
- Inquiry API checks only truthiness and interpolates unescaped input; Resend onboarding sender, CHARLES_EMAIL recipient. Delivery unverified.
- Visible identity Charles' Interiors conflicts with Atelier variants. Source contact email is charlieluner@gmail.com; phone from public environment; hours/neighbourhoods are existing claims needing owner confirmation.
- Homepage numerical claims, qualifications, material origins and testimonials unverified. Do not propagate to new content.
- No verified production hostname or deployment link found. Environment values will never be included in reports. Explicit NEXT_PUBLIC_SITE_URL required, localhost safe fallback; noindex when unconfigured or preview.

## Plan and exact edit areas
- lib/site.ts, app/layout.tsx, sitemap.ts, robots.ts, admin/layout.tsx, social image/icon: central identity/origin and metadata.
- components/Navbar, shared PublicPage/Footer/content components; preserve cream/espresso/gold, serif displays, Jost and generous spacing.
- Typed lib/content.ts and app services/guides/about/contact/process routes; six complete guides, three confirmed service families. Full interior design and central FAQ deferred pending scope/usefulness.
- lib/public-projects.ts read boundary; server-rendered bounded portfolio, pagination and initial homepage cards. Preserve Supabase CRUD/media. No indexable case studies or category pages without reviewed real evidence; explicit allowlist to support later publication without schema changes.
- Existing Hero, Gallery, ProjectCard, InquiryForm, Contact, CSS and admin modal: focused clarity, accessibility and validation fixes.
- app/api/inquiry/route.ts: typed bounded validation and HTML escaping, no email tests or destination changes.
- Required inventory, report and migration plan.

## Unresolved dependencies
Owner brand/contact confirmation, production origin, real project evidence/media rights, service policies, full interior design scope, credentials/testimonials, deployed RLS/Storage authorization, verified Resend sender, patched framework review. Public DB access must be checked read-only; failures must remain distinct from empty collections.

## Verification checklist
- [x] TypeScript and production build passed; missing lint configuration/tooling documented.
- [x] Implemented independent public routes checked for metadata, H1, JSON and links; actual portfolio data unavailable.
- [x] Sitemap and robots/admin directives checked; unconfigured/preview behavior tested.
- [x] Missing/unapproved routes return 404; portfolio outage returns 500 with clear browser error view.
- [x] Homepage and admin UI checked; gallery outage checked, live records unavailable; no writes or real email sends.
- [x] Representative mobile/keyboard/menu/form/modal/reduced-motion checks completed; full live media checks remain pending.
- [x] Diff whitespace, targeted credential-pattern scan and generated/unrelated file review completed.
- [x] Live limitations documented; no deployment.

## Verification closeout (27 October)

Implementation and final results are in SEO_IMPLEMENTATION_REPORT.md. Actual project data and deployed policies remain unavailable after read-only DNS retries. New publication approval registries remain empty. No backend migration or production deployment was performed. The site configuration and inventory describe the release requirements.
