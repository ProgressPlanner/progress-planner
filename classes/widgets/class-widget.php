<?php
/**
 * Base class for widgets.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

/**
 * Widgets class.
 *
 * All widgets should extend this class.
 */
abstract class Widget {

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
	 * Get the widget range.
	 *
	 * @return string
	 */
	public function get_range() {
		// phpcs:ignore WordPress.Security.NonceVerification
		return isset( $_GET['range'] )
			// phpcs:ignore WordPress.Security.NonceVerification
			? \sanitize_text_field( \wp_unslash( $_GET['range'] ) )
			: '-6 months';
	}

	/**
	 * Get the widget frequency.
	 *
	 * @return string
	 */
	public function get_frequency() {
		// phpcs:ignore WordPress.Security.NonceVerification
		return isset( $_GET['frequency'] )
			// phpcs:ignore WordPress.Security.NonceVerification
			? \sanitize_text_field( \wp_unslash( $_GET['frequency'] ) )
			: 'monthly';
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	public function render() {
		$this->enqueue_styles();
		$this->enqueue_scripts();
		?>
		<div class="prpl-widget-wrapper prpl-<?php echo \esc_attr( $this->id ); ?>">
			<div class="widget-inner-container">
				<?php \progress_planner()->the_view( "page-widgets/{$this->id}.php" ); ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		$stylesheet = "/assets/css/page-widgets/{$this->id}.css";
		if ( \file_exists( PROGRESS_PLANNER_DIR . $stylesheet ) ) {
			\wp_enqueue_style(
				'prpl-widget-' . $this->id,
				PROGRESS_PLANNER_URL . $stylesheet,
				[],
				\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . $stylesheet )
			);
		}
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'widgets/' . $this->id );
	}
}
