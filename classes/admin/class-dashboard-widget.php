<?php
/**
 * Add a widget to the WordPress dashboard.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Class Dashboard_Widget
 */
abstract class Dashboard_Widget {

	/**
	 * The widghet ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'wp_dashboard_setup', [ $this, 'add_dashboard_widget' ] );
	}

	/**
	 * The capability required to see the widget.
	 *
	 * @var string
	 */
	protected $capability = 'manage_options';

	/**
	 * Add the dashboard widget.
	 *
	 * @return void
	 */
	public function add_dashboard_widget() {
		// The widgets render admin UI and localize a nonce for the plugin's AJAX
		// actions, so they must not be registered for users who can't use them.
		if ( ! \current_user_can( $this->capability ) ) {
			return;
		}

		\wp_add_dashboard_widget(
			"progress_planner_dashboard_widget_{$this->id}",
			$this->get_title(),
			[ $this, 'render_widget' ]
		);
	}

	/**
	 * Get the title of the widget.
	 *
	 * @return string
	 */
	abstract protected function get_title();

	/**
	 * Render the dashboard widget.
	 *
	 * @return void
	 */
	abstract public function render_widget();
}
