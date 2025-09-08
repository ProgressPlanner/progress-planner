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
final class Badge_Streak extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-streak';

	/**
	 * Get the badge.
	 *
	 * @param string $context The context of the badges (content|maintenance|monthly).
	 *
	 * @return \Progress_Planner\Badges\Badge|false
	 */
	public function get_details( $context ) {
		static $result = [];
		if ( isset( $result[ $context ] ) && ! empty( $result[ $context ] ) ) {
			return $result[ $context ];
		}

		$badges = \progress_planner()->get_badges()->get_badges( $context );

		// Get the badge to display.
		foreach ( $badges as $badge ) {
			$progress = $badge->get_progress();
			if ( 100 > $progress['progress'] ) {
				$result[ $context ] = $badge;
				break;
			}
		}

		return isset( $result[ $context ] ) ? $result[ $context ] : false;
	}
}
