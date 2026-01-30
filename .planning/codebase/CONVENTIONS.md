# Coding Conventions

## PHP

### Naming

| Element | Convention | Example |
|---|---|---|
| Classes | `PascalCase` with underscores | `Dashboard_Widget_Score` |
| Namespaces | `PascalCase` with underscores | `Progress_Planner\Admin\Widgets` |
| Methods | `snake_case` | `get_settings()`, `save_settings()` |
| Properties | `snake_case` | `$cached`, `$plugin_version` |
| Constants | `UPPER_CASE` | `OPTION_NAME`, `SCORE_TARGET` |
| Files | `class-{lowercase-hyphenated}.php` | `class-dashboard-widget-score.php` |
| Traits | Same as classes | `class-input-sanitizer.php` |
| Global functions | `progress_planner` prefix | `progress_planner()` |
| Global constants | `PROGRESS_PLANNER_` prefix | `PROGRESS_PLANNER_DIR` |
| Shorthand prefix | `prpl` | Used in options, CSS classes |

### Code Style

- **Indentation**: Tabs (not spaces), per WordPress standard
- **Line endings**: LF (Unix)
- **Charset**: UTF-8
- **Final newline**: Required
- **Array syntax**: Short arrays (`[]` not `array()`) enforced
- **Yoda conditions**: Disabled (non-standard WordPress override)
- **Native functions**: Leading `\` required (enforced by PHP-CS-Fixer)
- **Trailing whitespace**: Trimmed

### Standards Enforcement

**PHPCS** (`phpcs.xml.dist`):
- WordPress-Extra
- WordPress-Docs
- PHPCompatibilityWP (target: 7.4+)
- WordPress minimum version: 6.3
- Text domain: `progress-planner`
- Prefixes: `Progress_Planner`, `progress_planner`, `prpl`
- Short arrays enforced
- Yoda conditions disabled
- Test files excluded from filename sniffs
- Excluded paths: `vendor/`, `node_modules/`, `coverage/`

**PHP-CS-Fixer** (`.php-cs-fixer.dist.php`):
- Native function invocation for all PHP functions
- Unsafe fixes enabled (`--allow-risky=yes`)
- Excluded: `tests/`, `vendor/`, `node_modules/`

**PHPStan** (`phpstan.neon.dist`):
- Level 10 (strictest)
- Analyzes: `./classes`, `./views`, `./progress-planner.php`, `./uninstall.php`
- WordPress extension: `szepeviktor/phpstan-wordpress`

### Documentation

- PHPDoc blocks required on all classes and methods (enforced by WordPress-Docs)
- `@method` tags in Base class for service locator methods
- `@param` and `@return` type annotations
- `@since` version tags on public API methods
- `@phpstan-ignore` / `@psalm-ignore` for edge cases

## JavaScript

**ESLint** (`.eslintrc.js`):
- WordPress recommended rules
- `eslint-plugin-eslint-comments` enabled
- Latest ECMAScript parser options
- `console` usage allowed

## CSS

**stylelint** (`.stylelintrc.json`):
- WordPress stylelint config (base)
- `no-descending-specificity`: disabled
- `selector-id-pattern`: disabled
- `function-url-quotes`: disabled

## Editor Config

`.editorconfig` settings:

| Setting | Value |
|---|---|
| Charset | UTF-8 |
| Line endings | LF |
| Indent style | Tab |
| Indent size | 4 |
| Trailing whitespace | Trimmed |
| Final newline | Inserted |
| YAML indent | 2 spaces |

## Git

- **Hooks**: Husky pre-commit hooks (`.husky/`)
- **Attributes**: `.gitattributes` for line ending normalization
- **Distribution**: `.distignore` excludes dev files from releases
