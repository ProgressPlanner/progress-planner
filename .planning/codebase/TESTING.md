# Testing

## Overview

| Framework | Type | Location | Count |
|---|---|---|---|
| PHPUnit | Integration tests | `tests/phpunit/` | 58 test files |
| Playwright | E2E tests | `tests/e2e/` | Multiple spec files |

## PHPUnit

### Configuration (`phpunit.xml.dist`)

- **Bootstrap**: `tests/bootstrap.php`
- **Test pattern**: `./tests/test-*.php`
- **Excluded**: `./tests/phpunit/test-class-security.php` (prevents output contamination)
- **Coverage source**: `classes/` directory and `progress-planner.php`
- **Uncovered files**: Not processed

### Running Tests

```bash
composer test                  # Run all tests
composer coverage              # Run with HTML coverage report
composer test -- --filter=xyz  # Run specific test
```

### Test Organization

```
tests/phpunit/
├── integration/     # WordPress integration tests (require WP test framework)
└── traits/          # Shared test traits
```

Tests use `yoast/wp-test-utils` for WordPress test bootstrapping.

### CI Matrix

**Workflow**: `phpunit.yml`

| PHP | WordPress |
|---|---|
| 8.2 | 6.7, latest |
| 8.3 | 6.7, latest |
| 8.4 | 6.7, latest |

- MySQL 8.0 service with health checks
- Multisite tested separately

## Playwright E2E

### Configuration (`playwright.config.js`)

- **Base URL**: `process.env.WORDPRESS_URL || 'http://localhost:8080'`
- **Auth**: Global setup/teardown via `tests/e2e/auth.setup.js` (Chromium login, saved to `auth.json`)
- **Reporter**: HTML

### Test Projects

| Project | Workers | Scope |
|---|---|---|
| `sequential` | 1 | `sequential.spec.js` only |
| `parallel` | 4 | All other spec files |

### Retry Strategy

| Environment | Retries |
|---|---|
| CI | 2 |
| Local | 0 |

Screenshots and traces captured on first retry.

### Test Structure

```
tests/e2e/
├── auth.setup.js        # Global login automation
├── constants/           # Shared constants
├── helpers/             # Helper utilities
├── sequential/          # Tests requiring serial execution
└── *.spec.js            # Parallel test specs
```

### CI Setup (`playwright.yml`)

1. MariaDB 10.6 service on port 3307
2. WordPress latest Docker image
3. Install WordPress via curl
4. Copy plugin to container, activate via WP-CLI
5. Enable debug mode: `wp option update prpl_debug true`
6. Insert test token (`PRPL_TEST_TOKEN`)
7. Install Yoast SEO for integration tests
8. Run Playwright tests
9. Install Yoast Premium (requires `YOAST_TOKEN` secret)
10. Run Yoast focus element tests
11. Upload HTML report artifacts

## Code Coverage

### Configuration (`code-coverage.yml`)

- **PHP**: 8.3 with Xdebug (PCOV caused crashes)
- **Format**: Clover XML
- **Threshold**: Coverage cannot drop by more than **0.5%** vs base branch
- **Reporting**: Posts to PR with:
  - Total coverage percentage
  - File-level changes (new, improved, degraded)
  - HTML artifact upload (30-day retention)

## Static Analysis

### PHPStan (`phpstan.yml`)

- Level 10 (strictest)
- Latest PHP version
- Memory limit: 2048M

### Linting (`lint.yml`)

PHP parallel lint across: 7.4, 8.0, 8.1, 8.2, 8.3, 8.4

### Code Style (`cs.yml`)

- Validates `composer.json`
- PHPCS with WordPress standards
- Reports via cs2pr annotations

## Plugin Check (`plugin-check.yml`)

- Builds dist archive via `wp dist-archive`
- Runs WordPress.org plugin checker
- Excludes: `direct_file_access` check

## All CI Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `phpunit.yml` | PR, push | Integration tests |
| `playwright.yml` | PR, push | E2E tests |
| `code-coverage.yml` | PR, push to develop/main | Coverage enforcement |
| `phpstan.yml` | PR, push | Static analysis |
| `cs.yml` | PR, push | Code style |
| `lint.yml` | PR, push | Syntax validation |
| `plugin-check.yml` | PR, push | WordPress.org compliance |
| `upgrade-compat.yml` | PR, push | WP upgrade compatibility |
| `security.yml` | scheduled | Security scanning |
| `deploy.yml` | release | Production deployment |
