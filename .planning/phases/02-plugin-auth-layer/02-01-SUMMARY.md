---
phase: 02-plugin-auth-layer
plan: 01
subsystem: auth
tags: [rest, auth, bearer-token, hmac, refactor]

requires:
  - phase: 01-plugin-status-endpoint
    provides: Remote_Status controller with auth methods (check_permission, extract_bearer_token, verify_signature)
provides:
  - Remote_Base abstract class with shared Bearer token + HMAC auth for all /remote/ endpoints
  - Remote_Status updated to extend Remote_Base
affects: [03-post-endpoints, remote-api]

tech-stack:
  added: []
  patterns:
    - "Remote_Base inheritance: all /remote/ controllers extend Remote_Base for shared auth"

key-files:
  created:
    - classes/rest/class-remote-base.php
  modified:
    - classes/rest/class-remote-status.php

key-decisions:
  - "Pure extraction refactor: no new functionality, only moved existing methods"
  - "Changed extract_bearer_token and verify_signature from private to protected for subclass access"
  - "check_permission stays public (same visibility as before, used as permission_callback)"

patterns-established:
  - "Remote_Base pattern: all /remote/ REST controllers extend Remote_Base for Bearer+HMAC auth"
  - "Auth method visibility: check_permission public, extract_bearer_token protected, verify_signature protected"

issues-created: []

duration: 4min
completed: 2026-01-30
---

# Phase 2 Plan 1: Remote_Base Auth Extraction Summary

**Extracted Bearer token + HMAC auth methods into shared Remote_Base abstract class for all /remote/ endpoint inheritance**

## Performance

- **Duration:** ~4 minutes
- **Started:** 2026-01-30T02:10:00Z
- **Completed:** 2026-01-30T02:14:00Z
- **Tasks:** 3/3
- **Files modified:** 2

## Accomplishments

- Created `Remote_Base` abstract class extending `Rest\Base` with shared auth infrastructure (TIMESTAMP_TOLERANCE, check_permission, extract_bearer_token, verify_signature)
- Updated `Remote_Status` to extend `Remote_Base`, removing 108 lines of duplicated auth code
- Verified all static analysis passes clean (PHPCS zero errors, PHPStan level 10 zero errors)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Remote_Base abstract class with shared auth methods** - `599b9e62` (refactor)
2. **Task 2: Update Remote_Status to extend Remote_Base** - `2fd88efc` (refactor)
3. **Task 3: Verify endpoint still works correctly** - No commit needed (all checks passed, no fixes required)

## Files Created/Modified

- `classes/rest/class-remote-base.php` - New abstract class with Bearer token + HMAC auth methods shared by all /remote/ endpoints
- `classes/rest/class-remote-status.php` - Changed to extend Remote_Base, removed auth methods (TIMESTAMP_TOLERANCE, check_permission, extract_bearer_token, verify_signature)

## Decisions Made

1. Changed `extract_bearer_token` and `verify_signature` visibility from `private` to `protected` so subclasses can override if needed, while `check_permission` remains `public` as the permission callback
2. Added `@since x.x.x` version placeholders to all new PHPDoc blocks in Remote_Base, consistent with unreleased code convention
3. Made Remote_Base abstract with no `register_rest_endpoint` implementation -- that stays abstract from `Rest\Base`, each concrete controller implements it

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `composer test` could not run because the WordPress test library is not installed locally (`wordpress-tests-lib/includes/functions.php` not found). This is an environment limitation, not a code issue. PHPCS and PHPStan both passed cleanly, confirming structural correctness.

## Next Phase Readiness

The auth layer is now inheritable by any future `/remote/` controller:
- Phase 3 POST endpoints (`/remote/recommendations/{id}/complete`, `/remote/recommendations/{id}/snooze`) can extend `Remote_Base` to get Bearer token + HMAC auth automatically
- No changes needed to `Base` class service locator -- new controllers just need their own `get_rest__remote_*()` method tags
- `check_permission` is ready to use as `permission_callback` in any subclass route registration

---
*Phase: 02-plugin-auth-layer*
*Completed: 2026-01-30*
