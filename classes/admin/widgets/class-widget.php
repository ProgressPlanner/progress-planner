<?php
/**
 * Base class for widgets.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use Progress_Planner\Utils\Traits\Input_Sanitizer;

/**
 * Widgets class.
 *
 * All widgets should extend this class.
 */
abstract class Widget {

	use Input_Sanitizer;

	/**
	 * The widget width.
	 *
	 * Can be 1 or 2.
	 *
	 * @var int
	 */
	protected $width = 1;

	/**
	 * Whether the widget should be forced to the last column.
	 *
	 * @var bool
	 */
	protected $force_last_column = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
	}

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Get the widget ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Get the widget width.
	 *
	 * @return int Widget width (1 or 2).
	 */
	public function get_width() {
		return $this->width;
	}

	/**
	 * Get whether the widget should be forced to the last column.
	 *
	 * @return bool Whether the widget should be forced to the last column.
	 */
	public function get_force_last_column() {
		return $this->force_last_column;
	}

	/**
	 * Get the widget range.
	 *
	 * @return string
	 */
	public function get_range() {
		return $this->get_sanitized_get( 'range', '-6 months' );
	}

	/**
	 * Get the widget frequency.
	 *
	 * @return string
	 */
	public function get_frequency() {
		return $this->get_sanitized_get( 'frequency', 'monthly' );
	}

	/**
	 * Render the widget.
	 *
	 * @deprecated This method is no longer used. Widgets are now rendered
	 *             via the unified React dashboard. Kept for backward compatibility.
	 *
	 * @return void
	 */
	public function render() {
		// Widgets are now rendered via the unified React dashboard.
		// This method is kept for backward compatibility but does nothing.
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		\progress_planner()->get_admin__enqueue()->enqueue_style( "progress-planner/page-widgets/{$this->id}" );
	}

	/**
	 * Enqueue scripts.
	 *
	 * Individual widget scripts for the Progress Planner admin page are now handled
	 * by the unified dashboard. Widget classes can override this method to enqueue
	 * individual scripts for WordPress dashboard widgets (wp-admin/index.php).
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Default: scripts are handled by unified dashboard for main admin page.
		// Override in child classes if needed for WordPress dashboard widgets.
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		return [];
	}

	/**
	 * Get widget configuration for React component.
	 * Should be overridden by child classes.
	 *
	 * @return array Widget configuration array.
	 */
	public function get_widget_config() {
		return [];
	}

	/**
	 * Get widget title HTML.
	 * May be overridden by child classes.
	 *
	 * @return string Widget title HTML.
	 */
	public function get_title_html() {
		return '';
	}
}
