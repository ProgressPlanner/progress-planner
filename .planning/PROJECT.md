# Progress Planner — Remote API

## What This Is

A Remote API for Progress Planner that enables external clients (Moltbot, n8n, etc.) to monitor and interact with WordPress sites running Progress Planner. PP Server acts as an authenticated relay between clients and WP sites, storing no site data itself.

## Core Value

End-to-end flow: a client can query site status and act on recommendations through PP Server, with every hop authenticated and every response real-time from the source.

## Requirements

### Validated

- ✓ REST API with token-based auth and rate limiting — existing
- ✓ Suggested tasks/recommendations system with providers — existing
- ✓ Task status management (pending, completed, snoozed) — existing
- ✓ Service locator pattern for lazy-loaded class instantiation — existing
- ✓ HMAC-ready token infrastructure (license key + test token) — existing

### Active

- [ ] PP Plugin: `GET /remote/status` endpoint returning site info, recommendations, and stats
- [ ] PP Plugin: `POST /remote/recommendations/{id}/complete` endpoint
- [ ] PP Plugin: `POST /remote/recommendations/{id}/snooze` endpoint
- [ ] PP Plugin: Bearer token + HMAC signature verification for remote endpoints
- [ ] PP Server: `GET /remote/v1/sites` endpoint listing user's registered sites
- [ ] PP Server: `GET /remote/v1/sites/{id}/status` relay endpoint
- [ ] PP Server: `POST` relay endpoints for complete/snooze actions
- [ ] PP Server: HMAC request signing for server-to-client requests
- [ ] PP Server: Rate limiting (60/min per user, 10/min per site)

### Out of Scope

- Extended data (comments count, WooCommerce, uptime, content stats) — Phase 3 future work
- Webhook/push notifications — polling only for v1
- Token management UI in plugin settings — use existing token infrastructure
- WP Multisite handling — single-site only for v1
- Token rotation/expiry — existing token system is sufficient

## Context

- The PP Plugin already has a REST API (`classes/rest/`) with `Base` class providing token validation, rate limiting, and IP detection
- PP Server is a separate project (Laravel-based) with its own SQLite database storing user tokens and site registrations
- Phase 1 PP Plugin work (read-only `/remote/status` endpoint) is already implemented on branch `feature/remote-api-phase1` but not yet committed
- Recommendations use WordPress custom post type `prpl_recommendations` with status mapping: publish=pending, trash=completed, pending=celebration, future=snoozed
- The spec defines a 3-tier architecture: Client → PP Server (auth relay) → WP Site + PP Plugin

## Constraints

- **Existing tokens**: Must use the current license key / test token system, no new token infrastructure
- **No breaking changes**: All existing REST endpoints and plugin behavior must remain unchanged
- **PHP 7.4+**: Plugin must maintain PHP 7.4 compatibility (dev target 8.3)
- **WordPress 6.7+**: Minimum WordPress version requirement
- **Coding standards**: WordPress-Extra + WordPress-Docs PHPCS, PHPStan level 10, tabs, leading `\` on native functions
- **Two repos**: PP Plugin and PP Server are separate repositories with independent deployment

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bearer token in Authorization header (not URL path) | Spec requirement; more secure than URL tokens used by existing endpoints | — Pending |
| HMAC signature using Bearer token as shared secret | Both PP Server and client already share this token; no extra key exchange needed | — Pending |
| 5-minute timestamp tolerance for replay protection | Balances clock skew tolerance with security | — Pending |
| PP Server stores no site data | Real-time relay architecture; single source of truth stays on client site | — Pending |

---
*Last updated: 2026-01-30 after initialization*
