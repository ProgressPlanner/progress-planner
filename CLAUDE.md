# Progress Planner

Progress Planner (PP) is being withdrawn from wordpress.org. It reaches users as a Composer dependency of **pp-hosts** (private repo `ProgressPlanner/pp-hosts`, which requires this repo's `pp-hosts` branch). A change here is only done once it works inside pp-hosts.

## Branches

- `develop`: development. `main`: stable. `pp-hosts`: what pp-hosts installs (merge `develop` into it to release to pp-hosts).

## pp-hosts contract

`tests/contract/pp-hosts-contract.json` lists the PP API surface pp-hosts depends on: hooks it listens to, parent classes it extends (overridden methods, used properties and constants), `progress_planner()->get_*()` services and the methods called on them, constants, dashboard widget IDs and assets.

- `tests/phpunit/test-pp-hosts-contract.php` runs on every PR (in the normal PHPUnit suite) and fails if PP stops providing any of it.
- The same check runs without WordPress or a database: `php tests/contract/check-pp-hosts-contract.php [contract.json]`.
- **If it fails:** prefer keeping the old API (deprecate it; don't remove it). If the break is intended, change pp-hosts in the same release. Then regenerate the contract in pp-hosts (`php bin/build-pp-contract.php`) and copy it here.
- **Don't edit the JSON by hand.** It's generated from pp-hosts. `known_issues` in it comes from pp-hosts `tests/contract/known-issues.json`.

## Testing a PP change inside pp-hosts

From a pp-hosts checkout, run `bin/pp-integration.sh <pp-ref|working>`. It builds pp-hosts with that PP ref and runs these gates: contract, lint, PHPStan and Playwright e2e. Add `--ai` for a Claude impact report and a browser smoke test. See pp-hosts `CLAUDE.md`.

Run it after merging notable PRs to `develop`, and always before merging `develop` into `pp-hosts`.
