# Verification record

All work and tests in this record are repository-local. No Cloudflare production/preview account resources were created or modified, no deployment/DNS/billing action was performed, no live email was sent, and old Supabase resources were untouched.

## Completed checks

| Check | Actual result |
| --- | --- |
| Locked installation | `npm ci` succeeded; package and lockfile dependency declarations match. |
| Cloudflare package | `npm run verify` passed: Next static export, frontend TypeScript checking, independent Functions TypeScript checking, bundled advanced-mode Pages Functions and artifact inspection. 27 Next export routes are processed; stale public HTML/RSC payloads are removed. |
| Artifact inspection | 58 output files checked. `out/_worker.js`, `_routes.json`, admin HTML and the public HTML template are packaged together. No known local secret values, Supabase runtime dependencies or stale public Next hydration payloads were found in output. |
| Fresh D1 | `npm run test:fresh` passed against a new temporary emulator state: all five migrations applied, repeating initialization was a no-op, nine fixed editable pages and one business-settings record exist, no projects/posts/media are invented, and `PRAGMA foreign_key_check` returned no violations. Established services/guides/FAQ copy is retained in editable documents. |
| Browser integration | **5 tests passed together** using Chromium, local HTTPS Pages Functions, local D1/R2, and disposable fixtures. The last full run took 3.6 minutes. |
| Responsive checks | Public home/portfolio/services/blog/article/FAQs/contact and admin inspected at 360, 390, 768 and 1440 pixels. Tests checked actual document overflow, menu controls and editor controls. Screenshots were generated and phone/tablet/desktop screenshots were visually inspected. |
| Dependency advisories | `npm audit --json` returned zero vulnerabilities: critical/high/moderate/low/info all zero. TypeScript was subsequently pinned to the same installed 5.9.3 version; no dependency version was added by that pin. |
| Backup helper | JavaScript syntax checks passed. The local SHA-256/size backup verifier accepted a disposable integrity fixture. Remote export/download/restore permissions remain account-dependent. |
| Diff hygiene | `git diff --check` passed. |

The build uses pinned TypeScript 5.9.3 through Next's supported compiler-API path (`experimental.useTypeScriptCli=false`). The default CLI path intermittently returned incomplete `--showConfig` output here; compiler API builds and independent `tsc` checks passed. Public HTML is rewritten from the real exported template; the admin retains normal Next hydration. Canonical static asset paths avoid Pages' `.html` URL redirects.

## Browser coverage

1. **Complete application / owner lifecycle:** empty portfolio and blog, established pages and new routes, genuine 404/redirect responses, denied anonymous mutations/uploads, forged origins, first enrollment with a private token, blocked repeat enrollment, secure session-cookie attributes, ignored browser-storage flags, private previews and draft media, project photo metadata/order, homepage featuring, publishing/unpublishing, slug redirects, article formatting and safe raw-HTML rendering, inline media, dynamic metadata and sitemap behavior, FAQ placement, service/category/page/settings edits, shared-media protection, failed database saves, failed uploads, real UI batch uploads with retry, unsaved-edit confirmation, backup-passkey registration and login, logout/revocation, session expiry, throttling, wrong-host denial, and the actual file-based owner reset/re-enrollment procedure without losing content.
2. **FAQ and media boundaries:** draft/create/edit/reorder/publish/unpublish/delete, photo size and dimension rejection, a 100-entry shared-original gallery save through bulk D1 validation/reference queries, video size/type/chunk-size validation, abort handling, private media, and explicit deletion of unreferenced originals.
3. **Responsive gallery editor:** photo/video fields at all four widths, independent cover and before-photo alt text/captions persisted through the UI and rendered in a private preview, poster controls, save/publish controls and no document overflow.
4. **Structured page/global editing:** homepage headings and optional sections, shared callout copy/visibility, actual editor persistence to public HTML, a deliberately delayed save with disabled fields/navigation protection, and service slug changes preserving both redirects and related FAQ placement.
5. **Completion failure recovery:** real R2 completion followed by an injected D1 registration failure, successful completion retry, repeat completion returning the same URL, preservation of completed originals on abort, receipt cleanup on explicit media deletion, and a real browser upload with an injected second-chunk failure, a deliberately lost completion response, and a failed media-library refresh. Retry retains accepted chunks (first chunk sent once, failed second chunk sent twice), recovers completion without duplicate gallery entries, and preserves successful upload status when the library refresh fails.

Video checks include an upload larger than one 8 MiB chunk, missing-part rejection, MP4 playback, byte/suffix ranges, invalid ranges and seeking. This verifies the chunk protocol; a full 2 GiB transfer was **not** performed. Server-side 2 GiB limits and rejection above that bound were exercised. The application does not transcode or certify arbitrary video codecs.

Production-indexable sitemap inclusion/removal was verified with local `INDEXABLE=true`; the full suite also passed with default `INDEXABLE=false`, empty sitemap and noindex behavior. Origin rejection was tested independently. These tests do not establish account-level preview resource isolation.

After verification, the root-workspace emulator was restored to fresh-install editorial copy: zero projects/posts, no administrator credentials, and zero media references. All R2 originals were retained and the local emulator was stopped. The final rebuilt admin export also passed a check for its accessible main/skip-link target.

Fixtures exist only in ignored local emulator/test directories. Browser tests clean their administrator credentials and published UI fixture after checking recovery. Uploaded test originals may remain private in local emulator storage; they are not bundled or deployed. R2 originals are never automatically deleted as a content-save side effect.

## Not verified without the owner's account

- Live Pages deployment, production `.pages.dev` TLS/routing and real-device passkeys on that actual origin.
- Actual production/preview D1 and R2 bindings, IAM/resource permissions, private-bucket settings, lifecycle policy, billing, plan quotas and CPU/usage behavior.
- Live Resend sender authorization, provider acceptance, mailbox delivery and Reply-To behavior in a real mail client. Local validation, rejection and missing-configuration failure were verified; provider delivery was not.
- Remote D1/R2 backups and restore permissions, or an account-level disaster-recovery exercise.
- Playback of the owner's future videos on their target devices. H.264/AAC MP4 and VP8/VP9 WebM are the documented upload choices.

These are deployment/account acceptance steps in [README.md](README.md). No repository feature-development blocker remains; production acceptance requires those owner actions.
