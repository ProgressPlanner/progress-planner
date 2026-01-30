# Technology Stack

## Runtime

| Technology | Version | Notes |
|---|---|---|
| PHP | 7.4+ (dev target: 8.3) | Plugin header: `Requires PHP: 7.4`, composer.json platform: 8.3 |
| WordPress | 6.7+ | Plugin header: `Requires at least: 6.7` |
| MySQL/MariaDB | 8.0+ / 10.6+ | MySQL 8.0 in CI phpunit, MariaDB 10.6 in CI Playwright |

## Package Management

| Tool | Config File | Purpose |
|---|---|---|
| Composer | `composer.json` | PHP dependencies (dev-only) |
| npm | `package.json` | JS/CSS build tooling, E2E tests |
| Node.js | >=20.10.0 | Required engine |
| npm | >=10.2.3 | Required engine |

## Production Dependencies

- **PHP**: Zero production Composer dependencies (empty packages array)
- **JavaScript**: `driver.js` ^1.3.1 (guided tours/tutorials)

## Development Dependencies

### PHP (Composer)

| Package | Version | Purpose |
|---|---|---|
| `wp-coding-standards/wpcs` | ^3.1 | WordPress coding standards |
| `phpcompatibility/phpcompatibility-wp` | * | PHP compatibility checking |
| `php-parallel-lint/php-parallel-lint` | ^1.3 | PHP syntax linting |
| `yoast/wp-test-utils` | ^1.2 | Test utilities |
| `phpstan/phpstan` | ^2.0 | Static analysis (level 10) |
| `szepeviktor/phpstan-wordpress` | ^2.0 | WordPress PHPStan rules |
| `phpstan/extension-installer` | ^1.4 | PHPStan extensions |
| `yoast/yoastcs` | ^3.0 | Yoast coding standards |
| `friendsofphp/php-cs-fixer` | ^3.75 | Code style fixer |
| `wp-cli/wp-cli-bundle` | ^2.11 | WP-CLI for testing |

### JavaScript (npm)

| Package | Purpose |
|---|---|
| `@playwright/test` | E2E testing |
| `@wordpress/scripts` | WordPress build/dev scripts |
| `@wordpress/stylelint-config` | CSS linting |
| `dotenv` | Environment variables |
| `eslint-plugin-eslint-comments` | ESLint comments linting |
| `husky` | Git hooks |

## Build & Quality Tools

| Tool | Config File | Purpose |
|---|---|---|
| PHPCS | `phpcs.xml.dist` | PHP code style (WordPress-Extra + WordPress-Docs) |
| PHP-CS-Fixer | `.php-cs-fixer.dist.php` | PHP formatting (native function invocation) |
| PHPStan | `phpstan.neon.dist` | Static analysis at level 10 |
| PHP Parallel Lint | via Composer | Syntax validation |
| ESLint | `.eslintrc.js` | JavaScript linting (WordPress recommended) |
| stylelint | `.stylelintrc.json` | CSS linting (WordPress config) |
| EditorConfig | `.editorconfig` | Editor formatting (tabs, UTF-8, LF) |

## CI/CD

**Platform**: GitHub Actions (17 workflows in `.github/workflows/`)

| Workflow | Purpose |
|---|---|
| `phpunit.yml` | Unit/integration tests (PHP 8.2/8.3/8.4 x WP 6.7/latest) |
| `phpstan.yml` | Static analysis |
| `cs.yml` | Code style checks |
| `lint.yml` | PHP syntax lint (7.4, 8.0-8.4) |
| `code-coverage.yml` | Coverage with -0.5% threshold enforcement |
| `plugin-check.yml` | WordPress.org plugin checker |
| `playwright.yml` | E2E tests with Yoast integration |
| `upgrade-compat.yml` | WordPress upgrade compatibility |
| `deploy.yml` | Release deployment |
| `security.yml` | Security checks |

## Composer Scripts

```
check-cs   - Run PHPCS
fix-cs     - Run PHPCBF + PHP-CS-Fixer
lint       - PHP parallel lint
test       - PHPUnit
coverage   - PHPUnit with HTML coverage report
phpstan    - PHPStan with 2048M memory limit
```
