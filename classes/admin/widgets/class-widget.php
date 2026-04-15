<?php
/**
 * Base class for widgets.
 *
 * Since Phase 4 of the wp-admin-ui extraction, this class extends the
 * kit's Widget base. Rendering mechanics (wrapper div, CSS class naming,
 * view loading) now live in the kit. Progress-planner-specific additions
 * (range/frequency getters, stylesheet-dependency helper) stay here.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use ProgressPlanner\AdminUI\Widgets\Widget as Kit_Widget;
use Progress_Planner\Admin\Admin_UI_Instance;
use Progress_Planner\Utils\Traits\Input_Sanitizer;

/**
 * Widgets class.
 *
 * All widgets should extend this class.
 */
abstract class Widget extends Kit_Widget {

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
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Concrete widgets are instantiated via Base::__call() which passes an
	 * empty args array to the constructor. We forward the kit's required
	 * AdminUI dependency from the progress-planner singleton.
	 */
	public function __construct() {
		parent::__construct( Admin_UI_Instance::get() );
	}

	/**
	 * Get the widget range.
	 */
	public function get_range(): string {
		return $this->get_sanitized_get( 'range', '-6 months' );
	}

	/**
	 * Get the widget frequency.
	 */
	public function get_frequency(): string {
		return $this->get_sanitized_get( 'frequency', 'monthly' );
	}

	/**
	 * Enqueue this widget's stylesheet via progress-planner's legacy path
	 * (kept for backwards compatibility — a number of widgets override this
	 * and still expect the 'progress-planner/page-widgets/{id}' handle).
	 */
	public function enqueue_styles(): void {
		\progress_planner()->get_admin__enqueue()->enqueue_style( "progress-planner/page-widgets/{$this->id}" );
	}

	/**
	 * Enqueue this widget's script (legacy path).
	 */
	public function enqueue_scripts(): void {
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'widgets/' . $this->id );
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		return [];
	}
}
