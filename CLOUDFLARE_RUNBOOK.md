# Cloudflare runbook

The current, consolidated deployment and recovery instructions are in [README.md](README.md).

The previous version of this document described an incomplete implementation in a separate worktree and included an unnecessary Supabase migration. It is superseded. The application now initializes a new D1/R2 installation without importing old data or touching Supabase resources. Actual verification evidence is in [VERIFICATION.md](VERIFICATION.md).
