# Guided Tours for WordPress

A complete solution for creating guided tours that span multiple WordPress admin screens, using driver.js for the UI and server-side state persistence.

**Note:** This is for hosting partner installations, distinct from the plugin onboarding (which is for users installing from wp.org).

## Features

- Multi-page tours - Guide users across different admin screens
- Persistent state - Progress saved in user meta, survives page reloads
- Customizable UI - Clean, modern design with driver.js
- Extensible - Add custom tours via filters
- Responsive - Works on all screen sizes
- Accessible - Keyboard navigation and ARIA support

## File Structure

```
guided-tour/
├── class-guided-tour.php       # Core tour management
├── class-tour-launcher.php     # UI components for starting tours
├── class-integration.php       # Integration helper with examples
├── guided-tour.css             # Styling
└── guided-tour.js              # Frontend tour controller
```

## Quick Start

### 1. Include the integration file

```php
// In your main plugin file
require_once __DIR__ . '/guided-tour/class-integration.php';
add_action( 'plugins_loaded', [ 'Progress_Planner\Guided_Tour\Integration', 'init' ] );
```

### 2. Define the plugin version constant

```php
define( 'PROGRESS_PLANNER_VERSION', '1.0.0' );
```

## Defining Tours

Tours are defined in `class-guided-tour.php` in the `register_tours()` method:

```php
$this->tours = [
    'my-tour' => [
        'id'          => 'my-tour',
        'title'       => 'My Tour Title',
        'description' => 'Short description of what this tour covers.',
        'steps'       => [
            [
                'page'        => 'index.php',           // WP admin page
                'element'     => '#my-element',         // CSS selector
                'title'       => 'Step Title',
                'description' => 'Step description text.',
                'side'        => 'bottom',              // Popover position
            ],
            // More steps...
        ],
    ],
];
```

### Step Options

| Option | Type | Description |
|--------|------|-------------|
| `context` | string | Step context: `admin`, `frontend`, or `editor` (default: `admin`) |
| `page` | string | Page identifier: admin path, `front_page` for homepage/editor |
| `element` | string | CSS selector or special element type (see below) |
| `title` | string | Step title shown in popover |
| `description` | string | Step description text |
| `fallback_description` | string | Alternative description when element is not found |
| `hint` | string | Additional hint text shown below description |
| `side` | string | Popover position: `top`, `bottom`, `left`, `right` |
| `align` | string | Popover alignment: `start`, `center`, `end` |

### Step Contexts

Tours can span multiple contexts:

- **`admin`** - WordPress admin pages (default)
- **`frontend`** - The site frontend (e.g., homepage)
- **`editor`** - Block editor for posts/pages

### Special Element Types

For editor context, use these special element identifiers:

| Element | Description |
|---------|-------------|
| `first-heading` | First heading block (h1-h6) or post title |
| `first-paragraph` | First paragraph block |
| `first-image` | First image or cover block |
| `save-button` | The Save/Update button in editor header |

These are automatically resolved to the correct elements in both iframe and non-iframe editor modes.

## Adding Custom Tours via Filter

```php
add_filter( 'progress_planner_guided_tours', function( $tours ) {
    $tours['custom-feature'] = [
        'id'          => 'custom-feature',
        'title'       => 'Custom Feature Tour',
        'description' => 'Learn about this feature.',
        'steps'       => [
            [
                'page'        => 'admin.php?page=my-plugin&tab=custom',
                'element'     => '.custom-feature-widget',
                'title'       => 'Custom Feature',
                'description' => 'This widget shows custom data.',
                'side'        => 'right',
            ],
        ],
    ];
    return $tours;
} );
```

### Multi-Context Tour Example

```php
$tours['homepage-setup'] = [
    'id'          => 'homepage-setup',
    'title'       => 'Edit Your Homepage',
    'description' => 'Learn how to customize your homepage.',
    'steps'       => [
        // Step 1: Frontend - show welcome card
        [
            'context'     => 'frontend',
            'page'        => 'front_page',
            'element'     => '#wp-admin-bar-edit',
            'title'       => 'Edit Page',
            'description' => 'Click here to edit your homepage.',
            'side'        => 'bottom',
        ],
        // Step 2: Editor - highlight heading
        [
            'context'     => 'editor',
            'page'        => 'front_page',
            'element'     => 'first-heading',
            'title'       => 'Your Headline',
            'description' => 'Update this heading to reflect your brand.',
            'side'        => 'right',
        ],
        // Step 3: Editor - highlight image with fallback
        [
            'context'              => 'editor',
            'page'                 => 'front_page',
            'element'              => 'first-image',
            'title'                => 'Add Images',
            'description'          => 'Use authentic photos for better engagement.',
            'fallback_description' => 'No images found. Consider adding some photos!',
            'side'                 => 'right',
        ],
        // Step 4: Editor - save button
        [
            'context'     => 'editor',
            'page'        => 'front_page',
            'element'     => 'save-button',
            'title'       => 'Save Changes',
            'description' => 'Click Save to publish your changes.',
            'side'        => 'bottom',
        ],
    ],
];
```

## UI Components

### Tour Launcher Widget

Displays all available tours in a card:

```php
$launcher = Integration::get_launcher();
$launcher->render( [
    'title'       => 'Get Started',
    'description' => 'Take a guided tour.',
    'tour_ids'    => [ 'hosting-setup' ], // Optional: limit to specific tours
] );
```

### Single Tour Button

```php
$launcher->render_button( 'hosting-setup', [
    'text'  => 'Start Setup',
    'class' => 'button button-primary',
] );
```

### First-Time User Prompt

```php
$launcher->maybe_show_prompt( 'first-time-setup', [
    'title'       => 'New here?',
    'description' => 'Take a quick tour.',
] );
```

## Programmatic Control

```php
// Start a tour
Integration::start_tour( 'hosting-setup' );

// Check if completed
if ( Integration::is_tour_completed( 'hosting-setup' ) ) {
    // Tour was completed
}

// Reset a tour (allow retaking)
Integration::reset_tour( 'hosting-setup' );
```

## JavaScript API

The tour manager is exposed globally:

```javascript
// Start a tour
window.ppGuidedTourManager.startTour( 'hosting-setup' );

// Skip current tour
window.ppGuidedTourManager.skipTour();

// Check state
console.log( window.ppGuidedTour.state );
```

## Hooks & Filters

### PHP Filters

| Filter | Description |
|--------|-------------|
| `progress_planner_guided_tours` | Add/modify tour definitions |
| `progress_planner_is_hosting_install` | Auto-start hosting tour on partner installs |

### PHP Actions

| Action | Description |
|--------|-------------|
| `progress_planner_dashboard_sidebar` | Render launcher in dashboard |
| `progress_planner_activated` | Plugin activation hook |

## Styling Customization

Override CSS variables for quick theming:

```css
.pp-guided-tour-popover {
    --driver-popover-bg: #fff;
    --driver-popover-title-color: #1e1e1e;
    --driver-popover-description-color: #50575e;
    --driver-popover-border-radius: 8px;
}
```

## How It Works

1. **Tour starts** - State saved to `user_meta` with `tour_id` and `step: 0`
2. **Page loads** - JS checks current context (admin/frontend/editor) and page
3. **Context match** - Initialize driver.js with step(s) for this context
4. **No match** - Show "Continue" prompt to navigate to correct page/context
5. **Step advances** - AJAX updates server state, redirects if needed
6. **Tour completes** - Tour ID added to `completed` array in user meta

### Multi-Context Flow

For tours spanning frontend and editor:

1. Tour starts on **frontend** (e.g., homepage)
2. Welcome card shown, user clicks "Edit Page" in admin bar
3. Progress updated, user redirected to **block editor**
4. Editor steps highlight content blocks (heading, paragraph, image)
5. Special elements resolved inside iframe canvas when applicable
6. Final step highlights Save button, tour completes

## Testing

### Local Development

1. Add this filter to enable the tour:
   ```php
   add_filter( 'progress_planner_is_hosting_install', '__return_true' );
   ```

2. Visit the site's homepage (not wp-admin) while logged in as admin

3. A welcome card appears in the bottom-right corner - click it to start the tour

4. Follow the tour: Edit Page link → heading → paragraph → image → Save button

5. To reset and test again:
   ```php
   delete_user_meta( get_current_user_id(), 'pp_guided_tour_state' );
   ```

### Playground / Admin Bar Testing

On the frontend homepage, an admin bar link provides easy tour control:

| Tour State | Admin Bar Link | Action |
|------------|----------------|--------|
| No active tour | **Start Guided Tour** | Starts the `go-to-publish` tour |
| Tour in progress | **Reset Tour** | Clears tour state, allows restart |

**URLs used:**
- Start tour: `?pp_start_tour=go-to-publish`
- Reset tour: `?pp_reset_tour=1`

This allows testing without code changes - simply click the admin bar link to start or reset the tour.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies

- [driver.js](https://driverjs.com/) v1.3.1 (loaded from CDN)
- WordPress 5.6+
- PHP 7.4+

## License

GPL v2 or later
