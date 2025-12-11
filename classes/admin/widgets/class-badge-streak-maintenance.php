<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Badge_Streak class.
 */
final class Badge_Streak_Maintenance extends Badge_Streak {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-streak-maintenance';

	/**
	 * Whether the widget should be forced to the last column.
	 *
	 * @var bool
	 */
	protected $force_last_column = true;

	/**
	 * Enqueue scripts for this widget.
	 *
	 * @return void
	 */
	/**
	 * Get widget configuration.
	 *
	 * @return array Widget configuration.
	 */
	public function get_widget_config() {
		// Get widget title (may be custom branded or default).
		$widget_title = \progress_planner()->get_ui__branding()->get_widget_title(
			'badge-streak-maintenance',
			\esc_html__( 'Your streak badges', 'progress-planner' )
		);

		// Get info icon SVG content.
		$info_icon_svg = \progress_planner()->get_asset( 'images/icon_info.svg' );

		return [
			'title'       => $widget_title,
			'infoIconSvg' => $info_icon_svg,
		];
	}
}
