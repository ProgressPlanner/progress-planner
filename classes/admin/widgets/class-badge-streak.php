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
abstract class Badge_Streak extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-streak';

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/page-widgets/badge-streak' );
	}

	/**
	 * Get the badge.
	 *
	 * Note: This method is deprecated. Badge calculations are now handled in React.
	 * Returns false as badge data is fetched via REST API.
	 *
	 * @param string $context The context of the badges (content|maintenance|monthly).
	 *
	 * @return false Always returns false (badges are handled in React).
	 */
	public function get_details( $context ) {
		// Badge calculations are now handled in React via REST API.
		// This method is kept for backward compatibility but returns false.
		return false;
	}
}
