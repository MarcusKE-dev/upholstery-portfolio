> Historical planning/audit context. Current implementation, configuration and verification are documented in [README.md](README.md) and [VERIFICATION.md](VERIFICATION.md). A fresh installation needs no Supabase migration.

# SEO implementation report

Implementation dates: 26–27 October 2026. Local source changes only. Nothing deployed; no database, Storage, project records or media URLs modified. The pre-existing untracked audit is preserved.

## Implemented

Sixteen intended public pages now form the initial structure: home, portfolio, service directory and three service pages, about, contact, process, guides index and six complete guides. Shared navigation links work from nested routes. Cream backgrounds, espresso text, restrained gold, existing display typography, spacing and homepage section layout are retained.

Service scope is limited to the existing advertised upholstery, beds/headboards and window furnishings. The directory explains narrower furnishing work. Full interior design consultancy and a central FAQ are deferred rather than filled with unconfirmed claims or duplicate answers. Useful service FAQs use native details/summary controls and remain in HTML.

The guides explain restoration decisions, velvet/leather, window coverings, care, coordinated textiles and upholstery construction. Comparison tables appear where useful. Care and foam articles link directly to manufacturer/industry references. No fabricated customer examples, stock projects, author credentials, social proof, prices or business policies were added. No decorative stock imagery was needed. Initial source-publication dates are 27 October 2026; confirm the intended first public release date before deployment. No artificial update dates or authors were assigned.

## Metadata and indexing

- `lib/site.ts` centralizes provisional Charles' Interiors identity, existing source email, valid configured telephone, Nairobi, language en-KE and locale en_KE.
- NEXT_PUBLIC_SITE_URL is the explicit trusted HTTPS production origin. No incoming host or preview hostname is used to construct canonical URLs. Invalid path/query/credential-bearing origins fail validation. `.env.example` documents names and requirements.
- When origin is unset, localhost is a development fallback and pages are noindex; sitemap is empty. With an explicit production origin public pages are indexable. VERCEL_ENV=preview remains noindex and has no public sitemap entries. Set these at build time and rebuild, since informational pages are pre-rendered. No deployment settings were changed.
- Distinct route titles/descriptions, route canonicals, absolute OG URLs, Twitter cards and metadataBase replace placeholder public metadata. First-party generated 1200×630 PNG social image and SVG C monogram icon are accessible routes; the icon is explicitly selected in metadata. The legacy ICO asset remains preserved.
- Native sitemap includes 15 independent canonical content pages plus the portfolio hub when its bounded read succeeds, only in configured production mode. A backend outage omits the hub instead of listing a known error URL. Guide dates are actual source publication dates; other pages have no fabricated lastModified. Admin, API, redirect, filters, pagination, missing/unapproved projects/categories and absent articles are excluded.
- Robots allows public crawling and references sitemap only when indexable. API paths are disallowed. Admin remains crawlable so its noindex can be read; both admin and API have explicit noindex/nofollow response headers, and admin has matching metadata. These directives do not secure the application.
- Filtered/paginated portfolio views are navigation aids with noindex. The main page has its own canonical; paginated pages have page-specific canonicals. Unknown articles/services, unknown/unapproved categories/projects and invalid filters/pagination use notFound().
- `/all-photos` now redirects to the implemented portfolio hub (308). Its historical URL is omitted from sitemap. No permanent domain or neighbourhood doorway pages were invented.

## Project evidence and data freshness

The configured Supabase hostname failed EAI_AGAIN in the sandbox and ENOTFOUND on the approved retry outside it. No actual row, completed-project count, publication status or policy was verified. Categories in source are taxonomy only.

`lib/public-projects.ts` keeps public reads bounded and separate from admin CRUD, with explicit selected fields, stable created_at/id ordering, pagination, no-store and an 8-second timeout. Homepage requests six records plus a pagination look-ahead; the portfolio requests twelve plus one. Category and subcategory filtering happen server-side. Essential public cards, titles, alt text and descriptions render on the server rather than after useEffect. Existing upload/compression/storage behavior is unchanged.

The portfolio error boundary deliberately distinguishes backend failure from an empty successful collection. Homepage degrades with an explicit temporary-unavailability message while retaining other content. Case studies and category registries are empty. Real reviewed evidence must be supplied before adding entries. Case-study routing uses an explicit immutable slug mapped to an existing ID and reviewed substantive text; no text-length heuristic silently publishes legacy uploads. Missing/deleted referenced records return 404. Category/detail templates are implemented but no indexable project pages are claimed. After evidence review, add tested routes to the sitemap deliberately; this implementation does not auto-publish database rows.

## Structured data

Server-rendered JSON-LD: WebSite and factual Organization on home; BreadcrumbList on informational pages; Service on the three service pages; Article on guides. Entity details are limited to visible brand, site URL, service scope, Nairobi and article content/date. JSON is escaped against script termination. No street address, LocalBusiness subtype, ratings, testimonial schema, invented author, fake FAQ rich-result markup or AI-specific schema is present.

## Homepage, accessibility and performance work

- Homepage communicates upholstery/restoration in Nairobi directly and links to services, guides and enquiry preparation.
- Removed the hidden footer keyword list and replaced it with visible service information and useful links. Existing unsupported numerical, credential, material-origin and full-room transformation claims were rewritten. Unverified testimonials are no longer rendered; their source component is retained for owner review.
- Shared navigation uses real nested-route destinations, named menu control, expanded/control attributes, hidden closed links and Escape/focus return. Desktop navigation begins at lg to avoid tablet overlap.
- Skip link, main landmarks, visible focus outlines, inquiry label associations, native form validation, status/error announcements and minimum readable small copy in modified public sections.
- Essential content no longer waits for reveal animations; reduced motion disables animation and smooth scrolling. Existing subtle visual treatment remains.
- Server gallery cards expose descriptions without hover. Responsive sizes and reserved aspect ratios remain; gallery images lazy-load, and reviewed detail templates prioritize only the main image. No unverified image materials/locations were inferred.
- Existing admin form labels and upload keyboard controls improved; edit modal has dialog name, focus entry/trap, Escape, named close and focus restoration. CRUD/schema behavior is unchanged.
- Moved existing font import before Tailwind rules so CSS import ordering is valid. No new runtime library or font family introduced.

Build measurements are reported below, but no before/after performance benchmark, Lighthouse result or Core Web Vitals improvement is claimed. Public informational pages are server/pre-rendered with client navigation and enquiry interactions. The homepage still includes the legacy client artisan-photo read; that setting's loading and fallback should be assessed with the real backend.

## Inquiry reliability

`app/api/inquiry/route.ts` now checks JSON format, bounded streamed request size, string types/lengths, email shape, category allowlist and control characters. Untrusted email HTML is escaped and a plain-text alternative is included. Missing delivery configuration returns 503, malformed input returns 400/413/415, and delivery failures return deliberate 502 messages without exposing provider details. Provider initialization happens after validation.

CHARLES_EMAIL is still the recipient. The existing onboarding sender remains the fallback; RESEND_FROM_EMAIL optionally permits an owner-configured verified sender. Neither destination nor sender configuration was silently changed. Confirm sender-domain verification, onboarding restrictions, recipient identity and actual delivery in an authorized test. No valid inquiry or real email was sent. Distributed abuse protection/rate limiting remains a production follow-up; validation is not spam prevention.

## Verification

- `npx tsc --noEmit`: passed.
- `npm run build`: passed on Next 14.2.3. Initial missing client declaration in project error boundary corrected. Final production build used isolated test origin `https://seo-verification.example` and VERCEL_ENV=production to verify enabled metadata; this is not a configured business hostname and is not in application source.
- `npm run lint`: invoked but could not complete; Next opened its first-time ESLint setup prompt. Repository has neither ESLint config nor installed lint packages. Build type checks passed; do not report lint as passed. No new lint dependency stack was introduced for this task.
- Configuration checks: unset origin and preview => noindex / zero sitemap entries; configured production => indexable / 16 entries with an available read; backend outage => 15 entries with the failed hub omitted; four unsafe origin forms rejected.
- `git diff --check`: passed at implementation review.

Additional completed checks:
- Source credential-pattern scan: 59 source/document/icon files, zero matched credential/private-key patterns. This is a targeted scan, not a full security audit.
- Admin browser check with intercepted synthetic reads: associated labels, edit-modal initial focus, forward/reverse focus trap, Escape, focus restoration and keyboard upload chooser all passed. Zero writes or real uploads. Setting the legacy session flag was sufficient to expose the local UI, confirming the documented insecure boundary.
- Final build first-load JS estimates: shared 87 kB, homepage 170 kB, most informational routes 95.9 kB, admin 182 kB. These are build estimates, not measured user performance or before/after gains.

Public browser/HTTP results (local production build):
- 15 backend-independent public routes returned 200 with distinct titles/descriptions, route-specific canonical URLs, one H1, indexable metadata under the test production origin and parseable JSON-LD matching their page types. The portfolio hub was tested separately because the configured backend is unavailable.
- Nine missing/unapproved/invalid cases returned genuine 404: unknown and prototype-like project/category slugs, an unapproved category, missing guide, deferred interior-design service, invalid category filter and invalid page number.
- Portfolio backend failure: HTTP 500 and a clear hydrated error view. Sitemap returned 200 with 15 URLs and omitted the failing hub. The outage view is a client error boundary, so its explanatory text appears after hydration; the server response is still an error, not an empty success page.
- Legacy `/all-photos`: 308 with Location `/portfolio`, enforced by Next configuration. Testing caught the older framework’s pre-rendered redirect response without a Location header; explicit configuration resolves it.
- Robots references the test canonical sitemap and permits public crawling. Admin returned 200 with both noindex metadata and noindex/nofollow response header; password label association verified.
- Layout checks at 375, 768 and 1024 pixels found no horizontal overflow on the tested guide. Mobile menu open/state, Escape and focus restoration passed at 375 and 768. Inquiry labels and native required-field validation passed on mobile.
- Six invalid JSON enquiry cases plus malformed JSON and unsupported content type returned the expected 400/413/415 statuses. No valid request was sent through the real email integration.
- Isolated inquiry handler tests with a stubbed Resend provider confirmed HTML escaping, plain text, successful mock dispatch, provider error 502 and missing-configuration 503. Zero network calls or real messages.
- Social PNG returned 200 with image/png. Sixteen unique internal URL targets were reviewed; non-portfolio targets had zero broken links. The known unavailable portfolio was checked as the deliberate error case, not counted as a successful content page.
- Desktop guide screenshot visually reviewed: restrained cream/espresso typography, readable long-form layout, references and CTA. Mobile contact screenshot captured. Screenshots and machine-readable browser results are in /tmp, not committed assets. This was not a full WCAG audit, contrast audit or physical-device test.

After the full browser pass, a focused metadata correction explicitly appends the provisional brand to the homepage title (root-segment title templates are not inherited there), and a final copy pass removes implementation-oriented wording from public services. The final production build passed after those changes. Focused Chromium smoke checks passed for the branded homepage title, SVG icon HTTP 200, five updated service/about routes, keyboard-operated native FAQ and article rendering under reduced motion.

## Outstanding confirmations and release blockers

1. **Critical: admin is not securely authenticated.** Browser password/sessionStorage checks are bypassable and NEXT_PUBLIC_ADMIN_PASSWORD is public. Actual Supabase RLS/Storage policies remain unknown. No write attempts were made. Establish real authentication and enforced authorization before expanding editing or treating the admin as protected.
2. **Critical: framework upgrade.** Next 14.2.3 remains unchanged. A separate tested upgrade against current official advisories is required before production readiness can be claimed. See BACKEND_MIGRATION_PLAN.md for the official advisory reference; no assumption that a single historical patch resolves all current risks.
3. Confirm final business identity (Charles' Interiors versus Atelier variants), named people, email/phone, availability, scope/service area, project media rights and evidence. Credentials, numerical claims and testimonials need substantiation before reuse.
4. Supply the actual production Vercel origin and set NEXT_PUBLIC_SITE_URL in the appropriate environment, rebuild and verify real headers/canonicals/sitemap. Production indexing is deliberately disabled while no origin is set.
5. Restore/confirm the correct Supabase endpoint; inspect real projects and policies read-only. Review actual record quality before approving any case study/category. Until then, live gallery content and update freshness cannot be fully verified.
6. Confirm inquiry delivery setup and authorize a real delivery check. No real submissions were made.

Live deployment responses, TLS, Vercel preview protections, Google/Bing ownership/indexing, Business Profile, search performance, authentic project photos and real admin mutations remain unverified. There is no claim of deployment, indexing, rankings or AI citations.

## Files changed

Existing application: app/layout.tsx, app/page.tsx, app/all-photos/page.tsx, app/api/inquiry/route.ts, app/admin/page.tsx, app/globals.css, next.config.mjs; components/Navbar.tsx, Hero.tsx, ArtisanSection.tsx, ServicesSection.tsx, Contact.tsx, InquiryForm.tsx, WhatsAppFloat.tsx, AdminForm.tsx, AdminEditModal.tsx, AdminArtisanPhoto.tsx, AdminTable.tsx.

Added: lib/site.ts, lib/content.ts, lib/public-projects.ts; components/PublicPage.tsx, Footer.tsx, StructuredData.tsx, ContentSections.tsx, HomePortfolio.tsx, PortfolioGrid.tsx; app/about/page.tsx, contact/page.tsx, process/page.tsx, services/page.tsx, services/[slug]/page.tsx, guides/page.tsx, guides/[slug]/page.tsx, portfolio/page.tsx, portfolio/[category]/page.tsx, portfolio/error.tsx, projects/[slug]/page.tsx, projects/error.tsx, admin/layout.tsx, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg; .env.example and the four required project-root deliverables.

No package/lockfile, existing Supabase module, media URL or schema was changed. Build/browser artifacts and temporary check scripts remain ignored or in /tmp, not deliverables. The existing audit is untouched.
