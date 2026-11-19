[![Test](https://github.com/ProgressPlanner/progress-planner/actions/workflows/phpunit.yml/badge.svg)](https://github.com/ProgressPlanner/progress-planner/actions/workflows/phpunit.yml)
[![Code Coverage](https://github.com/ProgressPlanner/progress-planner/actions/workflows/code-coverage.yml/badge.svg)](https://github.com/ProgressPlanner/progress-planner/actions/workflows/code-coverage.yml)
[![CS](https://github.com/ProgressPlanner/progress-planner/actions/workflows/cs.yml/badge.svg)](https://github.com/ProgressPlanner/progress-planner/actions/workflows/cs.yml)
[![PHPStan](https://github.com/ProgressPlanner/progress-planner/actions/workflows/phpstan.yml/badge.svg)](https://github.com/ProgressPlanner/progress-planner/actions/workflows/phpstan.yml)
[![Lint](https://github.com/ProgressPlanner/progress-planner/actions/workflows/lint.yml/badge.svg)](https://github.com/ProgressPlanner/progress-planner/actions/workflows/lint.yml)

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/progress-planner.svg)](https://wordpress.org/plugins/progress-planner/)
![WordPress Plugin: Tested WP Version](https://img.shields.io/wordpress/plugin/tested/progress-planner.svg)
[![WordPress Plugin Active Installs](https://img.shields.io/wordpress/plugin/installs/progress-planner.svg)](https://wordpress.org/plugins/progress-planner/advanced/)
[![WordPress Plugin Downloads](https://img.shields.io/wordpress/plugin/dt/progress-planner.svg)](https://wordpress.org/plugins/progress-planner/advanced/)
[![WordPress Plugin Rating](https://img.shields.io/wordpress/plugin/stars/progress-planner.svg)](https://wordpress.org/support/plugin/progress-planner/reviews/)
[![GitHub](https://img.shields.io/github/license/ProgressPlanner/progress-planner.svg)](https://github.com/ProgressPlanner/progress-planner/blob/main/LICENSE)

[![Try Progress Planner on the WordPress playground](https://img.shields.io/badge/Try%20Progress%20Planner%20on%20the%20WordPress%20Playground-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=ddd)](https://playground.wordpress.net/?blueprint-url=https%3A%2F%2Fprogressplanner.com%2Fresearch%2Fblueprint-pp.php%3Frepo%3DProgressPlanner/progress-planner)

# Progress Planner

![Progress Planner - Powering your website's progress](https://repository-images.githubusercontent.com/753019432/5ca27f0c-4380-4b01-a18c-1c7633262659)

## What does this plugin do?

This post explains what Progress Planner does and how to use it: [What does Progress Planner do?](https://prpl.fyi/explainer).

## How to install Progress Planner

You can find [installation instructions here](https://prpl.fyi/install).

## Contributing

### Running Tests

To run the test suite:

```bash
composer test
```

### Code Coverage

To generate code coverage reports locally, you need either [PCOV](https://pecl.php.net/package/PCOV) (recommended) or [Xdebug](https://xdebug.org/) installed:

```bash
composer coverage
```

This will generate:
- An HTML coverage report in the `coverage-html/` directory
- A text-based coverage summary in your terminal

**Coverage Requirements:** Pull requests must maintain code coverage within 0.5% of the base branch. PRs that drop coverage by more than 0.5% will be blocked until additional tests are added.

### Other Quality Commands

```bash
composer check-cs    # Check coding standards
composer fix-cs      # Auto-fix coding standards
composer phpstan     # Run static analysis
composer lint        # Check PHP syntax
```

### Pre-commit hook

`npm install` sets up the husky pre-commit hook: coding standards, PHPStan and the CSS/JS linters.
It also checks the shared `--prpl-*` names against `tokens.json` in
[branding-api](https://git.your.online/branding/branding-api) when `YOUR_BRANDING_DIR` points
at a checkout of it (`export YOUR_BRANDING_DIR=~/path/to/branding-api`). A name the plugin reads
must be listed there; without the variable the check is skipped.

## Authentication transport rollout

The compatibility release accepts `X-Progress-Planner-Token` on `/get-stats` and
`/tasks`, while retaining the legacy stats URLs (`/get-stats/token/<key>` and
`/get-stats/<key>`) and `token` query parameter. A supplied custom header takes
precedence: an empty or incorrect header is rejected even with a valid URL token.
`Authorization: Bearer` is not used for Progress Planner authentication.

1. Ship this compatibility release first and verify its installation on every
   site the server will switch. Old server requests must continue to work, and a
   header-only statistics request must succeed without a key in the URL. An
   unreachable or older site is not ready for the switch.
2. Deploy the server security and custom-header changes together
   ([server #68](https://github.com/ProgressPlanner/progress-planner-server/pull/68)
   and [server #69](https://github.com/ProgressPlanner/progress-planner-server/pull/69)).
   Verify statistics retrieval through the server. If it fails, the server can
   return to its previous URL transport while the compatibility plugin is installed.
3. After all server callers use the custom header, ship the strict plugin changes
   ([#802](https://github.com/ProgressPlanner/progress-planner/pull/802) and
   [#803](https://github.com/ProgressPlanner/progress-planner/pull/803)). Remove the
   URL fallback and legacy route, and change the compatibility tests to expect
   legacy authentication to fail. Reconcile these overlapping REST changes when
   updating those branches. After this stage, reverting the server to URL tokens
   requires restoring the compatibility plugin first.

This is a transport bridge, not key rotation or the full security release.
Existing credentials are unchanged. Preparing this branch does not deploy it or
establish that installed sites have received it.

## Branches on this repository

We use a couple of branches in this repository to keep things clean:

- `develop` contains the current state of development.
- `main` contains the current stable release. Releases here will be tagged as such.

