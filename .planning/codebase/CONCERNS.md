# Concerns & Technical Debt

## Large Files

Files exceeding 500 lines that may benefit from decomposition:

| File | Lines | Class | Notes |
|---|---|---|---|
| `rest/class-tasks.php` | 827 | `Rest\Tasks` | Task provider base, complex logic |
| `utils/class-debug-tools.php` | 803 | `Utils\Debug_Tools` | Debug/logging utilities |
| `suggested-tasks/class-suggested-tasks.php` | 642 | `Suggested_Tasks\Suggested_Tasks` | Suggestions manager |
| `class-onboard-wizard.php` | 604 | `Onboard_Wizard` | Onboarding flow |
| `suggested-tasks/providers/class-content-review.php` | 583 | Content review provider | |
| `class-base.php` | 569 | `Base` | Service locator, magic method routing |

## PHPStan Ignored Errors

PHPStan runs at level 10 but has a substantial ignore list in `phpstan.neon.dist`:

### Type-Related Ignores

- `missingType.iterableValue` - Missing generic types on iterables
- `missingType.generics` - Missing generic type parameters
- `binaryOp.invalid` - Invalid binary operations
- `cast.string`, `cast.int`, `cast.double` - Type casting issues
- `offsetAccess.nonOffsetAccessible` - Array access on non-array types
- `echo.nonString` - Echoing non-string values
- `argument.type` - Argument type mismatches
- `return.type` - Return type mismatches
- `assign.propertyType` - Property assignment type issues

### Dynamic Code Ignores

- `method.nonObject` - Method calls on potentially non-object values
- `foreach.nonIterable` - Foreach on potentially non-iterable values
- `clone.nonObject` - Cloning non-objects
- `callable.nonCallable` - Calling non-callable values

### Plugin-Specific Ignores

- `Function YoastSEO not found` - Optional Yoast dependency
- `Unknown class YoastSEO` - Optional Yoast dependency
- `Call to static method get_instance() on unknown class WPSEO_Options` - Yoast classes
- `Variable $prpl_[a-zA-Z0-9_]+ might not be defined` - View file variables
- `Cannot call method modify/format on DateTime|false` - DateTime edge cases
- `Call to an undefined method Progress_Planner\Base::get_*()` - Service locator magic methods

### Property Access Issues (13 files)

Multiple files have `property.nonObject` ignores, primarily in:
- Yoast integration data collectors
- AIOSEO integration files
- WordPress data collectors (terms, posts, categories)

## Direct SQL Queries

13 files use direct `$wpdb` queries (all use `$wpdb->prepare()` for parameterization):

| File | Purpose |
|---|---|
| `activities/class-query.php` | Activity table CRUD, table creation, column migration |
| `class-page-types.php` | Page type queries |
| `data-collector/class-uncategorized-category.php` | Category analysis |
| `data-collector/class-terms-without-posts.php` | Empty terms detection |
| `data-collector/class-terms-without-description.php` | Terms missing descriptions |
| `data-collector/class-post-author.php` | Post author analysis |
| `data-collector/class-post-tag-count.php` | Tag count analysis |
| `providers/class-reduce-autoloaded-options.php` | Options table queries |
| `utils/class-cache.php` | Cache table operations |
| `update/class-update-190.php` | Database migration |
| `yoast/class-fix-orphaned-content.php` | Orphaned content detection |

All queries are marked with `// phpcs:ignore WordPress.DB.DirectDatabaseQuery` where appropriate. All use prepared statements for security.

## Error Handling

- 15 files use `error_log` or debug output
- Primary debug infrastructure in `Utils\Debug_Tools` (803 lines)
- No centralized error handling strategy beyond WordPress defaults
- Debug mode toggled via `prpl_debug` option

## Technical Debt

- **Minimal TODO comments**: Only 1 found in `class-base.php:185` ("Decide when this needs to be initialized")
- **No FIXME/HACK/XXX comments** found
- **Deprecation system** is well-maintained via `Utils\Deprecations` class
- `reportUnmatchedIgnoredErrors: false` in PHPStan config (lenient mode - ignored errors that don't match won't cause failures)

## Security Considerations

- REST API uses token-based auth with rate limiting (10 failed attempts/IP/hour)
- Timing attack prevention via `hash_equals()`
- Input sanitization trait used across 30+ classes
- All SQL queries use prepared statements
- Nonce verification for AJAX requests (via security traits)
- `uninstall.php` cleans up plugin data on removal
