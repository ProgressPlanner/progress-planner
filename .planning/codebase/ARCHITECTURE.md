# Architecture

## Bootstrap Flow

1. **Entry point**: `progress-planner.php` defines constants and loads autoloader
2. **Constants**:
   - `PROGRESS_PLANNER_FILE` - Main plugin file path
   - `PROGRESS_PLANNER_DIR` - Plugin directory path
   - `PROGRESS_PLANNER_URL` - Plugin URL
3. **Autoloader**: `autoload.php` registers PSR-4-like class loader via `spl_autoload_register()`
4. **Singleton access**: Global `progress_planner()` function instantiates `Progress_Planner\Base`, caches in `$progress_planner`, and calls `init()`

## Service Locator Pattern

The `Base` class (`classes/class-base.php`, 569 lines) implements a magic `__call()` method that acts as a service locator with lazy-loading:

### Method-to-Class Resolution

Methods starting with `get_` are transformed into fully qualified class names:

| Method Call | Resolved Class |
|---|---|
| `get_settings()` | `Progress_Planner\Settings` |
| `get_admin__page()` | `Progress_Planner\Admin\Page` |
| `get_activities__query()` | `Progress_Planner\Activities\Query` |
| `get_suggested_tasks_db()` | `Progress_Planner\Suggested_Tasks_Db` |

**Naming rules**:
- Single `_` = word boundary (capitalized in class name)
- Double `__` = namespace separator (becomes `\`)
- All resolved classes live under `Progress_Planner\` namespace

### Caching

- Each class is instantiated once (singleton per service)
- Cache key = method name without `get_` prefix
- Subsequent calls return the cached instance

### Deprecation Support

- `Deprecations::BASE_METHODS` maps old method names to replacements
- Triggers `_deprecated_function()` WordPress notice
- Automatically redirects to replacement method

## Autoloader

Custom PSR-4-like autoloader in `autoload.php`:

| Transformation | Rule |
|---|---|
| Namespace prefix | `Progress_Planner\` stripped |
| Namespace separators | `\` becomes `/` |
| Underscores | Become `-` in filenames |
| Case | All lowercase directories |
| File prefix | `class-` prepended |

**Example**: `Progress_Planner\Admin\Widgets\Todo` resolves to `classes/admin/widgets/class-todo.php`

**Deprecated class handling**: Uses `Deprecations::CLASSES` map with `class_alias()` for backwards compatibility.

## Core Subsystems

| Subsystem | Directory | Purpose |
|---|---|---|
| Activities | `classes/activities/` | Activity tracking and querying |
| Admin | `classes/admin/` | Admin pages, widgets, editor integration |
| Badges | `classes/badges/` | Achievement/badge system |
| Goals | `classes/goals/` | Goal management (regular + recurring) |
| REST API | `classes/rest/` | External API endpoints |
| Suggested Tasks | `classes/suggested-tasks/` | Task recommendation engine |
| Updates | `classes/update/` | Version migration handlers |
| Utilities | `classes/utils/` | Cache, date, debug, onboard, playground |
| UI | `classes/ui/` | Branding, charts, popovers |
| WP-CLI | `classes/wp-cli/` | CLI commands |
| Actions | `classes/actions/` | WordPress action handlers |

## Key Design Patterns

- **Service Locator**: `Base::__call()` resolves and caches class instances on demand
- **Lazy Loading**: Classes instantiated only when first accessed
- **Singleton (per-service)**: Each service class exists as one instance
- **Template Method**: Widget base class (`class-widget.php`) defines rendering structure
- **Provider Pattern**: Suggested tasks use provider classes for extensible task sources
- **Data Collector Pattern**: `data-collector/` classes gather data for task recommendations
- **Trait Composition**: `Input_Sanitizer` trait shared across 30+ classes

## Database

2 custom tables:

| Table | Purpose | Key Columns |
|---|---|---|
| `progress_planner_activities` | Activity tracking | id, date, category, type, data_id, user_id |
| (cache table) | Internal caching | Managed via `classes/utils/class-cache.php` |

Migration classes in `classes/update/` handle schema changes across versions (1.3.0 through 1.10.0+).
