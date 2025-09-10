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
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/page-widgets/badge-streak' );
	}
}
