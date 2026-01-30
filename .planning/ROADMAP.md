# Roadmap: Progress Planner — Remote API

## Overview

Build an authenticated remote API that enables external clients to monitor and interact with WordPress sites running Progress Planner. Work spans two repos: the PP Plugin (REST endpoints + auth) and PP Server (authenticated relay). The plugin delivers read-only status first, then auth, then actions. The server follows with site listing, relay endpoints, and rate limiting. Integration testing verifies end-to-end flow.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Plugin Status Endpoint** - Read-only `/remote/status` endpoint returning site info, recommendations, and stats
- [x] **Phase 2: Plugin Auth Layer** - Bearer token + HMAC signature verification for remote endpoints
- [ ] **Phase 3: Plugin Action Endpoints** - Complete and snooze recommendation endpoints
- [ ] **Phase 4: Server Site Listing** - `GET /remote/v1/sites` endpoint listing user's registered sites
- [ ] **Phase 5: Server Status Relay** - Status relay with HMAC request signing
- [ ] **Phase 6: Server Action Relay** - Complete/snooze relay endpoints with HMAC signing
- [ ] **Phase 7: Server Rate Limiting** - Per-user and per-site rate limiting
- [ ] **Phase 8: Integration Testing** - End-to-end verification across both repos

## Phase Details

### Phase 1: Plugin Status Endpoint
**Goal**: Deliver a working `GET /remote/status` endpoint that returns site info (WP version, PHP version, plugin version), active recommendations with metadata, and key stats
**Depends on**: Nothing (first phase)
**Research**: Unlikely (already started on feature branch, existing REST patterns)
**Plans**: TBD

Plans:
- [x] 01-01: Implement Remote_Status REST controller with response schema
- [x] 01-02: Wire up recommendations and stats data collection

### Phase 2: Plugin Auth Layer
**Goal**: Implement Bearer token extraction from Authorization header and HMAC signature verification with 5-minute replay protection for all `/remote/` endpoints
**Depends on**: Phase 1
**Research**: Unlikely (existing token infrastructure, spec-defined algorithm)
**Plans**: TBD

Plans:
- [x] 02-01: Bearer token extraction and validation middleware
- [x] 02-02: HMAC signature verification with timestamp tolerance

### Phase 3: Plugin Action Endpoints
**Goal**: Deliver `POST /remote/recommendations/{id}/complete` and `POST /remote/recommendations/{id}/snooze` endpoints that modify recommendation status via the existing CPT system
**Depends on**: Phase 2
**Research**: Unlikely (recommendation CPT patterns established, status mapping known)
**Plans**: TBD

Plans:
- [ ] 03-01: Complete and snooze endpoints with input validation
- [ ] 03-02: Response formatting and error handling

### Phase 4: Server Site Listing
**Goal**: Deliver `GET /remote/v1/sites` endpoint on PP Server that returns the authenticated user's registered sites with connection status
**Depends on**: Nothing (can start independently of plugin phases)
**Research**: Likely (need to understand PP Server Laravel codebase structure, existing routes and controllers)
**Research topics**: PP Server project structure, existing route patterns, site registration model, authentication middleware
**Plans**: TBD

Plans:
- [ ] 04-01: Sites listing endpoint with user authentication
- [ ] 04-02: Site connection status and response formatting

### Phase 5: Server Status Relay
**Goal**: Deliver `GET /remote/v1/sites/{id}/status` on PP Server that relays to the WP site's `/remote/status` endpoint, signing requests with HMAC
**Depends on**: Phase 1, Phase 4
**Research**: Likely (HMAC signing implementation in Laravel, HTTP client patterns in PP Server)
**Research topics**: PP Server HTTP client usage, HMAC signing implementation, error handling for relay requests
**Plans**: TBD

Plans:
- [ ] 05-01: HMAC request signing service
- [ ] 05-02: Status relay endpoint with error handling

### Phase 6: Server Action Relay
**Goal**: Deliver `POST /remote/v1/sites/{id}/recommendations/{rec_id}/complete` and `POST /remote/v1/sites/{id}/recommendations/{rec_id}/snooze` relay endpoints
**Depends on**: Phase 3, Phase 5
**Research**: Unlikely (follows Phase 5 relay patterns)
**Plans**: TBD

Plans:
- [ ] 06-01: Complete and snooze relay endpoints

### Phase 7: Server Rate Limiting
**Goal**: Implement rate limiting at 60 requests/min per user and 10 requests/min per site on all remote API endpoints
**Depends on**: Phase 4
**Research**: Unlikely (Laravel has built-in rate limiting, likely existing patterns in PP Server)
**Plans**: TBD

Plans:
- [ ] 07-01: Configure per-user and per-site rate limits

### Phase 8: Integration Testing
**Goal**: Verify end-to-end flow: client authenticates with PP Server, PP Server relays to WP site, WP site returns real-time data, actions propagate correctly
**Depends on**: Phase 6, Phase 7
**Research**: Unlikely (verification of built work)
**Plans**: TBD

Plans:
- [ ] 08-01: End-to-end flow verification and documentation

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
Note: Phases 4 and 7 can run in parallel with Phases 1-3 (different repos).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Plugin Status Endpoint | 2/2 | Complete | 2026-01-30 |
| 2. Plugin Auth Layer | 2/2 | Complete | 2026-01-30 |
| 3. Plugin Action Endpoints | 0/2 | Not started | - |
| 4. Server Site Listing | 0/2 | Not started | - |
| 5. Server Status Relay | 0/2 | Not started | - |
| 6. Server Action Relay | 0/1 | Not started | - |
| 7. Server Rate Limiting | 0/1 | Not started | - |
| 8. Integration Testing | 0/1 | Not started | - |
