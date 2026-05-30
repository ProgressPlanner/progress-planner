# Spec Audit Feature — Handoff

**Branch:** `filip/spec-audit` (off `pp-hosts`, originally off `develop`)
**Status:** Functionally complete on local dev. Not pushed. No PR.
**Last verified:** 2026-05-30 on a live WP 7.0 + Yoast + Woo + Anthropic Connector site at `planner.test`.

---

## TL;DR

Adds a **specification.website** audit that runs against the site's public URL
and turns each failing spec rule into a Progress Planner suggested task,
throttled to 1 per day. Two engines, sharing all plugin-side task-mapping code:

- **Deterministic PHP checks** (always on): 5 starter rules — doctype, lang
  attribute, charset, meta description, sitemap.
- **WP 7.0 AI client** (optional, requires a configured connector): asks
  Claude/GPT/Gemini to evaluate the homepage against
  `https://specification.website/llms.txt`; PHP wins on overlapping rule_ids.

Designed so the audit engine can later move to the progressplanner.com SaaS
(phase B) without touching the task-creation code.

---

## Commits on this branch

```
c45f7fd6  Fix the AI audit: schema, checklist source, and silent errors
bbfaf446  Self-heal stale tasks when a PHP-check rule is retired
03b286ed  Replace robots.txt check with meta-description
9caef26f  Keep audit's outbound HTTP off the admin_init / FPM path
c07307c6  Add tests for the spec audit engine, throttle, and C/B contract
bbfaf446 + earlier: see git log
```

The early commits introduced the core; the later commits fixed real issues
discovered during live testing (FPM pool starvation, retired-rule orphans,
wrong AI schema, wrong checklist URL).

---

## Architecture

```
classes/suggested-tasks/audit/
├── class-audit-source.php             # interface: get_findings/get_id/is_available
├── class-audit-runner.php             # picks source, normalizes findings
├── class-local-audit-source.php       # PHP checks + optional AI (PHP wins on overlap)
├── class-remote-audit-source.php      # phase-B SaaS stub (mirrors class-lessons.php)
├── class-spec-mcp-client.php          # WP 7.0 AI client (despite the name — see below)
└── checks/
    ├── class-check.php                # interface
    ├── class-checks-registry.php      # holds checks; fetches homepage once
    ├── class-doctype-check.php
    ├── class-lang-attribute-check.php
    ├── class-charset-check.php
    ├── class-meta-description-check.php
    └── class-sitemap-check.php

classes/suggested-tasks/data-collector/
└── class-spec-audit.php               # caches audit findings (settings sub-key)

classes/suggested-tasks/providers/
└── class-spec-audit.php               # findings → tasks (the queue + throttle)

classes/wp-cli/
└── class-audit-command.php            # `wp prpl audit run`
```

### The shared contract (C ↔ B boundary)

`Audit_Source` is the load-bearing interface. Both `Local_Audit_Source` (PHP +
AI) and `Remote_Audit_Source` (future SaaS) implement it, returning the same
**finding** shape. A regression test asserts shape equality across both —
that's the guard that keeps the engines interchangeable. If you change the
schema, that test fires first.

Finding schema (enforced by `Audit_Runner::normalize()`):
```php
[
    'rule_id'     => string,   // REQUIRED, slugified. Drives task_id.
    'category'    => string,   // basics|seo|accessibility|security|performance
    'title'       => string,
    'description' => string,
    'severity'    => 'high'|'medium'|'low',
    'status'      => 'fail'|'pass',
    'doc_url'     => string,
    'fix_url'     => string,
    'source'      => 'php-check'|'mcp-llm'|'saas',  // PERSISTED as prpl_source meta
]
```

---

## Decisions made (and why)

### 1. **No outbound HTTP from `admin_init`. Ever.**

The original design had the data collector refresh on the daily `admin_init`
sweep. During testing this caused **PHP-FPM pool starvation and 502 errors on
unrelated Valet sites** when 5 loopback HTTP requests per admin pageview pinned
all workers.

The fix (commit `9caef26f`):
- `Spec_Audit` data collector's `update_cache()` is a no-op unless an explicit
  caller has opted in via `Spec_Audit_Data_Collector::with_explicit_refresh()`.
  The `Data_Collector_Manager`'s admin_init sweep therefore can't trigger the
  audit.
- `collect()` never falls through to `calculate_data()` on cache miss — a
  missing cache returns `[]`. This prevents a cold cache (after object-cache
  flush) from triggering a live audit during any random request.
- AJAX "Run audit now" handler defers to `shutdown` and calls
  `fastcgi_finish_request()` so the user's worker is released to the pool
  before outbound HTTP starts.
- A daily WP-cron hook (`progress_planner_spec_audit_run`) drives refreshes
  from a non-web context.

**Allowed callers of the audit:** WP-CLI command, cron hook, AJAX shutdown
handler. **Not** admin pageloads.

### 2. **Throttle is deferred, counts only surviving tasks.**

Originally the throttle counter incremented eagerly inside
`get_tasks_to_inject()`. But if `evaluate_tasks()` ran later in the same
request and auto-completed the just-injected task (because the cache showed it
passing), the slot would be burned for a task that no longer existed.

Fix: track injected post IDs as `$pending_release_ids`. On `shutdown`, count
only tasks that still exist in `publish` status. Pure-PHP, no HTTP.

In-flight in-request counts also count toward the cap so two calls in the same
request (e.g. cron + admin_init) can't both blow past the limit.

### 3. **Self-healing for retired/renamed PHP rules.**

A task's `rule_id` is a string. If we rename or retire a rule (which already
happened once — we swapped `robots-txt` for `meta-description`), the
old task lives in users' DBs forever and `is_specific_task_completed()` would
never find evidence to complete it.

Fix (commit `bbfaf446`):
- On injection, persist `prpl_source` as task meta.
- In `is_specific_task_completed()`, if the task's source is `php-check` and
  its `rule_id` is NOT in the live `Checks_Registry`, return `true` —
  auto-complete the orphan.
- Legacy tasks without `prpl_source` meta backfill to `php-check` so they
  self-heal on the next admin pageload after upgrade.
- LLM/SaaS tasks are deliberately exempt: their rule space is open-ended, so
  a rule "missing" from one audit just means the model didn't mention it
  this time, not that it was retired.

### 4. **AI engine: phase C now, phase B later.**

Phase C (now): plugin is the AI client, using the site owner's WP 7.0
Connector + API key. Phase B (future): the agent moves to
progressplanner.com SaaS, license-key gated, plugin just receives findings.

`Local_Audit_Source` (C) and `Remote_Audit_Source` (B) share the
`Audit_Source` contract. The findings → tasks mapping is identical for both.

### 5. **AI client is NOT an MCP client.**

The class is called `Spec_Mcp_Client` because the original design pointed
WP's AI client at the specification.website MCP server. Source-level research
of WP 7.0 core (`wp-includes/ai-client/class-wp-ai-client-prompt-builder.php`)
confirmed: **core's AI client cannot act as an MCP client.** It only supports
locally-registered function declarations / Abilities + web_search. There is no
MCP tool type. (WordPress's MCP story is the *MCP Adapter*, which makes WP an
MCP *server* — opposite direction.)

So `Spec_Mcp_Client` fetches `https://specification.website/llms.txt` (the
spec's canonical LLM-oriented Markdown index, 37KB) over plain HTTP and feeds
it + the homepage HTML to `wp_ai_client_prompt()` with a JSON-schema-constrained
response. The class name is now misleading but the behavior is correct. Rename
opportunity for future cleanup; not blocking.

### 6. **Verified WP 7.0 AI API quirks.**

- The builder uses `__call` for SDK delegation. `method_exists($builder,
  'using_max_tokens')` returns FALSE. **Never** guard SDK methods with
  `method_exists()`.
- Availability gate is `wp_supports_ai()` + `$builder->is_supported_for_text_generation()`.
  There is no `is_configured()`.
- Anthropic's structured output requires `additionalProperties: false` on every
  `type: object` in the schema. Without it the call 400s and the WP_Error
  is swallowed.
- `generate_text()` returns string (JSON when `as_json_response($schema)` is
  set) or `WP_Error`. Synchronous/blocking.

All four lessons cost real debugging time. They are now in code comments at
the relevant call sites.

### 7. **Default throttle: 1 task/day, filterable.**

`progress_planner_spec_audit_max_tasks_per_window` (default 1) and
`progress_planner_spec_audit_window` (default `'day'`, also accepts `'week'`).
Stored counters in `progress_planner_settings['spec_audit']['injections']`.
Window key = `gmdate('Ymd')` or `gmdate('oW')`.

The intent: avoid flooding users with tasks. A new site might genuinely have
10 failing rules; surfacing them one per day keeps the UI calm.

### 8. **Deterministic checks win on rule_id overlap with AI.**

`Local_Audit_Source::get_findings()` indexes PHP findings by `rule_id` first,
then drops any AI finding with the same `rule_id`. Rationale: PHP checks are
exact and free; the LLM could hallucinate the same rule wrong. PHP wins.

**Known gap (see open question 1 below):** the LLM uses different slugs
(`doctype` vs our `html-doctype`, etc.), so this dedupe doesn't actually
trigger in practice. Both PHP and LLM versions of the same rule end up in
the cache. Currently harmless (they all pass and don't generate tasks), but
not ideal.

---

## What was verified live

On `http://planner.test/` (WP 7.0 + Yoast + Woo + Anthropic Sonnet 4.5):

- ✅ `wp prpl audit run` completes in ~18s including one Anthropic API call.
- ✅ PHP checks: 5 ran, 4 passed, 1 failed (`meta-description`, before Yoast
  was given a description).
- ✅ AI added 12 findings: 7 pass, 5 fail (`canonical-url`, `open-graph`,
  `theme-color`, `color-scheme`, `https-tls`).
- ✅ Severity-based prioritization picked the highest-severity rule
  (`https-tls`, severity high) for the throttled slot.
- ✅ Throttle holds — second run returned `0 task(s) injected`.
- ✅ Auto-completion verified: set a meta description in Yoast → re-run
  audit → rule flips to `pass` → next admin pageload marks the task
  `pending` (celebration-pending).
- ✅ Zero outbound HTTP from admin pageloads. Verified by checking nothing
  hangs after the audit cache exists.
- ✅ Self-healing verified: a stale `spec-audit-robots-txt` task from before
  the rule was swapped was correctly auto-completed on the next evaluation.

---

## What was NOT verified

- **Production WP 7.0 release.** All testing was on a WP 7.0 nightly running
  in Valet locally. The Connectors UI behaved oddly on nightly (failed to
  auto-install provider plugins) but worked on stable 7.0. Worth re-testing
  on shipped 7.0.
- **The SaaS phase-B path.** `Remote_Audit_Source` is a stub — the
  progressplanner.com endpoint doesn't exist. Shape-equality test guards
  against the contract drifting.
- **Concurrency.** Multiple `wp prpl audit run` invocations at once. The DB
  layer has a distributed lock; should be fine but not tested.
- **Multisite.** Not considered.

---

## Open questions for the next agent

**Note on rule_id slugs:** PHP checks and the AI prompt now both use
**spec.website's canonical slugs** (e.g. `doctype`, `html-lang`,
`meta-charset`, `meta-description`, `xml-sitemaps`). Each finding's
`doc_url` points at the actual spec page
(`https://specification.website/spec/{category}/{slug}/`). PHP and LLM
findings dedupe naturally when they cover the same rule.

### 1. (medium) Local-dev false positive on `https-tls`.

The AI correctly flags non-HTTPS sites, but on a dev environment like
`http://planner.test/` this is noise. Two options:
- Filter findings where the audited URL has `.test`/`.local`/`localhost` and
  the rule_id is `https-tls`.
- Just document it and let users dismiss in dev.

I'd lean (b) — sanitizing for dev environments risks hiding real prod issues.

### 2. (medium) Rename `Spec_Mcp_Client` → `Spec_Ai_Client`.

The "MCP" in the name was aspirational and incorrect (see decision 5).
Simple rename, no behavior change. Simple rename, no behavior change.

### 3. (low) Add a `--dry-run` flag to the CLI command.

Run the audit, print findings, inject nothing. Useful for evaluating AI
output quality without cluttering the suggested-tasks UI between runs.
~10 lines.

### 4. (low) UI for "Run audit now."

The AJAX endpoint (`progress_planner_run_spec_audit`) exists and is
fastcgi-detached. There's no admin UI button wired to it yet.

### 5. (low) Audit should respect a deactivation cleanup.

When the plugin is deactivated, the daily cron hook
`progress_planner_spec_audit_run` should be unscheduled. Not currently wired.

---

## File map (quick)

| File | What |
|---|---|
| `classes/suggested-tasks/audit/class-audit-source.php` | Interface |
| `classes/suggested-tasks/audit/class-audit-runner.php` | Source picker + `normalize()` |
| `classes/suggested-tasks/audit/class-local-audit-source.php` | PHP + AI, PHP wins on overlap |
| `classes/suggested-tasks/audit/class-remote-audit-source.php` | Phase-B SaaS stub |
| `classes/suggested-tasks/audit/class-spec-mcp-client.php` | WP 7.0 AI client (rename TODO) |
| `classes/suggested-tasks/audit/checks/*` | Check interface + 5 PHP rules + registry |
| `classes/suggested-tasks/data-collector/class-spec-audit.php` | Cache (gated by `with_explicit_refresh`) |
| `classes/suggested-tasks/providers/class-spec-audit.php` | Findings → tasks + throttle |
| `classes/wp-cli/class-audit-command.php` | `wp prpl audit run` |
| `tests/phpunit/test-class-spec-audit-checks.php` | PHP check unit tests |
| `tests/phpunit/test-class-spec-audit-runner.php` | Schema, C↔B contract |
| `tests/phpunit/test-class-spec-audit-provider.php` | Throttle, completion, self-healing |

---

## How to run / test

### Static checks (always before commit; pre-commit hook does this)
```bash
composer phpstan
composer lint
vendor/bin/phpcs -s --warning-severity=6 <file>
```

### PHPUnit (needs WP test lib)
```bash
# Install once
export PATH="/Users/Shared/DBngin/mysql/8.0.33/bin:$PATH"
WPCONFIG=/Users/filip/Valet/planner/htdocs/wp-config.php
DB_PASS=$(grep "DB_PASSWORD" "$WPCONFIG" | head -1 | sed -E "s/.*DB_PASSWORD', '([^']*)'.*/\1/")
bash bin/install-wp-tests.sh wordpress_test root "$DB_PASS" 127.0.0.1 latest true
# Patch the password (script writes 'root' literally)
TESTCONF=/var/folders/xc/kd88yddj42l40ch1lj1g10d40000gn/T/wordpress-tests-lib/wp-tests-config.php
php -r '$f=$argv[1];$p=$argv[2];$c=file_get_contents($f);$c=preg_replace("/define\(\s*.DB_PASSWORD.,\s*.[^\047]*.\s*\)/","define( \047DB_PASSWORD\047, \047".addslashes($p)."\047 )",$c);file_put_contents($f,$c);' "$TESTCONF" "$DB_PASS"

# Run
export WP_TESTS_DIR=/var/folders/xc/kd88yddj42l40ch1lj1g10d40000gn/T/wordpress-tests-lib
composer test
# or
vendor/bin/phpunit --filter Spec_Audit
```

### Live test on planner.test
```bash
cd /Users/filip/Valet/planner/htdocs
wp prpl audit run
wp prpl audit run --format=json | jq '.[]'
```

### See all findings (including passes) with sources
```bash
wp eval '
foreach (progress_planner()->get_settings()->get("progress_planner_data_collector", [])["spec_audit_findings"] ?? [] as $f) {
    printf("%-30s %-10s %-6s %s\n", $f["rule_id"]??"?", $f["source"]??"?", $f["status"]??"?", substr($f["title"]??"", 0, 60));
}'
```

### Clean state (delete all spec-audit tasks + reset throttle + clear cache)
```bash
wp eval '
$db = progress_planner()->get_suggested_tasks_db();
foreach ((array) $db->get_tasks_by(["post_status"=>["publish","trash","draft","future","pending"],"provider_id"=>"spec-audit"]) as $t) {
    if (is_object($t) && isset($t->ID)) wp_delete_post($t->ID, true);
}
$s = progress_planner()->get_settings();
$dc = $s->get("progress_planner_data_collector", []);
unset($dc["spec_audit_findings"]);
$s->set("progress_planner_data_collector", $dc);
$s->set("spec_audit", []);
progress_planner()->get_utils__cache()->delete("spec_audit_checklist");
$ts = wp_next_scheduled("progress_planner_spec_audit_run");
if ($ts) wp_unschedule_event($ts, "progress_planner_spec_audit_run");
echo "clean\n";
'
```

---

## Memory file (Claude Code)

There's also a memory file at
`~/.claude/projects/-Users-filip-Valet-planner-htdocs-wp-content-plugins-progress-planner/memory/project_wp7-ai-spec-audit.md`
that captures the WP 7.0 AI API findings — the things that aren't obvious from
reading code (e.g. `method_exists` doesn't see `__call` methods,
`additionalProperties: false` is required by Anthropic). Read it if the next
agent is also Claude Code; otherwise the same content is in code comments
around the relevant call sites.

---

## Final state of `filip/spec-audit` as of handoff

- 424/424 PHPUnit tests pass.
- PHPStan clean.
- phpcs clean at hook severity (`--warning-severity=6`).
- 9 commits ahead of base.
- Working tree clean.
- No push, no PR.
- Live planner.test site is at zero spec-audit state (cleanup snippet just ran).
