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
final class Badge_Streak_Content extends Badge_Streak {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-streak-content';

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
	public function enqueue_scripts() {
		$asset_file = \PROGRESS_PLANNER_DIR . '/build/content-badges.asset.php';
		$asset      = include $asset_file;

		\wp_enqueue_script(
			'progress-planner/content-badges',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/content-badges.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
}
