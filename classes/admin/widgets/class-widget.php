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
	 * @return void
	 */
	public function render() {
		$this->enqueue_styles();
		$this->enqueue_scripts();
		?>
		<div
			class="prpl-widget-wrapper prpl-<?php echo \esc_attr( $this->id ); ?> prpl-widget-width-<?php echo (int) $this->width; ?>"
			data-force-last-column="<?php echo (int) $this->force_last_column; ?>"
		>
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
		\progress_planner()->get_admin__enqueue()->enqueue_style( "progress-planner/page-widgets/{$this->id}" );
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
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
