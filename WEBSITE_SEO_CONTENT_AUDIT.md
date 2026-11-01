> Historical planning/audit context. Current implementation, configuration and verification are documented in [README.md](README.md) and [VERIFICATION.md](VERIFICATION.md). A fresh installation needs no Supabase migration.

# Website architecture, SEO, AEO and content audit

Audit date: 26 October 2026. Workspace: `/home/marcus/upholstery-portfolio`.

## 1. Executive summary

The application is a **Nairobi upholstery and interiors lead-generation portfolio**, rather than an established fine-art portfolio. Its visible brand is **Charles’ Interiors**; metadata, testimonials and administration retain **Atelier Upholstery / Atelier** wording, and the inquiry email uses **Atelier Charles**. The homepage promotes bespoke upholstery, furniture restoration, interior transformations, beds, curtains, cushions and automotive/commercial seating.

**“Appall study” is not defined or found in the inspected application content or repository snapshot.** It must be clarified with the owner. There is no verified painting, sculpture, art-study collection, artist biography, artwork sales catalogue or fine-art technique content. Adding art-style pages now would be disconnected from the available evidence.

The strongest growth opportunity is to make genuine furniture/interiors work discoverable through useful project case studies, focused service pages and a small set of practical guides. The current architecture supports that without a rewrite.

| Priority | Main finding | Recommended next-phase action |
|---|---|---|
| Critical | Admin access is a browser-side password comparison and session flag; database/storage write permissions are unknown | Introduce real administrator authentication and enforce authorization through Supabase policies before expanding editing capabilities |
| Critical | Next.js is pinned to 14.2.3, an affected version under a published App Router denial-of-service advisory | Review current official advisories and plan a tested upgrade to an appropriate patched, supported version |
| High | Canonical and social URLs point to `https://your-domain.com`; gallery inherits the root canonical | Establish the actual production origin and use correct route-specific canonical/social metadata |
| High | No source-defined sitemap, robots file, admin noindex policy or structured data | Add appropriate discovery/indexing controls and factual entity metadata after verifying deployment behavior |
| High | Projects have no detail routes; homepage fetches all projects after hydration and displays at most six per selection | Add server-rendered portfolio and substantive detail pages; preserve filters as an enhancement |
| High | Content mixes business names and unsupported credibility claims | Confirm business identity, testimonials, credentials, materials and service scope before reusing claims |
| High | Public inquiry delivery is unverified; API uses Resend’s onboarding sender | Verify sender/recipient configuration and delivery in an authorized implementation check |
| Medium | Low-contrast text, unnamed mobile menu button, unassociated input labels and hover-only descriptions | Improve accessible controls, text visibility and keyboard/touch behavior |

### Scope and evidence limits

This is a source audit with external documentation research. Only this report was added to the project. No packages were installed, no application files/dependencies were changed, no database writes or email submissions were made, and nothing was deployed. No build or development server was started, avoiding generated application artifacts and build-time remote calls.

Evidence labels used below:

- **Confirmed in source:** directly observable in tracked application/configuration files.
- **Observed read failure:** a read-only request to the configured public Supabase project endpoint failed with DNS resolution errors (`EAI_AGAIN` in the sandbox, `ENOTFOUND` on retry outside it). No project rows were retrieved. This does not establish that production uses the same configuration or that the production database is down.
- **Requires live verification:** the exact production Vercel URL was not established from the repository, local deployment metadata or a brief public search. It was requested from the owner. Live page responses, headers, redirects, rendered screenshots, mobile behavior and search-engine access were therefore not verified.
- **Opportunity / hypothesis:** a recommended page or topic grounded in existing service copy, subject to owner confirmation and content evidence.

There was no Search Console, analytics, keyword-tool or Vercel account inspection. There are no verified indexation claims, search volumes, rankings, traffic forecasts, Core Web Vitals results or Lighthouse scores in this report. External search was used for official technical guidance and production-URL discovery, not comprehensive competitor or keyword research. An existing `.next` directory is historical local output; it is not reliable evidence of current production behavior.

## 2. Verified application architecture

### Stack and dependencies

| Area | Verified implementation |
|---|---|
| Framework | Next.js **14.2.3**, App Router (`app/`), React/React DOM **18.3.1** in `package-lock.json` |
| Language | TypeScript with strict checking, TSX components; `@/*` alias points to project root (`tsconfig.json`) |
| Styling | Tailwind CSS **3.4.19**, PostCSS and substantial inline styling; global CSS and custom animations |
| Database/API client | `@supabase/supabase-js` **2.107.0**; Supabase table access from browser and server |
| Media | Supabase Storage public bucket `portfolio-uploads`; Next Image; `browser-image-compression` **2.0.2** |
| Inquiry email | `resend` **6.12.4** through a Next route handler |
| Icons | `lucide-react` (`^0.383.0` declared) |
| Tooling | TypeScript **5.9.3**; scripts: `dev`, `build`, `start`, `lint`; no test script or tracked test suite found |
| Hosting | Vercel subdomain stated by owner; no `vercel.json`, local `.vercel/project.json` or tracked deployment workflow found |

Versions above are lockfile evidence, not proof of deployed versions. The scaffold README claims Inter via `next/font`; actual source uses Google Fonts CSS for Cormorant Garamond, Playfair Display and Jost. The README is not a dependable architecture guide.

### Structure and data flow

| Location | Role |
|---|---|
| `app/layout.tsx` | Root HTML language, global CSS and shared metadata |
| `app/page.tsx` | Homepage composition and inline footer |
| `app/all-photos/page.tsx` | Async server component that reads projects and renders gallery cards |
| `app/admin/page.tsx` | Client-only dashboard/login gate, project list and editing state |
| `app/api/inquiry/route.ts` | POST inquiry validation and Resend email dispatch |
| `lib/supabase.ts` | Shared client, inferred project type, uploads, deletes, project CRUD and artisan setting |
| `lib/constants.ts` | Category IDs, display labels and subcategory options |
| `components/` | Public sections, project cards, inquiry UI and admin editing components |
| `app/globals.css`, `tailwind.config.ts` | Palette, font conventions, responsive styles and animation behavior |
| `public/` | Only scaffold `next.svg` and `vercel.svg`; no local portfolio or OG image asset |
| `repomix-output.xml` | Tracked source snapshot, not a CMS, runtime data export or separate route source |

`lib/supabase.ts` creates a client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The browser reads projects and the artisan image; browser admin components call the same client for mutations. There is no implemented Supabase Auth session, privileged server admin API, ORM, tracked SQL migration or database-policy definition. Supabase uses PostgreSQL, but the actual deployed schema, constraints, indexes and RLS/storage policies cannot be established from these TypeScript declarations alone.

The expected `projects` fields are `id`, `created_at`, `title`, `description`, `category`, `subcategory`, `image_url`, optional `before_image_url`, and `alt_text`. `site_settings` is read by `key = artisan_image_url` and stores a `value`; updates also supply `updated_at`.

Local configuration contains names for Supabase URL/anonymous key, public admin password, WhatsApp number, Resend key and inquiry recipient. Values were not printed or copied into this report. Presence locally does not establish Vercel configuration. A `GROQ_API_KEY` name exists locally, but no corresponding runtime integration is present in the inspected application.

### Administrator workflow

1. `/admin` compares input to a `NEXT_PUBLIC_` password and uses a known fallback if absent. It records `atelier_admin=true` in `sessionStorage`.
2. `AdminForm` accepts a required main image plus optional before image, title, description, category, subcategory and alt text. Missing titles become **Untitled**, missing descriptions become empty strings, category defaults to residential and alt text falls back to title.
3. Main/before project images are compressed toward WebP, maximum 1200px on the longest side and a 1MB target, using a worker. They upload directly to Supabase Storage; the public URL is inserted into `projects`.
4. `AdminTable` lists entries, offers edit and two-step delete confirmation, and formats creation dates in `en-KE`.
5. `AdminEditModal` updates text/category fields and replaces/adds images. No explicit remove-before-photo, publish/draft, featured ordering or SEO-field controls exist. Category changes do not explicitly reset subcategory in this modal, unlike the creation form; inconsistent pairs are possible.
6. `deleteProject` removes the database row, then attempts deletion of main/before storage objects. This is not atomic; a storage failure can leave orphan files and a stale dashboard view.
7. `AdminArtisanPhoto` uploads the original selected file without compression, then updates the setting. Its UI promises WebP/800px compression, which its active handler does not perform.

Replacement uploads do not remove prior image objects. No rich text, blog editor, media gallery per project, pricing, inventory, checkout, project slugs, pagination, revision history or editorial workflow is implemented.

### What to preserve

Preserve the cream/espresso/gold visual identity while adjusting text contrast; serif display and readable body typography; generous spacing; responsive grids; concise consultation CTAs; image upload and optional before-photo capability; existing Supabase investment; editable alt text; `next/image` usage; section anchors; and multiple contact options. Keep gallery filtering as a useful visitor feature while adding linkable category/detail routes.

## 3. Existing routes and page inventory

| URL | Source | Content / rendering | Discoverability and metadata |
|---|---|---|---|
| `/` | `app/page.tsx` | Server-composed homepage with several client sections | Shared title/description; one H1; placeholder canonical/social URLs |
| `/all-photos` | `app/all-photos/page.tsx` | Server-rendered full project grid; read errors caught and displayed | Linked from homepage; distinct title/description but inherited root canonical and social metadata |
| `/admin` | `app/admin/page.tsx` | Login screen, then client dashboard | No public navigation link; shared marketing metadata and no explicit noindex; obscurity is not access control |
| `/api/inquiry` | `app/api/inquiry/route.ts` | POST-only JSON/email handler, returns 400/500/200 by code path | Not a content page; no sitemap role. Actual hosting responses untested |
| `/favicon.ico` | `app/favicon.ico` | App Router file-based icon | Asset exists; branding suitability was not visually checked |
| `/next.svg`, `/vercel.svg` | `public/` | Scaffold assets | Not portfolio content |

No individual project/artwork, category, service-detail, blog, educational, About, Contact, FAQ, sitemap or robots route exists in source. No custom `not-found.tsx`, `error.tsx`, loading route, nested layout, middleware, redirect or rewrite configuration was found. Framework defaults may apply; their deployed status responses were not tested.

### Homepage presentation and purpose

The source defines a warm luxury/craft aesthetic with a radial cream hero, gold accents, thin decorative rules, serif headlines, dark service band, subtle reveal animations and a floating green WhatsApp button. This is a source-based visual assessment, not a rendered browser review.

| Sequence | Component / anchor | Actual content |
|---|---|---|
| Fixed header | `Navbar` | Charles’ / Interiors · Nairobi; Artisan, Portfolio, Services, Testimonials, Contact; Book Consultation; mobile toggle |
| Hero | `Hero` | H1: “Bespoke Upholstery & Interior Design for the Modern Home.”; positioning paragraph, portfolio/consultation buttons and three numerical claims |
| Artisan | `ArtisanSection`, `#about` | Design experience copy, claimed five-year history, Nairobi/Karen scope, materials, credential badges and setting-driven portrait |
| Portfolio | `Gallery`, `#portfolio` | Selected Works, four category filters, conditional subcategory filters, six-card limit, links to full gallery |
| Services | `ServicesSection`, `#services` | Six upholstery/furnishing service cards |
| Testimonials | `Testimonials`, `#testimonials` | Three hardcoded quotes with five-star decoration |
| Contact | `Contact`, `#contact` | Service area text, hours, phone, email, WhatsApp and inquiry component |
| Footer | Inline in homepage | Charles’ Interiors, current-year copyright, Nairobi and a screen-reader-only keyword list |

Navigation is shallow: `/` → `/all-photos`, which links back home. Homepage anchor destinations exist. Cards are non-link `<div>` elements despite `cursor-pointer`; there is no click action or detailed destination. Filters are buttons with state, not separate crawlable category URLs. `/all-photos` does not reuse the public header/footer and provides no category filtering or pagination.

## 4. Current content and subject matter

### Verified copy versus verified real-world facts

The code demonstrably **advertises** the following services; this does not independently verify delivery, credentials, availability or client history:

- Bespoke re-upholstery, sectional/wingback restoration and loose slipcovers.
- Chesterfield/chester beds, hand diamond tufting, headboards and scatter cushions.
- Frame repair, webbing replacement and foam renewal.
- Curtains, linen sheers, blinds and claimed automated roller blinds.
- Dining-chair sets, accent ottomans, footstools and “mockets.”
- Restaurant/corporate seating and automotive protective seat covers.
- Broader interior layouts and full-scale interior transformations in hero/about copy; no dedicated process, drawings or full-room case study is available in source.

No verified art product sales, originals/prints, art commissions, artist styles or art consultation offering can be inferred. No prices, consultation charges, contractual terms, delivery commitments or purchase system are defined. The form promises a personal response within 24 hours; confirm operational feasibility.

### Configured taxonomy, not a verified portfolio inventory

| Category ID / label | Configured subcategories in `lib/constants.ts` |
|---|---|
| `residential` / Bespoke Seating | Sofas, Dining Sets, Loose Covers, Mockets/Ottomans, Chesterfield Sofas, Sectional Sofas, Recliners, Love Seats, Accent Chairs, Banquette Seating |
| `window` / Window Dressings | Curtains, Blinds, Sheers, Roman Blinds, Pleated Curtains, Grommet Curtains, Roller Blinds, Vertical Blinds |
| `bedroom` / Beds & Accents | Chester Beds, Scatter Cushions, Victorian Beds, Leather Beds, Rustic Beds, Tuffed Headboards, Canopy Beds, Platform Beds, Ottoman Beds, Upholstered Headboards |
| `automotive` / Car Seat Covers | Car Seat Covers, Leather Seats, Custom Interiors, Headliners, Door Panels |

These options do **not** prove corresponding uploaded projects exist. No seed data or project export was found, and the attempted public read returned no records because of DNS failure. Actual counts, project titles/descriptions, image subjects and category coverage remain unknown. “Tuffed” likely needs editorial correction to “tufted,” but owner terminology should be checked. Clarify “mockets,” “chester beds,” and “appall study” rather than silently substituting meanings.

Styles/techniques mentioned include Chesterfield, Victorian, rustic, diamond tufting, pleating, pattern matching and textile tailoring. Materials named include Italian top-grain leather, Turkish velvet, linen, high-density foam and structural webbing. These are furniture/textile concepts, not evidence of visual-art movements or art collections.

### Audience and intent hypotheses

Likely audiences are Nairobi homeowners restoring seating; people furnishing bedrooms and windows; interior designers sourcing upholstery partners; and hospitality/commercial or automotive clients. Their likely needs are visual proof, service fit, repair-versus-replace advice, material selection, process, quotations and contact. Those audience inferences are grounded in copy, not measured user research.

The contact section states Nairobi, Karen, Lavington and Westlands, Monday–Saturday 8am–6pm, a public Gmail address and environment-driven telephone/WhatsApp. There is no street address, map, verified business registration, independent profile or social account link in source. Do not invent these. A placeholder telephone is used when the environment value is absent; local presence does not establish production validity.

### Claims needing owner evidence

`Hero` claims 5+ years, 300+ restored pieces and 100% handcrafted work. `ArtisanSection` claims City & Guilds certification, five years of experience, premium imported materials and broad interior transformations. `ServicesSection` claims “15+ year orthopedic foam,” automation and better-than-original restoration. Three testimonial names/quotes and five-star displays are hardcoded; authenticity and permission are unknown. Treat all as claims to validate, not audited credentials or review evidence. Do not propagate unsupported statements into schema or new articles; avoid medical-benefit implications from “orthopedic” without appropriate substantiation.

## 5. Technical SEO audit

| ID / priority | Evidence and finding | Likely impact | Next-phase approach / dependencies |
|---|---|---|---|
| SEO-01 High | `app/layout.tsx:36` sets canonical to `https://your-domain.com`; `/all-photos` overrides only title/description | Sends an incorrect preferred-URL signal, including from a distinct gallery | Confirm real production origin, define one trusted site URL and self-canonicals for public routes; verify rendered head |
| SEO-02 High | OG URL/image and Twitter image also use placeholder host; no `/og-image.jpg` asset exists locally | Shares refer to unrelated host and unprovided artwork; invalid preview likely | Supply an owned image and route-specific OG URL/title/description; test actual image responses |
| SEO-03 High | Charles’ visible branding versus Atelier metadata/admin/testimonials/email | Unclear business entity and inconsistent snippets/shares | Owner confirms primary name; align visible copy and metadata. Preserve historical names only if factually useful |
| SEO-04 High | No `sitemap.ts`, sitemap XML or robots source file | No source-managed discovery list or documented crawler policy | Add native App Router sitemap/robots routes; list only canonical published pages, exclude admin/API/previews. Missing robots alone does not mean crawling is blocked |
| SEO-05 High | `/admin` inherits root metadata; no explicit robots directive or server authentication | Login page could be eligible for discovery, subject to hosting; admin is not securely protected | Auth first; admin-specific `noindex` via server layout/header. Robots exclusion is not security and can prevent a crawler seeing noindex |
| SEO-06 High | `Gallery` gets project data in `useEffect`, fetches every record and slices six; categories have no URL | Portfolio content absent from initial server HTML, weaker non-JS access and no category landing pages | Server-render useful initial cards; link to curated category/detail pages; preserve client filters. Client components can still SSR static text: the specific issue is effect-fetched records |
| SEO-07 High | `ProjectCard` and full-grid cards have no links; no dynamic project route | No individual landing page for case-study text, share links or image context | Add substantive `/projects/[slug]` pages and real anchor links; owner-supplied project evidence required |
| SEO-08 Medium | `AdminForm`/edit accept “Untitled,” empty description and title-only alt | Potential thin/unhelpful entries and repeated titles; actual prevalence unknown | Add publish-quality validation and editorial review; do not bulk-index image-only placeholders |
| SEO-09 Medium | `/all-photos` catches fetch exceptions and renders a message in normal page flow | Risk of an error-looking page with normal status and cached empty/error output | Define transient failure behavior, monitoring and cache policy; validate actual HTTP statuses and freshness |
| SEO-10 Medium | One H1 each on home/gallery; home has H2/H3 structure, gallery jumps H1 → H3 | Mostly useful hierarchy; gallery card headings skip a level | Use H2 for gallery item headings or a labeled H2 section; add main landmark on gallery and descriptive intro |
| SEO-11 Medium | Hidden footer paragraph is a list of material/local keywords (`app/page.tsx`) | Poor screen-reader experience, little useful context; unnecessary hidden SEO text | Replace with visible, useful service/material explanations where relevant. Do not claim a spam penalty without evidence |
| SEO-12 Medium | No JSON-LD or breadcrumbs | Limited explicit entity/hierarchy explanation; no eligible breadcrumb markup | Add visible breadcrumbs to nested pages, then matching data; see section 6 |
| SEO-13 Medium | Root description mixes several exact phrases; `keywords` array exists | Description reads more like a keyword list than a useful preview | Write natural summaries matching each page; do not invest in meta-keyword expansion |
| SEO-14 Medium | No evidence of live redirects, 404 behavior, headers or preview policy | Technical eligibility cannot be concluded | Verify production/preview status, CDN protection and robots headers once URL is supplied |

There are no confirmed broken external business/social links because destinations were not tested. The **placeholder metadata targets are confirmed defects**, whereas broken phone links are conditional on missing deployment configuration. Homepage anchors match their section IDs. Reusing `Navbar` on new pages without changing `#contact` etc. to root-qualified or appropriate local destinations would produce missing-section links.

The homepage and full gallery intentionally overlap in projects. That is not automatically harmful duplicate content: they serve selection versus browsing purposes. Different introductions, correct canonicals and substantive detail pages would clarify their roles. Repeated title display within a card and repeated brand metadata are content-quality issues, not proof of a search penalty.

## 6. AEO and AI search readiness

The site has a clear headline, service descriptions and contact context, but little answer-focused explanatory content. Visitors cannot currently read a specific restoration case study, compare suitable materials in depth or find substantiated answers about process, quotation factors, fitting and care.

Google states that supporting links in AI Overviews/AI Mode require a page to be indexed and eligible for a Search snippet; eligibility does not ensure crawling, inclusion or visibility. There is no special schema requirement. These are published criteria, **not a finding that this site meets them**. Other assistants have their own retrieval policies; no universal inclusion mechanism or guarantee exists. [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

### Content approach

- Start service and guide pages with a brief direct explanation answering their main question, then support it with project-specific evidence, images and clear sections.
- Explain what is repaired or made, suitable use cases, limits and what information is needed for a quote. Avoid unsupported prices, timeframes or guarantees.
- Prefer original before/after case studies with actual materials and decisions over generic luxury language. Differentiate foam density from firmness using accurate supplier information.
- Add genuine author/reviewer identity only with consent and verifiable experience. Cite reliable manufacturer instructions for fabric/leather care; avoid universal cleaning recipes.
- Make titles, image captions and contextual links descriptive. Keep important answers visible, server-rendered and readable without interaction.
- Use a small number of page-specific FAQs, with longer guidance linked once rather than copied across every route.

### Structured data plan

| Candidate | Defensible use | Constraints |
|---|---|---|
| `Organization` / appropriate `LocalBusiness` | Confirmed business name, URL, logo, contact, service area and hours where visible | Choose a truthful type; do not invent street address, coordinates, profiles or business facts to satisfy a validator. Google local-rich-result requirements may remain unmet without required verified facts |
| `WebSite` | Consistent site name and canonical origin | No fabricated search-action endpoint; the current site has no site search |
| `BreadcrumbList` | Actual visible hierarchy on project, category and guide pages | URLs/names must match navigation; no breadcrumb claim for nonexistent hierarchy |
| `Article` / `BlogPosting` | Substantive guide/editorial pages with truthful dates and author/reviewer | No fake credentials, authors, update dates or promise of AI citations |
| `CreativeWork` / `ImageObject` | Describing genuine case-study/media content where useful | A furniture restoration is not automatically a fine-art `VisualArtwork`; general vocabulary is not a guaranteed Google rich-result feature |
| `Service` | Accurately described service pages | No promise of a generic service rich result; use only supported facts |
| `Product` / offers | Defer unless actual purchasable products and accurate offers are introduced | No invented prices, stock or review markup for enquiry-only portfolio entries |

Do not add aggregate ratings based on three hardcoded testimonials or self-awarded stars. Verify consent and authenticity before retaining quotes. Schema must describe visible content; passing a validator does not guarantee an enhanced result. [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

As of this audit, Google’s documentation changelog states that FAQ rich results stopped appearing on **7 May 2026**, with documentation removed in June. Recommend helpful visible FAQs for visitors, not FAQ schema as a Google rich-result tactic. This supersedes older advice restricting them to government/health sites. [Google documentation updates](https://developers.google.com/search/updates).

Do not prioritize `llms.txt` or an “AI schema” package. Google’s June 2026 clarification says `llms.txt` does not affect its Search visibility/rankings. Consider such a file only if a specific external consumer has a documented use and somebody will maintain it. It cannot fix wrong canonicals or thin pages. [Google documentation updates](https://developers.google.com/search/updates).

## 7. Performance and accessibility findings

### Performance: source evidence, not measured outcomes

| Finding | Evidence / implication | Recommendation |
|---|---|---|
| Unbounded data reads | `getProjects()` selects `*` without range/limit; home downloads all rows but displays six | Server query only needed records; server-side filtering/pagination for a growing full gallery |
| Client data waterfall | Home project and artisan reads start after hydration | Fetch public content on server, pass it to small interactive components; avoid shipping unnecessary CRUD helpers to public bundles |
| Broad client boundaries | Hero, services, navigation, artisan, gallery and inquiry are client components; some need only CSS | Keep meaningful interactions client-side, make static content server-rendered where useful; verify bundle effect before claiming a reduction |
| External font CSS | `@import` for three font families/weights after Tailwind directives; no `next/font` import | Verify compiled CSS, whether the import survives correctly, font requests, layout shifts and fallbacks; later consider `next/font` or self-hosted optimized subsets |
| Image sizing mismatch | Artisan uses `50vw` below 1024px despite a one-column layout; full gallery’s 3-column md breakpoint is not represented in sizes | Match `sizes` to actual containers/breakpoints; inspect chosen image widths in browser |
| Optimization foundations exist | Public images use `Image` with `fill`, reserved aspect-ratio containers and `sizes` | Preserve layout reservation and lazy loading below fold; choose priority only for an actually measured above-fold LCP image |
| Full gallery grows indefinitely | Every project produces a card and image node | Add bounded pages with crawlable next/previous links if growth warrants it |
| Artisan upload bypasses compression | Active handler uploads original despite advertised 800px conversion | Align implementation and UI; establish dimensions/size policy and preserve originals deliberately |
| No explicit gallery freshness policy | Async server read has no route-level revalidate/dynamic setting | Verify Next 14 caching behavior and production freshness; define explicit policy plus secure invalidation after changes |

Supabase Storage upload requests specify one-hour cache control. Next Image supplies its own optimized delivery path; actual negotiation, encoded format, CDN behavior, cache headers, image dimensions and byte weights were not measured. `next.config.mjs` allows public-object paths on `*.supabase.co` and Unsplash, but no source content demonstrates Unsplash use. Restrict remote hosts to those actually required when reviewing media policy.

Potential LCP risks include fonts, delayed portrait loading and animation-delayed headline visibility; INP risks require profiling real interactions; aspect ratios help mitigate image CLS. None establishes a failing Core Web Vital. Run mobile and desktop diagnostics against production, then use field data if available; small sites may lack CrUX coverage.

### Accessibility

| Issue | Source evidence | Next-phase improvement |
|---|---|---|
| Low contrast | Gold `#C9A84C` on cream `#FDFAF4` ≈ **2.19:1**; gold on `#FAF5E9` ≈ **2.10:1**; white on WhatsApp green ≈ **1.98:1**; inquiry hint `#B8A090` on cream ≈ **2.38:1** | Darken text/change button text or background; reserve gold for suitable non-text accents. These are computed source-color pairs, not screenshot measurements |
| Unnamed menu button | Mobile `Navbar` button contains only Menu/X SVG; no accessible name or expanded/controls state | Add clear name, `aria-expanded`, `aria-controls`, appropriate focus handling |
| Collapsed links can remain focusable | Mobile nav is hidden through max-height/overflow only | Ensure closed links are removed from focus/navigation and accessibility exposure |
| Unassociated form labels | Inquiry and admin labels lack `htmlFor`/matching IDs; inputs are not wrapped by labels | Associate labels, add appropriate autocomplete and required state |
| Form semantics/validation | Inquiry UI uses divs and click handler, not form submit; checks only truthiness | Use form semantics and meaningful server validation, enable expected keyboard submission, expose errors/status accessibly |
| Hover-only descriptions | `ProjectCard` overlay appears only on hover, card is not focusable | Put essential descriptions in visible captions/details; use real links and keyboard focus styles |
| Motion/no-JS readability | `.reveal` starts at opacity 0 until IntersectionObserver adds visible; no reduced-motion rule; infinite pulse/shimmer | Default meaningful content visible; progressively enhance motion; honor reduced-motion preferences |
| Missing navigation aids | No skip link; gallery wrapper is a div; fixed header has no source-defined anchor offset | Add main/skip link and scroll offset; test keyboard position after section navigation |
| Admin modal controls | Edit overlay lacks dialog semantics/focus containment/restore and close-button name | Accessible dialog pattern, named icon controls and keyboard escape support |
| Small type and overlap risk | Several labels use 0.6rem; floating WhatsApp button fixed bottom-right | Test 320px widths, 200–400% zoom, touch targets and form overlap; horizontal clipping can conceal overflow rather than fix it |

WCAG text contrast generally requires 4.5:1 for normal text and 3:1 for large text, with defined exceptions. The low-contrast heading accents and CTA text merit review; decorative lines/logotypes have different treatment. These checks are not a full accessibility conformance assessment. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### Critical reliability/security dependencies

The public admin password is compiled for browsers, and the session flag can be set by a visitor. The UI gate is therefore not a security boundary. **No unauthorized write was attempted.** Whether anonymous users can modify data depends on deployed RLS and Storage policies, which remain unknown. If anonymous writes are blocked, the present dashboard may fail; if permitted, direct mutations may be possible. Use actual authenticated admin identities with least-privilege policies; keep service-role credentials server-only. [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

Next 14.2.3 App Router falls within the affected range in the official December 2025 RSC denial-of-service advisory. That advisory lists 14.2.35 as its 14.x fix; it is **not** a statement that 14.2.35 is the latest suitable version in October 2026. Recheck all current advisories/support status and test the chosen upgrade separately. Do not claim every RSC vulnerability or remote-code-execution advisory applies to this version. [Next.js security advisory](https://nextjs.org/blog/security-update-2025-12-11).

`/api/inquiry` checks only required-field truthiness, interpolates input into HTML email, and has no implemented rate limiting, length/type validation or anti-spam controls. Next phase should validate and escape input and add proportionate abuse protection. There is no stored-inquiry table or delivery retry workflow in source. The onboarding Resend sender and locally present keys do not prove production delivery. Do not send a test inquiry without authorization to send email.

## 8. Proposed site structure and page opportunities

Build a small, evidence-backed first release. The tree below is a **possible eventual structure**, not a mandate to publish every branch immediately. Page IDs map to the complete opportunity specifications in section 9.

```text
/                                      existing homepage
/portfolio                             P01, successor to /all-photos
/portfolio/[category]                  P03–P06, only populated useful collections
/projects/[slug]                       P02, selected substantive case studies
/services                              P07
/services/sofa-reupholstery             P08
/services/upholstered-beds-headboards   P09
/services/curtains-blinds               P10
/services/interior-design              P11, scope/evidence gate
/about                                 P12
/contact                               P13
/process                               P14
/guides                                P15
/guides/reupholster-or-replace-sofa     P16
/guides/velvet-or-leather-upholstery    P17
/guides/curtains-blinds-sheers          P18
/guides/upholstery-fabric-care         P19
/guides/coordinate-sofa-curtains-cushions P20
/guides/tufting-foam-webbing            P21, optional glossary/resource
/faq                                   P22, conditional central index
```

No art-study or artwork taxonomy is proposed as an approved build. If the owner confirms an actual art practice, first inspect original works, media rights, intended terms and service scope, then conduct a separate artwork taxonomy/intent exercise. Room-specific art arrangement and art-care articles should wait for that evidence. Current decor advice can instead relate to upholstery, curtains and cushions.

## 9. Prioritized content and keyword opportunity map

**All queries below are preliminary hypotheses requiring validation.** No keyword-volume, difficulty, ranking or traffic values were available. Validate with owner questions, real project coverage, Search Console where available and localized SERP research before commissioning pages. High priority is relative implementation value, not predicted traffic. Page titles below can carry the confirmed brand as a suffix; the brand remains an owner dependency.

### Intent groups

| Group | Preliminary query examples | Relevant pages |
|---|---|---|
| Broad informational | what is reupholstery; how furniture restoration works; upholstery materials | P14, P16, P21 |
| Specific long-tail | should I reupholster a sagging sofa; what photos are needed for an upholstery quote; can curtains and sofa fabrics coordinate | P14, P16, P20 |
| Style/technique | Chesterfield diamond tufting; tufted headboard styles; velvet versus leather sofa fabric | P02, P09, P17, P21 |
| Interior/decor | curtains versus blinds; sheers privacy; matching curtains and cushions | P10, P18, P20 |
| Portfolio discovery | upholstery before and after Nairobi; custom headboard portfolio; curtain installation examples | P01–P06 |
| Commercial, grounded in advertised services | sofa reupholstery Nairobi; custom upholstered headboards Nairobi; made-to-measure curtains Nairobi | P07–P10, P13 |
| Conditional commercial | interior design Nairobi; custom car seat covers Nairobi; restaurant seating reupholstery | P11 and relevant collections/service sections, after scope/project verification |

Fine-art style queries and “appall study” have no verified content basis. Do not target them until clarified. Do not create near-identical Karen/Lavington/Westlands pages merely by changing place names; start with one truthful service-area explanation.

### Page specifications: discovery, services and supporting pages

Each entry supplies a title, URL, intent, primary topic, related questions, audience, H1/outline, internal links, unique value and priority. Dynamic/category entries are templates for genuinely supported records; placeholder project slugs are not actual existing works.

| ID / priority | Proposed title and URL | Intent / primary topic | Related topics / audience | Recommended H1 and sections | Internal links / unique value / dependency |
|---|---|---|---|---|---|
| P01 High | Upholstery & Interiors Portfolio; `/portfolio` | Discovery; upholstery before-and-after portfolio | What work has the studio completed? Seating, windows, beds; prospective clients/designers | H1: Upholstery & Interiors Portfolio. Intro; selected case studies; category links; browse projects; quotation CTA | Link home, P02–P06, P07, P13. A navigable proof hub replacing a photo-only list. Use real entries; redirect `/all-photos` only when replacement is ready |
| P02 High | `[Specific project] — Upholstery Case Study`; `/projects/[slug]` | Specific visual discovery and service evaluation; actual project subject | Original condition, chosen material, technique, result; owners with similar furniture | H1: factual project name. Short outcome; before/after; brief; condition; work performed; material decisions; result; related work | P01, actual category, relevant service, relevant guide, P13. Original first-hand evidence; publish only substantive records with permission and useful descriptions |
| P03 High, gated | Bespoke Seating Projects; `/portfolio/bespoke-seating` | Discovery; sofa/chair restoration examples | Sectionals, dining chairs, slipcovers, Chesterfields; homeowners/designers | H1: Bespoke Seating Projects. Collection scope; real project cards; restoration approaches; related advice; quote | P01/P02/P08/P16/P17. Groups comparable seating work. High only if distinct actual examples exist |
| P04 Medium, gated | Curtains, Blinds & Sheers Projects; `/portfolio/window-dressings` | Discovery; window-dressing examples | Light/privacy choices and fitted treatments; homeowners | H1: Window Dressing Projects. Intro; finished installations; material/function notes; guide; consultation | P01/P02/P10/P18. Real installations contextualize choice; require photos and project facts |
| P05 High, gated | Upholstered Beds & Headboards Portfolio; `/portfolio/beds-headboards` | Discovery; custom headboard examples | Tufting, bed styles, cushions; bedroom-furnishing clients | H1: Upholstered Beds & Headboard Projects. Scope; examples; design details; related service; enquiry | P01/P02/P09/P21/P13. Compare genuine design solutions rather than stock inspiration |
| P06 Low, gated | Car Seat Cover Projects; `/portfolio/car-seat-covers` | Discovery/commercial evaluation; custom seat-cover examples | Fit, materials, actual vehicle types; vehicle owners | H1: Car Seat Cover Projects. Actual scope; completed covers; fit/material notes; enquiry requirements | P01/P02/P07/P13. Demonstrates a secondary advertised offer. Defer without evidence; avoid implying safety or airbag compatibility |
| P07 High | Upholstery & Interior Furnishing Services in Nairobi; `/services` | Commercial navigation; upholstery services Nairobi | Which service fits my project? Seating, beds, windows, commercial/auto scope; prospective clients | H1: Upholstery & Interior Furnishing Services in Nairobi. Scope; service summaries; examples; process; enquiry | P08–P11 where supported, P01/P14/P13. Clear service chooser; differentiate from homepage overview |
| P08 High | Sofa Reupholstery & Repair in Nairobi; `/services/sofa-reupholstery` | Commercial; sofa reupholstery Nairobi | Frames, foam, webbing, fabric, repair versus replace, quote inputs; homeowners/designers | H1: Sofa Reupholstery & Repair in Nairobi. Suitable projects; assessment; repair scope; fabrics; examples; quote factors; FAQ; CTA | P02/P03/P14/P16/P17/P13. Specific buying guidance supported by real restoration evidence; no invented prices or warranties |
| P09 High | Custom Upholstered Beds & Headboards in Nairobi; `/services/upholstered-beds-headboards` | Commercial; custom upholstered headboards Nairobi | Tufting, dimensions, textiles, bed versus headboard scope; homeowners/designers | H1: Custom Upholstered Beds & Headboards. Available work; measurement/design; materials; examples; confirmed process; FAQ | P05/P02/P14/P20/P21/P13. Clarifies what is actually made and how a brief is assessed |
| P10 High | Made-to-Measure Curtains & Blinds in Nairobi; `/services/curtains-blinds` | Commercial; custom curtains Nairobi | Curtains/blinds/sheers, measurements, fitting, automation if verified; homeowners/designers | H1: Made-to-Measure Curtains & Blinds. Offered treatments; light/privacy; measuring/fitting scope; projects; quote factors; FAQ | P04/P18/P20/P14/P13. Connects design choice to genuine installation capability |
| P11 Medium, gated | Interior Design & Furnishing in Nairobi; `/services/interior-design` | Commercial; interior design service scope | Layout advice or full project delivery? Deliverables, boundaries, room evidence; owners/design partners | H1: Interior Design & Furnishing in Nairobi. Verified scope; deliverables; process; complete-room examples; exclusions; enquiry | P07/P02/P20/P12/P13. Resolves broad homepage claims. Publish only after owner defines service and provides evidence; avoid invented architectural qualifications |
| P12 High | About Charles’ Interiors; `/about` | Brand/entity research; business identity | Who is Charles? Experience and approach; evaluating clients/design partners | H1: About `[confirmed business name]`. Named practitioner; verified background; workshop approach; materials; service area; selected work | Home/P01/P07/P14/P13. Reconciles identity and substantiates trust; confirm consent and credentials |
| P13 High | Contact & Upholstery Project Enquiries; `/contact` | Transactional/navigation; upholstery quotation enquiry | What details/photos should I provide? Hours/area/response; prospective clients | H1: Discuss Your Upholstery or Interiors Project. Contact methods; verified area/hours; useful brief; accessible form; next steps | P07/P14/P01 and home. Stable shareable conversion page; no “free consultation” unless confirmed |
| P14 High | How an Upholstery Project Works; `/process` | Informational plus pre-enquiry; upholstery process | Assessment, quotation, selection, work, handover; first-time clients | H1: How Your Upholstery Project Works. Brief/photos; assessment; proposal; materials; work stages; collection/delivery if offered; aftercare; FAQs | P08–P10/P16/P19/P13. Replaces uncertainty with owner-confirmed steps; no invented lead times or logistics |

### Page specifications: educational and editorial

Use `/guides` as the initial editorial home; a separate `/blog` taxonomy is unnecessary for a handful of evergreen articles. These entries are the proposed blog/editorial topics as well as the educational page plan.

| ID / priority | Proposed title and URL | Intent / primary topic | Related topics / audience | Recommended H1 and sections | Internal links / unique value / dependency |
|---|---|---|---|---|---|
| P15 Medium | Upholstery & Interior Furnishing Guides; `/guides` | Informational navigation; upholstery advice | Material choice, restoration, windows, care; homeowners/designers | H1: Upholstery & Interior Furnishing Guides. Brief editorial purpose; grouped guide summaries; featured project; ask about a project | P16–P21, P01/P07. Useful curated entry point; publish once several substantive guides exist |
| P16 High | Reupholster or Replace Your Sofa?; `/guides/reupholster-or-replace-sofa` | Comparison; repair versus replace sofa | Frame condition, comfort, sentimental value, cost factors; homeowners | H1: Should You Reupholster or Replace Your Sofa? Direct answer; decision criteria; inspection limits; repair examples; quote information; next step | P08/P03/P02/P14/P13. Practical decision framework illustrated by actual repairs; assessment cannot be definitive from a generic article |
| P17 High | Velvet or Leather for Upholstery?; `/guides/velvet-or-leather-upholstery` | Comparison; velvet versus leather sofa upholstery | Finish, wear, cleaning, household needs, supplier specifications; owners/designers | H1: Velvet or Leather: Choosing Upholstery for Your Home. Comparison table; use cases; care differences; verified swatches/projects; selection checklist | P08/P09/P02/P19/P13. Honest material tradeoffs grounded in actual sourcing; no unsupported “best,” durability or imported-origin claims |
| P18 Medium | Curtains, Blinds or Sheers?; `/guides/curtains-blinds-sheers` | Comparison; curtains versus blinds | Privacy/daylight, layering, room use, measurements; homeowners | H1: Curtains, Blinds or Sheers: What Suits Your Room? Quick comparison; privacy/light; layering; room constraints; actual installations; consultation inputs | P10/P04/P20/P13. Visual decision aid using studio examples; confirm precise product specifications |
| P19 Medium | Caring for Upholstered Furniture; `/guides/upholstery-fabric-care` | Practical informational; upholstery fabric care | Care codes, spot treatment limits, velvet/leather differences; existing/prospective clients | H1: How to Care for Upholstered Furniture. Identify material; manufacturer instructions; routine care; spills; when to seek specialist help; limitations | P17/P08/P02/P14. Useful post-project resource; cite care labels/supplier sources, never prescribe one cleaning method for all materials |
| P20 Medium | Coordinating Sofas, Curtains & Cushions; `/guides/coordinate-sofa-curtains-cushions` | Decor inspiration/practical advice; coordinating upholstery and curtains | Palette, scale, texture, light, small living rooms; home decorators | H1: How to Coordinate Sofas, Curtains & Cushions. Start with room constraints; palette; texture/pattern; proportion; real-room examples; planning checklist | P03/P04/P05/P09/P10/P17/P18 and P11 only if supported. Integrates existing product areas; avoid generic art-selection advice without art evidence |
| P21 Low | Tufting, Foam & Webbing Explained; `/guides/tufting-foam-webbing` | Definitions; upholstery terms and techniques | What is diamond tufting? Density versus firmness? What does webbing do? First-time clients | H1: Upholstery Terms: Tufting, Foam & Webbing. Short definitions; annotated actual photos; functional differences; questions for an upholsterer | P08/P09/P02/P16. One concise resource instead of many thin glossary pages; technical accuracy and supplier facts required |
| P22 Low, conditional | Upholstery & Interiors Questions; `/faq` | Navigational/pre-enquiry; common upholstery questions | Where to find service, process and care answers; visitors with unresolved questions | H1: Upholstery & Interiors Questions. Short general answers; categorized links to canonical service/process answers; contact | P14/P08–P10/P19/P13. Useful only if recurring cross-site questions justify a separate hub; initially keep FAQs within relevant pages |

Start with P01/P02, P08/P09/P10, P12/P13/P14 and one useful guide. Category priorities depend on actual content coverage. P07/P15 are organizational hubs, not reasons to create empty children. P06/P11/P21/P22 can wait. Keep articles focused enough to answer their question; do not impose word counts or publish on an arbitrary frequency.

## 10. Proposed FAQ and editorial topics

### FAQ ownership

| Genuine question hypothesis | Best location | Information required before answering |
|---|---|---|
| Can my existing sofa be reupholstered, or should it be replaced? | P08 short answer → P16 detailed guide | Inspection criteria and actual example |
| Can you repair a broken frame or sagging cushions? | P08 | Repair limitations, foam/webbing assessment |
| What affects an upholstery quotation? | P08; general brief requirements in P14 | Labor/material/condition factors; no invented quote amounts |
| What photos and measurements should I send? | P13/P14 with one canonical full checklist | Owner’s intake requirements and safe submission method |
| How long does a project take? | P14 | Current range/variables confirmed by owner; otherwise explain assessment dependency |
| Do you collect and deliver furniture? | P14 | Whether offered, service area and terms; not presently established |
| Can I supply my own fabric? | Relevant service page | Policy and suitability checks |
| Do you make headboards to fit an existing bed? | P09 | Actual fit/measurement constraints |
| Do sheers provide privacy at night? | P18, short related answer on P10 | Fabric/light-dependent explanation; avoid universal promises |
| Do you measure and install curtains or blinds? | P10 | Confirmed service boundaries |
| How should I care for my chosen fabric? | P19, linked from project handover/process | Manufacturer-specific instructions |
| Which Nairobi areas do you serve? | P13 | Confirmed coverage; no invented addresses |

These are audience-question hypotheses, not verified search demand or approved answers. Put detailed answers on their natural service/guide owner. A central FAQ should link to those answers rather than duplicate them. No standalone page for every small question.

### Editorial sequence and content sourcing

1. Publish the first real restoration case study (P02) alongside the repair-versus-replace guide (P16).
2. Add material comparison (P17) only after documenting real samples/specifications and project images.
3. Add window comparison (P18) when installations can illustrate light/privacy choices.
4. Add coordination advice (P20) with original room photographs or clearly labeled illustrative examples; do not portray stock imagery as client work.
5. Add care (P19) using manufacturer instructions and the actual materials supplied.
6. Add the glossary (P21) only if terms recur enough to help users.

Commission each piece from an owner interview, project notes and reliable technical references. Credit a real reviewer when appropriate; keep a truthful reviewed date. Avoid generic “top 50 decor ideas,” unsupported “best upholsterer in Nairobi,” neighborhood doorway pages, fictional client stories, fabricated reviews and mass AI-generated art articles. An eventual article about wall art would require genuine subject expertise/examples and a clear relationship to the business.

## 11. Recommended internal linking structure

Use a shared public layout with a concise primary navigation: Portfolio, Services, About, Guides when populated, and Contact. Process can sit under Services or in the footer. Keep useful homepage anchors, but make shared navigation work from every route.

| From | Link to | Purpose / example anchor |
|---|---|---|
| Home service summary | Relevant service detail | “Sofa reupholstery and frame repair” rather than repeated “Learn more” |
| Home selected project | Real project detail | Specific factual project name |
| Portfolio hub | Category and project pages | “Upholstered bed and headboard projects” |
| Category | Relevant service, projects and one guide | Connect visual browsing to evaluation |
| Project detail | Parent portfolio/category, performed service, material guide, contact | Explain the work and a useful next step |
| Service | Relevant project evidence, process, focused guide, contact | Proof → practical evaluation → enquiry |
| Guide | Relevant service and a genuine example | Natural contextual links, not forced sales repetition |
| About/process/contact | Portfolio, service scope, each other | Let visitors verify identity, method and next steps |

Breadcrumb examples: Home → Portfolio → Bespoke Seating → Project; Home → Services → Sofa Reupholstery; Home → Guides → Velvet or Leather. A project can have one primary breadcrumb parent plus related categories as normal links. Avoid multiple competing URLs for the same project.

Ensure every published page has at least one normal HTML link from another useful page, not only a sitemap entry or filter action. Keep key project details within roughly a few navigation steps of the homepage. Filter combinations do not need indexable URLs; if pagination/search parameters are later introduced, define their canonical and crawl policy based on content rather than blindly canonicalizing all pages to page one.

## 12. Media, image SEO and detail-page recommendations

### Current media behavior

`uploadImage` creates timestamp/random filenames while retaining the supplied filename extension. The compression library is requested to output WebP, but the helper does not normalize extensions against the resulting MIME type; inspect actual stored objects rather than assume every `.jpg` contains JPEG. Filenames are not descriptive. Alt text is editable and falls back to project title, which can itself be “Untitled.”

Homepage cards use a 4:3 crop; the full gallery uses square crops. This can cut off furniture details. A stored before photo is not displayed on either public grid: the full gallery only displays a “Before/After” badge. There is no image enlargement, comparison viewer or captioned before/after presentation. There is no video field, uploader, embed or video component in the source, so current video accessibility cannot be audited.

### Next-phase media policy

- Keep stable existing URLs unless a migration has a concrete benefit. Use descriptive, unique filenames for new uploads, with extension matching MIME type; do not break embedded media merely to add keywords.
- Preserve source originals deliberately if required for quality; generate appropriately sized derivatives and document ownership/consent. Existing 1200px compression may limit zoom quality.
- Store width/height, MIME type and useful captions/credits as needed. Use an array of project media only when multiple images are genuinely needed; retain compatibility with the current main/before fields during transition.
- Describe the visible object, material, color and relevant view in alt text without stuffing locations. Give distinct before/after images distinct descriptions; decorative images can use empty alt text.
- Show captions identifying original condition versus finished work. Use actual project facts; do not manufacture dimensions, materials, dates, client locations or prices from image appearance.
- Match responsive `sizes` to layout and inspect output widths/bytes. Keep lazy loading below the fold; reserve space. Only prioritize the image actually needed for initial rendering.
- Use readable images within image-bearing HTML pages and link them contextually. An image sitemap can be considered if discovery needs justify it; it is not required just because Storage uses another host. [Google image guidance](https://developers.google.com/search/docs/appearance/google-images).
- If video is later introduced, provide a clear page purpose, descriptive title, captions/transcript, accessible controls, poster and loading strategy. Use `VideoObject` only for actual visible supported videos, never a nonexistent media item.

### Project-detail minimum publication brief

Capture a distinct title/slug, actual brief, starting condition, intervention, verified materials/techniques, outcome, owned photographs and concise captions. Optional fields include measurements, completion date, rough process stages and client-approved location when genuinely known. Include relevant service/category links and a contextual enquiry action. Avoid exposing private client data.

Do not index every historical image upload automatically. Repair incomplete entries first; allow drafts to remain unpublished. Missing slugs should return a real 404, not a generic success page. Deleted projects should be redirected only when a relevant replacement exists; otherwise use an appropriate missing-content response.

## 13. Domain migration and indexing considerations

### Present state

The user reports a Vercel subdomain, but the exact production URL is unknown. No `SITE_URL`, `metadataBase`, Vercel project linkage or domain redirect is implemented in inspected source. Canonical/OG URLs are fixed to the unrelated placeholder host. Relative application links and Supabase media URLs do not depend on the future custom domain. Inquiry email branding/sender configuration is a separate domain-related task.

Vercel supports production and preview environments, but repository inspection cannot establish which deployments exist or what protection/headers they have. Vercel documents `X-Robots-Tag` behavior for preview responses; inspect the actual relevant deployment and aliases rather than assume coverage. [Vercel environments](https://vercel.com/docs/deployments/environments), [Vercel response headers](https://vercel.com/docs/headers/response-headers).

### Improvements that can be planned now

1. Confirm the real current production origin and consistent brand. A Vercel hostname is not by itself a bar to search eligibility; domain purchase is not a substitute for useful content and sound technical signals.
2. Centralize an explicitly configured production origin for metadata, sitemap and structured-data IDs. Do not blindly derive canonicals from arbitrary incoming Host headers or preview URLs.
3. Use absolute route-specific canonicals and OG URLs, `metadataBase` where appropriate, and an owned share image. Establish a production-versus-preview indexing policy and keep admin non-indexable while securely authenticated.
4. Add native sitemap/robots routes after verifying the desired policy. No robots file today is not proof of a block; a sitemap supports discovery, not guaranteed indexing.
5. Record baseline Search Console coverage and performance when owner access is available. An indexable HTTP 200 is technical evidence only; URL Inspection and actual search behavior answer different questions.

### When the permanent domain is selected

- Connect and verify domain ownership, DNS and TLS; choose one primary HTTPS hostname and enforce host/protocol redirects without loops.
- Change the central production origin, canonical URLs, OG URLs, sitemap entries, structured-data `url`/`@id`, absolute links and any social/business profile links. Review environment variables for both server rendering and builds.
- Redirect old public production URLs permanently to their equivalent new paths, preserving useful query behavior and avoiding all-to-home redirects. Scope redirects so the new hostname does not redirect to itself.
- Confirm redirect coverage for the old Vercel production alias; do not assume connecting a custom domain automatically redirects every Vercel alias. Keep preview deployments independently protected/non-indexable.
- Verify old and new Search Console properties and use Change of Address where applicable/available; submit the new sitemap and monitor redirects, selected canonicals, missing pages and traffic. If a Vercel property has ownership/tool limitations, document them and still implement sound redirects/canonicals.
- Keep redirects for at least a year, preferably longer while old URLs receive visits/links. Avoid simultaneously changing all page slugs and redesigning every content section if unnecessary.

Temporary search fluctuations are possible; no migration preserves visibility by guarantee. Google’s move guidance supports per-URL mapping and sustained monitoring. [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

Robots exclusions, noindex and canonicals serve different purposes. To remove an exposed page with noindex, a crawler generally needs to be able to read that directive. Authentication is appropriate for private administration/previews; neither canonical nor robots.txt is authorization. Do not put public pages under blanket noindex while waiting indefinitely for a domain.

## 14. Recommended implementation architecture

Keep Next App Router, TypeScript, Tailwind, Supabase projects and Storage. No complete rewrite, new CMS or blog dependency is necessary for the initial expansion.

| Need | Simplest fit | Notes / dependencies |
|---|---|---|
| Static service/about/process/contact pages | Server-rendered `app/.../page.tsx` with shared public layout and typed reusable sections | Existing routing supports static and nested paths; retain inquiry as a small client component |
| Project details | `app/projects/[slug]/page.tsx`, server query and `generateMetadata` | Add stable unique slug and explicit publish readiness/status after reviewing actual database schema |
| Categories | One `app/portfolio/[category]/page.tsx` plus typed mappings | Resolve approved display slug → existing category ID; reject unknown slugs; publish only meaningful collections |
| Small guide library | Local typed TypeScript content plus TSX article content/registry | No parser dependency; articles get explicit metadata, related links and revision history in Git |
| Nontechnical editorial workflow later | Separate Supabase `articles` model only when needed | Title, slug, summary, content representation, status, truthful dates, author, media and SEO fields; secure admin before editor expansion |
| Sitemap/robots | Native `app/sitemap.ts` and `app/robots.ts` | Use same approved registry and published project queries as routes |
| Shared metadata | Central trusted site config and page-specific values | Remove inherited cross-page canonicals and test metadata merging |
| Public shell | Route-group layout or shared components, keeping admin separate | Root layout remains minimal; no public header automatically added to admin |
| Freshness | Explicit Next 14 cache/revalidation strategy and authorized invalidation | Decide bounded caching/ISR versus dynamic reads; test update visibility and outages |

The existing routing system supports dynamic/nested routes even though the current project does not use them. A project page can be generated at request time or pre-rendered with `generateStaticParams` and a deliberate revalidation strategy. Do not generate static pages from every row until publication rules and outage behavior are defined. Existing Supabase reads do not establish whether the current full gallery is fresh on every request; async alone does not guarantee dynamic rendering. [Next 14 caching](https://nextjs.org/docs/14/app/building-your-application/caching).

The current admin can manage image/title/description/category/alt fields, **not** canonical slugs, per-page meta summaries, long case studies, article sections, OG images, publish state or update dates. For projects, initially derive metadata from carefully edited title/summary where adequate; add override fields only when editorial needs warrant them. Add `updated_at` to support genuine freshness and sitemap changes rather than inventing modification dates on each request.

A separate blog model is not justified merely to increase page count. Start with a handful of reviewed guides in source. If the owner needs frequent publishing without Git, then implement an article model and structured block editor or tightly constrained content format; sanitize rendered content. MDX would require deliberate configuration/dependencies and is optional, not already supported because a Tailwind content glob mentions `.mdx`.

Secure authenticated writes and schema/policy documentation must precede added CMS features. Future database changes need a migration plan, defaults/backfill for legacy records, unique constraints and tested publication behavior. Storage replacement/deletion cleanup should be retriable and should not remove images still referenced by another record.

Metadata, sitemap, robots, basic JSON-LD, routing and typed content do not require additional packages. Proper Supabase server-side session integration may justify a small official helper after version/security review; do not claim existing browser-only password code can be safely reused. [Next 14 Metadata API](https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata).

Vercel supports this style of Next deployment in principle. Actual build success, environment variables, data access at build/request time, function runtime and account limits require verification. Resend requires an appropriate production sender setup; Supabase requires correct public reads, authenticated writes and Storage access. No database schema or deployment change was performed here.

## 15. Prioritized implementation roadmap

| Phase / classification | Work | Evidence / expected benefit | Dependencies and exit criteria |
|---|---|---|---|
| 0 — Owner facts and baseline | Confirm business name, production URL, “appall study,” actual portfolio content, service scope and credentials; inspect live URLs | Prevents creating the wrong site/topic and establishes trustworthy source material | Owner input; baseline route/header/render and real-project inventory recorded |
| 1 — Critical technical | Replace browser password gate with real auth/RLS; review Storage policies; upgrade vulnerable framework; validate inquiry input and delivery setup | Protects content integrity and availability before expanding reach | Policy/account review, supported-version choice, authorized test environment; anonymous writes denied and admin writes verified without altering real records |
| 2 — High-priority SEO/indexing | Correct metadata/canonicals/brand; share image; admin/preview policy; sitemap/robots; verify errors/statuses | Removes confirmed misleading signals and improves clear discovery | Actual origin and hosting access; correct public head/headers and sitemap, no unintended blocks |
| 3 — High-value pages | Portfolio hub, initial substantive project pages, selected populated collections, top service pages, About/Contact/Process | Makes original work and service fit understandable and linkable | Real case-study notes, consent, accurate service facts; each page passes editorial and route checks |
| 4 — Content/AEO | First two guides, page-owned FAQs, factual business/article/breadcrumb data | Answers actual visitor questions and supports machine-readable context | Visible approved content; structured data matches it and validates; no promised AI placement |
| 5 — Performance/accessibility | Server data flow, bounded queries, image sizes, fonts, contrast/forms/menu/motion | Addresses source risks and usability defects | Measure production before/after; mobile/keyboard checks and meaningful performance tests |
| 6 — Organic growth operations | Review queries/enquiries, improve useful pages, earn legitimate referrals/profile links | Uses real evidence to select next content rather than volume targets | Owner access/consent for analytics/profile work; track qualified enquiries and relevant landing-page performance |
| 7 — Optional/domain-dependent | Custom domain migration, additional category coverage, glossary/central FAQ, article CMS if warranted | Adds maintainability or user value when demand/evidence exists | Permanent domain or actual editorial need; per-URL migration checks and maintenance owner |

Accessibility problems affecting contact and navigation can be fixed alongside phases 1–3; they need not wait for a later redesign. Domain selection need not block correcting the current placeholder canonical once the production URL is known.

Measure progress through accurate published coverage, successful contact interactions, relevant Search Console queries/impressions/clicks when available, and qualified project enquiries. No numeric growth goal can be responsibly derived from this audit. Seek legitimate links through actual collaborators, suppliers and permissioned project credits; do not buy links or fabricate local listings. A Business Profile is worth considering only if the business meets the platform’s current eligibility rules and its facts can be verified.

## 16. Questions requiring the owner’s input

1. What does **“appall study”** mean in this project? Is this the intended repository, and is artwork a future business direction or a separate practice?
2. What is the exact production Vercel URL? Which branch/commit is deployed, and are preview aliases or other production hostnames active?
3. Is the final public name Charles’ Interiors, Atelier Upholstery, Atelier Charles or another name? Who may be named and credited publicly?
4. Is the local Supabase hostname current? Can public project records, schema definitions and RLS/Storage policies be reviewed read-only? What real projects and categories exist?
5. Which upholstery/interior services are currently offered? Does interior design mean spatial advice, drawings, sourcing, installation or full delivery? Are automotive, commercial and automated-blind services active?
6. Can the numerical experience/restoration claims, City & Guilds credential, material origins and longevity statements be substantiated?
7. Are the three testimonials authentic, approved for publication and supported by records? What does the five-star decoration represent?
8. Who owns project images, and are client consent and location/privacy permissions recorded? Are original before photos and project notes available?
9. What phone/email, hours and service areas should be public? Is there a genuine visitable address or appointment policy? Are any social/business profiles official?
10. How are quotes, material selection, customer-supplied fabrics, scheduling, collection/delivery and aftercare handled? Is consultation paid or free? What commitments can be stated accurately?
11. Does the production inquiry form currently deliver? Is the Resend sender verified, and who receives/responds to enquiries?
12. Who should have admin accounts and editorial responsibilities? Will guides be updated through Git or require a nontechnical editor?
13. Is a custom domain chosen? Who controls DNS, Vercel and Search Console? Is there existing search/analytics history to preserve?
14. Which audience should lead: homeowners, interior designers, hospitality clients or another group? Which projects can provide genuinely distinctive content first?

## 17. Future implementation verification checklist

### Application and content

- [ ] Confirm production commit, hosting environments and real project inventory; distinguish local from production configuration.
- [ ] Validate brand/name, credentials, service scope, testimonials, media rights and contact facts.
- [ ] Clarify “appall study”; do not introduce unrelated artwork topics without evidence.
- [ ] Keep existing homepage sections, consultation paths, gallery filtering and useful visual conventions functional.
- [ ] Migrate legacy project data safely; enforce unique slugs and explicit publication quality/state.
- [ ] Confirm project add/edit/delete, before-photo rendering, media cleanup and update freshness in a safe test environment.
- [ ] Verify valid routes, category mappings, missing/deleted project behavior and no unintended redirects.

### SEO and domain

- [ ] Inspect raw HTML and rendered DOM for unique title, useful description, one appropriate H1 and route-specific canonical.
- [ ] Confirm public origin, absolute OG URLs and real share-image 200 responses; check previews in actual sharing tools.
- [ ] Inspect production HTTP status, redirect chains, TLS, robots meta and `X-Robots-Tag`.
- [ ] Fetch robots/sitemap and verify only approved canonical public URLs; exclude admin, API, drafts and preview hosts.
- [ ] Test genuine missing URLs for 404 and transient data failures for deliberate error/cache behavior.
- [ ] Check all internal links, homepage anchors from nested pages, breadcrumbs, contact links and pagination.
- [ ] Use Search Console URL Inspection and indexing reports where owner access allows; distinguish eligibility from actual indexing.
- [ ] On domain migration, test old-to-new path redirects, host variants, canonicals, structured-data IDs and new sitemap submission.

### AEO and editorial quality

- [ ] Main question answered clearly in visible content, with original examples and meaningful follow-up sections.
- [ ] FAQs assigned to the correct page and answers verified by the owner; no unsupported prices, dates or guarantees.
- [ ] Structured data matches visible content; use Rich Results Test for supported types and an appropriate schema validator for general vocabulary.
- [ ] No fake expertise, product offers, aggregate ratings, testimonials or artwork classifications.
- [ ] No claim that schema, `llms.txt`, indexing or technical compliance guarantees search/AI inclusion.

### Performance and accessibility

- [ ] Measure mobile/desktop production performance under repeatable conditions and record field-data availability separately.
- [ ] Check image byte sizes, aspect/crops, MIME/extension, alt text, responsive widths, lazy loading and actual LCP resource.
- [ ] Verify content and essential navigation with slow/failed JavaScript; no important section remains visually hidden.
- [ ] Test keyboard traversal, mobile menu, focus states, form label associations, status announcements and modal behavior.
- [ ] Check contrast, touch targets, zoom, reduced motion and fixed-button/header overlap on representative small screens.
- [ ] Verify font loading and layout stability; do not report a score or Core Web Vitals pass without measurements.

### Security, delivery and operations

- [ ] Review current official dependency advisories and test the selected framework upgrade.
- [ ] Enforce real administrator authentication and database/Storage authorization; deny anonymous writes.
- [ ] Keep server secrets out of public bundles; review policy/schema documentation without exposing credentials.
- [ ] Validate/escape inquiry input, add proportionate abuse protection and test sender/delivery only with authorization.
- [ ] Monitor backend/media failures and stale content; document deployment configuration and maintenance ownership.

---

This report is an implementation guide, not a record of implemented changes or guaranteed organic growth. Source paths refer to the inspected repository; external links support current technical guidance. Live behavior and actual portfolio content remain explicitly bounded by the verification limits above.
