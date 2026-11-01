# SEO content inventory

Implementation: 27 October 2026. Titles below omit the shared Charles' Interiors suffix. Public identity is provisional. “Implemented” describes source/local routes, not deployment or search indexing. Canonical origin requires NEXT_PUBLIC_SITE_URL. No real projects or counts were verified.

| Route | Title | Search intent | Primary topic | Publication status | Relevant internal links |
|---|---|---|---|---|---|
| / | Upholstery & Furniture Restoration in Nairobi | Local upholstery overview | Upholstery, restoration, furnishings | Implemented; origin required | /portfolio, /services, /guides, /contact |
| /portfolio | Upholstery and furnishing portfolio | Browse original work | Live project photographs | Implemented; live data blocked by DNS | /services, /contact; approved categories/cases later |
| /services/sofa-reupholstery | Sofa reupholstery and furniture restoration | Service research / enquiry | Sofa reupholstery and furniture restoration | Implemented | /portfolio, /contact, /guides/reupholster-or-replace-sofa, /guides/velvet-or-leather-upholstery, /guides/tufting-foam-webbing |
| /services/upholstered-beds-headboards | Upholstered beds, headboards and cushions | Service research / enquiry | Upholstered beds, headboards and cushions | Implemented | /portfolio, /contact, /guides/tufting-foam-webbing, /guides/coordinate-sofa-curtains-cushions, /guides/upholstery-fabric-care |
| /services/curtains-blinds | Curtains, blinds and sheers | Service research / enquiry | Curtains, blinds and sheers | Implemented | /portfolio, /contact, /guides/curtains-blinds-sheers, /guides/coordinate-sofa-curtains-cushions |
| /services | Upholstery and furnishing services in Nairobi | Find a service | Three service families and related requests | Implemented | All three service pages, /portfolio, /process, /contact |
| /about | About the upholstery and furnishing practice | Business identity and scope | Factual furnishing focus | Implemented; brand provisional | /portfolio, /services, /guides, /contact |
| /contact | Contact and upholstery enquiries in Nairobi | Contact / enquiry | Nairobi, preparation, existing email/form | Implemented; delivery unverified | /process and shared navigation |
| /process | How to prepare an upholstery enquiry | Prepare a project | Assessment and arrangements to agree | Implemented | /contact |
| /guides | Upholstery and furnishing guides | Educational browsing | Materials, care, restoration, coordination | Implemented | All six guides |
| /guides/reupholster-or-replace-sofa | Should you reupholster or replace your sofa? | Educational answer | Should you reupholster or replace your sofa? | Implemented; source publication 27 October 2026 | /services/sofa-reupholstery, /process, related guides, /contact |
| /guides/velvet-or-leather-upholstery | Velvet or leather for upholstery? | Educational answer | Velvet or leather for upholstery? | Implemented; source publication 27 October 2026 | /services/sofa-reupholstery, /process, related guides, /contact |
| /guides/curtains-blinds-sheers | Curtains, blinds or sheers? | Educational answer | Curtains, blinds or sheers? | Implemented; source publication 27 October 2026 | /services/curtains-blinds, /process, related guides, /contact |
| /guides/upholstery-fabric-care | How to care for upholstered furniture | Educational answer | How to care for upholstered furniture | Implemented; source publication 27 October 2026 | /services/sofa-reupholstery, /process, related guides, /contact |
| /guides/coordinate-sofa-curtains-cushions | How to coordinate sofas, curtains and cushions | Educational answer | How to coordinate sofas, curtains and cushions | Implemented; source publication 27 October 2026 | /services/curtains-blinds, /process, related guides, /contact |
| /guides/tufting-foam-webbing | Understanding tufting, foam and webbing | Educational answer | Understanding tufting, foam and webbing | Implemented; source publication 27 October 2026 | /services/sofa-reupholstery, /process, related guides, /contact |
| /all-photos | Legacy gallery | Legacy navigation | Gallery consolidation | Implemented redirect (308) to /portfolio | /portfolio |
| /portfolio/bespoke-seating | Bespoke seating | Browse seating work | Reviewed residential evidence | Deferred: no verified project records | Would link sofa service and cases |
| /portfolio/window-dressings | Window dressings | Browse window work | Reviewed window evidence | Deferred: no verified project records | Would link curtains service and cases |
| /portfolio/beds-headboards | Beds and headboards | Browse bedroom work | Reviewed bedroom evidence | Deferred: no verified project records | Would link beds service and cases |
| /portfolio/car-seat-covers | Car seat covers | Browse automotive work | Reviewed automotive evidence | Deferred: no verified project records | Would link service directory and cases |
| /projects/[slug] | Project-specific title | Case-study research | Reviewed project scope, work and outcome | Implemented template; no published entries; unknown/unapproved = 404 | /portfolio, related service, /contact |
| /services/interior-design | Interior design | Design service research | Unconfirmed consultancy scope | Deferred: no sufficiently confirmed full-service offering | Narrow furnishing scope covered on /services and /about |
| /faq | Frequently asked questions | General questions | Would need distinct cross-service value | Deferred: service FAQs already answer relevant questions | Use page-specific FAQs instead |
| /admin | Administration | Private management | Legacy project UI | Existing; explicit noindex; SECURITY BLOCKER | No public navigation or sitemap |
| /api/inquiry | Not a document | Submit enquiry | Existing Resend handler | Improved validation; noindex header; delivery not tested | Contact form only |

The sitemap contains the 15 independent content pages and includes the portfolio hub only when its bounded read succeeds, when a production origin is explicitly set. During the observed backend outage it omits the hub (15 URLs); a successful read permits 16. No modification dates are fabricated: guide dates reflect initial source publication; other entries omit lastModified. Filtered and paginated gallery views are crawlable navigation aids, noindex and excluded from the sitemap. Approved categories/cases must be backed by actual records and manually added to the sitemap after route verification. No draft article records exist in the published guides array; keep future drafts outside that registry.

Public source facts retained provisionally: Charles' Interiors, Nairobi/Kenya, existing public email and valid environment-configured phone. Hours, service-area neighbourhoods, qualifications, numerical claims, material origins and testimonials require confirmation. No full interior design consultancy, automated blinds, warranties, turnaround or pricing promises are published in new copy.
