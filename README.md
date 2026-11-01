# Charles’ Interiors — Cloudflare Pages application

Next.js static export + **Pages Functions advanced mode**, D1 and private R2 Standard. The deployable artifact is `out/`, including `_worker.js` and `_routes.json`. No Workers deployment, Supabase runtime, Vercel service, public signup or payments. Existing Supabase resources are untouched. New D1 databases need no import. Versioned migrations create the schema and preserve established service/guide/page copy; they create **no portfolio projects, blog posts or testimonials**.

Public pages use the exported HTML template with HTMLRewriter and current D1 content. Their Next hydration payload is removed deliberately; normal anchors and `/site.js` handle navigation and the contact form. Next exports the interactive admin application. Published pages, metadata, redirects and sitemap update without rebuilding. Responses and media use `no-store` so subsequent requests cannot reuse unpublished content. A file already downloaded by a visitor cannot be recalled.

## Local verification

Node 22+ (tested with Node 24), npm:

```sh
npm ci
npm run setup:local
npm run verify
npm run test:fresh
npm run dev:pages
```

`setup:local` creates ignored, private `.dev.vars` if absent, with an independent random setup token, and applies migrations **locally**. It never overwrites existing secrets. Open `https://localhost:8788`, trust the local development certificate, and use `/admin`. The token is the `ADMIN_ENROLLMENT_TOKEN` value in your private `.dev.vars`. Local indexability defaults false.

In another terminal:

```sh
npx playwright install chromium
npm run test:browser
npm audit --audit-level=high
```

Tests reset local authentication and disposable fixture content. Never repoint them at an account deployment. The suite exercises real local D1/R2 and Chromium virtual passkeys. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing Chromium. For sitemap inclusion assertions set **local** `.dev.vars` `INDEXABLE=true`, restart the emulator, then restore false. Restart Pages dev after rebuilding the advanced-mode Functions bundle or changing migrations; do not rely on hot reload for these changes. `npm run dev` is frontend-only; Pages dev is required for functional testing. `npm run verify:build` scans output for known local secret values and old Supabase runtime dependencies.

## One owner setup and deployment checklist

The following are **owner actions**. No remote migrations, deployment, email delivery, DNS, production permissions or billing have been performed by this implementation work.

1. With Node 24 installed, run `npm ci`. Create a **Pages** project named `<project>` with production branch `main`. For the direct-upload CLI workflow, run `npx wrangler login`, then `npx wrangler pages project create <project> --production-branch main`. Its production origin is `https://<project>.pages.dev`. Use Pages, not Workers. If using Git integration: framework preset **None**, root this repository, build command **`npm run build`**, build output **`out`**, `NODE_VERSION=24`. No `NEXT_PUBLIC_*` variables are required. Direct upload alternative is in step 6. Do not connect an automatic production build until resources/secrets below are configured.
2. Create **two D1 databases** (production and preview) and **two private R2 Standard buckets** (production and preview). R2 billing activation is your account action; usage may incur charges. Disable bucket public/r2.dev access. No R2 CORS, S3 credentials, Stream, domain purchase or database password is needed by the application. Configure an R2 lifecycle rule to abort incomplete multipart uploads after one day; do not expire completed objects.
3. Copy `wrangler.deploy.example.jsonc` to `wrangler.jsonc`, replacing project name, both D1 IDs/names and both bucket names. Set production `SITE_URL=https://<project>.pages.dev`, `INDEXABLE=true`; preview `SITE_URL=https://staging.<project>.pages.dev`, `INDEXABLE=false`. **SITE_URL is the single origin source**: exact HTTPS origin, no trailing slash; no matching build-time URL is needed. Its hostname is also the passkey RP ID. Wrangler is the source of truth for bindings/vars; do not duplicate these fields in dashboard variables. Keep preview bindings separate. Only the configured stable preview alias works; hash deployment URLs and other hostnames fail closed before D1/R2 access.
4. Generate independent private production and preview setup tokens with `node scripts/setup-token.mjs /private/path/to/token` (new output path each time). In Pages → Settings → Variables and Secrets, choose the correct environment and add **secrets** `ADMIN_ENROLLMENT_TOKEN`, `RESEND_API_KEY`, `CHARLES_EMAIL`, `RESEND_FROM_EMAIL`. Use a separate setup token per environment. `CHARLES_EMAIL` is your fixed receiving mailbox; `RESEND_FROM_EMAIL` must be an authorized Resend sender. Keep all secrets server-side. Remove obsolete Supabase, Vercel and public admin-password variables from this application's hosting configuration. No old Supabase resource needs changing.
5. Initialize the **new preview** database with all versioned migrations. No data migration/import is needed:

   ```sh
   npx wrangler d1 migrations apply DB --env preview --remote
   ```

   Check that each command names the intended database before confirming. Preview resources must never be production IDs/buckets.
6. Build and deploy preview first. For a Pages project using direct upload:

   ```sh
   npm run verify
   npx wrangler pages deploy out --project-name <project> --branch staging
   ```

   Verify `https://staging.<project>.pages.dev` with its own token/passkey, actual phone/security key, preview bindings, media upload and authorized test recipient. For Git integration, push to `staging` after configuration instead. When accepted, initialize the new production database with `npx wrangler d1 migrations apply DB --remote`, then deploy production with `npx wrangler pages deploy out --project-name <project> --branch main`, or merge/push the production branch in a Git-connected project. Do not use `wrangler deploy`. Deployments are owner actions.
7. On the production `.pages.dev` origin, visit `/admin` → **First-time owner setup**, paste the private production token, and enroll your passkey. Enrollment closes once the owner exists. Remove `ADMIN_ENROLLMENT_TOKEN` from that environment after enrollment. Open **Account & recovery** and register a second device/security key using **Register backup passkey**. Preview passkeys do not transfer to production. Test sign out/sign in, then perform the final public/contact checks with your real account resources.
8. In **Business settings**, enter real contact details, logo, profile image, opening hours and social links. The contact form sends to the operator secret `CHARLES_EMAIL`; changing public contact text does not change this protected recipient. Review **Pages & SEO**, **Services**, **Guides** and **FAQs**. Create a category if needed, then a **Project**, add a title/slug and upload several photos together. Fill each image's alt text, caption and order, choose the cover and optional before image. Add videos and posters. Save a draft, **Save & preview**, then **Publish**. Use **Blog** similarly for articles. Publish/unpublish updates public HTML, media visibility and sitemap immediately. Upload new content; no Supabase import is needed.

## Exact runtime configuration

| Name | Type | Production | Preview/local |
| --- | --- | --- | --- |
| `DB` | D1 binding | New production database | Separate preview/local database |
| `MEDIA` | R2 binding | Private production Standard bucket | Separate private preview/local bucket |
| `ASSETS` | Pages automatic binding | Exported frontend/template | Automatic; do not configure manually |
| `SITE_URL` | Wrangler var | `https://<project>.pages.dev` | Stable `https://staging.<project>.pages.dev`; local `https://localhost:8788` |
| `INDEXABLE` | Wrangler var | `true` | `false` |
| `ADMIN_ENROLLMENT_TOKEN` | Server secret | Random 64-character hexadecimal setup token; remove after enrollment | Independent token |
| `RESEND_API_KEY` | Server secret | Resend API key authorized to send | Separate test credentials if testing delivery |
| `CHARLES_EMAIL` | Server secret | Fixed recipient mailbox | Authorized test recipient |
| `RESEND_FROM_EMAIL` | Server secret | Authorized sender, e.g. `Charles’ Interiors <hello@your-verified-sender>` | Authorized sender |

Compatibility date `2026-10-27`, flag `nodejs_compat`; these are already in Wrangler. `.dev.vars` is ignored and local only. Secret CLI alternative for production: `npx wrangler pages secret put SECRET_NAME --project-name <project>` (interactive value). Use the dashboard environment selector for preview secrets. `ADMIN_ORIGIN` is internal and derived from SITE_URL; do not configure it separately.

## Content and media behavior

- Structured editing for projects/galleries, articles, FAQs, services/categories, guides, fixed-layout pages and business details. Markdown toolbar supports headings, bold/italic, links, lists and uploaded inline images. Raw HTML is escaped. Draft previews require an administrator session. Drafts are excluded from public HTML/APIs/media/sitemap. Cover images have editable alt text/captions (with gallery/title fallbacks), and paired before images have separate alt text/captions; gallery images have their own alt text.
- Titles/slugs/orders, independent gallery metadata, before images, video titles/descriptions/posters, homepage featuring, publication dates, SEO descriptions/titles/social images, homepage headings/CTA, optional featured-work and services sections, shared CTA copy/visibility are editable. Category IDs remain stable on rename; removing a category clears assignments while retaining projects. Changed content slugs get redirects, which stop resolving when their destination is unpublished or deleted.
- Photos: JPEG, PNG, WebP, **12 MiB, 40 megapixels maximum**. Browser optimization limits the uploaded image to 3200px and approximately 3 MiB, removing EXIF through re-encoding. Server independently detects type/dimensions and enforces size. Originals in R2 are the uploaded optimized assets, not the unmodified camera source; retain camera originals separately if needed.
- Videos: MP4 (H.264/AAC) or WebM (VP8/VP9), **2 GiB maximum**, chunked into **8 MiB requests** below Cloudflare's 100 MB request ceiling. R2 completion validates recorded chunk count/size and completed object metadata. Failed chunks can be retried without retransmitting already accepted chunks while the editor stays open (including after signing in again); completion receipts let retries recover a completed upload after a lost response or database registration failure. Removing a failed queue item aborts an unfinished multipart upload and preserves completed originals. Transfers expire after one day; lifecycle handles abandoned parts. No codec conversion or paid Stream. Container signatures are checked; verify playback before publishing. Videos load on demand and support byte ranges/HEAD/seeking. Posters are separately uploaded images.
- Up to **30 files per batch**, **100 gallery entries per content item**. Uploads are sequential to bound memory and bandwidth, with per-file progress/errors/retry/removal. Gallery validation and reference writes use bulk D1 queries rather than one query per photo. Each 8 MiB request is buffered; an entire large video never passes through memory in one request. Complete uploads and metadata before saving/publishing. Save before the one-hour session expires.
- All media URLs use `/media/uploads/...` on Pages. Visibility is derived from live published references on every request. A shared file remains public if another published item references it. Gallery/content deletion never deletes originals. Media Library only permits reviewed deletion of files with **no references, including drafts**, enforced by database foreign keys.
- A failed D1 registration after R2 succeeds can leave a private orphan. Failed saves leave prior content intact. Review inaccessible orphan objects in the private R2 dashboard against the D1 media manifest; never automatically delete shared originals. Runtime media-library deletion cannot remove referenced files.
- Formatting is intentionally limited and predictable, with structured page fields rather than a general page builder. Editing the homepage `Show selected projects section` controls that optional block. Empty projects/blog have designed public empty states and no fabricated evidence.

## Contact delivery exception

Email sending uses **Resend over HTTPS** from Pages Functions. An account-authorized sender and recipient are required; a `.pages.dev` hostname is not a sender domain you own. Resend's test sender may be limited to the account's own recipient; arbitrary public sending requires a verified sender/domain according to your Resend account. These are account constraints, not a Cloudflare Email Routing feature. Missing configuration returns **503**, provider rejection **502**, validation **400**, abuse throttling **429**; the UI reports failure honestly and retains the enquiry. Success means provider acceptance, not proven mailbox delivery. The sender and recipient are operator secrets, and visitor email is sent as `reply_to`. Honeypot, size limits, origin checks and per-IP/global throttling protect the endpoint. No live email was sent during development.

## Backups and private recovery

Keep backups outside Git and restrict access: D1 exports include passkey public keys and session hashes as well as content. Back up **both D1 and R2**; a database export alone does not contain media.

```sh
# Account-authenticated, read-only backup; use the actual production bucket name.
node scripts/backup.mjs <production-bucket> /private/backups/portfolio-YYYY-MM-DD
# Preview equivalent:
node scripts/backup.mjs <preview-bucket> /private/backups/preview-YYYY-MM-DD --preview
# Database-only alternative:
npx wrangler d1 export DB --remote --output /private/backups/database.sql
```

The backup helper exports D1, records a media manifest with size checks and SHA-256 hashes, and downloads each registered object through Wrangler into `media/uploads/`. It does not delete or mutate remote resources. Quiesce admin editing/uploads/deletion during backup so the database and object set agree. Retain provider Time Travel restore points where available and periodically test recovery in new preview resources.

Before restoring, verify local files with `node scripts/verify-backup.mjs /private/backups/portfolio-YYYY-MM-DD`. Restore to an **empty replacement D1 database** using `wrangler d1 execute <replacement-db-name> --remote --file /private/backups/database.sql`. Upload every backed-up object with its original `uploads/...` key to the replacement private R2 bucket using `wrangler r2 object put <replacement-bucket>/uploads/<filename> --remote --file <backup-file> --content-type <type-from-media.json>`. Validate media counts/types/sizes against `media.json`; test in preview before changing production bindings. Retain the prior resources until acceptance. Restoring a database containing the same owner on the same hostname preserves passkeys; a different hostname needs new enrollment. Always revoke restored sessions with `DELETE FROM sessions` before resuming service.

If all passkeys are lost or compromised:

```sh
# Back up first. This revokes credentials/sessions, retains content and media.
npx wrangler d1 execute DB --remote --file scripts/reset-owner.sql
node scripts/setup-token.mjs /private/path/to/new-token
npx wrangler pages secret put ADMIN_ENROLLMENT_TOKEN --project-name <project>
```

Set the new token privately at the secret prompt, redeploy the same application to apply updated Pages secrets (`npx wrangler pages deploy out --project-name <project> --branch main`, or trigger a new Git-connected Pages deployment), enroll at `/admin` on the exact origin, add a backup passkey and remove the token secret. For preview recovery use its database/environment and dashboard preview secrets. Anyone without Cloudflare account control and the new private token cannot use this recovery route. No public recovery endpoint exists.

## Evidence and account-dependent limits

See [VERIFICATION.md](VERIFICATION.md) for actual checks. Account setup, Pages resource isolation/permissions, real-device passkey compatibility, R2 billing, real video codec compatibility and live email delivery require owner acceptance after deployment. No permanently-free operation, ranking or automatic indexing is promised.

Official documentation reviewed for implementation: [Pages static Next export](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [advanced-mode Functions](https://developers.cloudflare.com/pages/functions/advanced-mode/), [Pages clean HTML routes](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Wrangler production/preview configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [bindings](https://developers.cloudflare.com/pages/functions/bindings/), [request limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 query/parameter limits](https://developers.cloudflare.com/d1/platform/limits/), [R2 multipart](https://developers.cloudflare.com/r2/api/workers/workers-multipart-usage/), [SimpleWebAuthn server](https://simplewebauthn.dev/docs/packages/server), [Resend email API](https://resend.com/docs/api-reference/emails/send-email). Local workerd tests establish runtime behavior beyond package compatibility claims.
