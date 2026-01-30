# Integrations

## SaaS Backend

The plugin communicates with a remote backend API for several features:

| Feature | Class | Details |
|---|---|---|
| Challenges | `Admin\Widgets\Challenge` | Fetches challenge feed; cached 1 day (1 hour if empty, 5 min on error) |
| What's New | `Admin\Widgets\Whats_New` | Blog posts and media from remote API |
| Branding | `UI\Branding` | Remote branding assets |
| Onboarding | `Utils\Onboard` | `wp_remote_post()` for onboarding data |
| Lessons | `Lessons` | Remote lesson data fetching |

External link URLs use `prpl.fyi` short links (e.g., `https://prpl.fyi/perform-all-updates`) processed through `progress_planner()->get_ui__branding()->get_url()`.

## REST API

### Endpoints

Registered under namespace `progress-planner/v1`:

| Route | Method | Class | Purpose |
|---|---|---|---|
| `/tasks` | GET | `Rest\Tasks` | Task recommendations |
| `/stats` | GET | `Rest\Stats` | Plugin statistics |

### Authentication

**Base class**: `Rest\Base` (`classes/rest/class-base.php`)

- **Token-based**: Validates test token or license key
- **Rate limiting**: 10 failed attempts per IP per hour
- **IP detection**: Supports Cloudflare, Nginx proxy, X-Forwarded-For, direct
- **Timing attack prevention**: Uses `hash_equals()` for token comparison
- **Permission callback**: `__return_true` (auth handled in endpoint logic)

## Yoast SEO Integration

**22 files** in `classes/suggested-tasks/providers/integrations/yoast/`

### Core Classes

| Class | Purpose |
|---|---|
| `Yoast_Provider` | Abstract base for all Yoast providers |
| `Yoast_Interactive_Provider` | Interactive task provider base |
| `Add_Yoast_Providers` | Manager that registers all Yoast providers |

### Task Providers

- Archive management: author, date, format archives
- Crawl settings: emoji scripts, feed authors, feed comments
- Media pages configuration
- Organization logo setup
- Orphaned content detection and fixing
- Cornerstone content workout

### Security

`Ajax_Security_Yoast` trait handles AJAX security checks specific to Yoast operations.

## All in One SEO (AIOSEO) Integration

**12 files** in `classes/suggested-tasks/providers/integrations/aioseo/`

### Core Classes

| Class | Purpose |
|---|---|
| `Aioseo_Provider` | Abstract base for AIOSEO providers |
| `Aioseo_Interactive_Provider` | Interactive task provider base |
| `Add_Aioseo_Providers` | Manager that registers all AIOSEO providers |

### Task Providers

- Archive management: author, date archives
- Crawl settings: feed authors, feed comments
- Media pages configuration
- Organization logo setup

### Security

`Ajax_Security_Aioseo` trait handles AJAX security checks specific to AIOSEO operations.

## WordPress.org API

| Usage | URL | Class |
|---|---|---|
| Translation list | `https://api.wordpress.org/translations/core/1.0/` | `Suggested_Tasks\Providers\Select_Locale` |

## WP-CLI Commands

Registered under the `prpl` namespace:

| Command | Class | Purpose |
|---|---|---|
| `wp prpl task list` | `WP_CLI\Task_Command` | List tasks with format/fields/filter options |
| `wp prpl get-stats` | `WP_CLI\Get_Stats_Command` | Retrieve plugin statistics |

Commands are only loaded when `WP_CLI` constant is defined.

## WordPress Core Integration

- **Block Editor**: `Admin\Editor` adds editor sidebar/panel integration
- **Dashboard Widgets**: Score widget and Todo widget on WP dashboard
- **Admin Pages**: Custom admin page with widget-based layout
- **Settings API**: Custom settings page via `Admin\Page_Settings`
- **Post Meta**: Todo items stored as post meta via `Page_Todos`
- **Guided Tour**: `Admin\Tour` using driver.js for onboarding
- **Plugin Installer**: `Plugin_Installer` for recommending/installing related plugins

## Third-Party

Additional integrations in `classes/third-party/` for other WordPress plugins and services.
