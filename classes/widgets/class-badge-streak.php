<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Widget;

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
	 * @return array
	 */
	public function get_details( $context ) {
		static $result = [];
		if ( ! empty( $result ) ) {
			return $result;
		}

		$badges = \progress_planner()->get_badges()->get_badges( $context );

		// Get the badge to display.
		foreach ( $badges as $badge ) {
			$progress = $badge->get_progress();
			if ( 100 > $progress['progress'] ) {
				break;
			}
		}

		if ( ! isset( $badge ) || ! isset( $progress ) ) {
			return $result;
		}

		$result['progress'] = $progress;
		$result['badge']    = [
			'id'                => $badge->get_id(),
			'name'              => $badge->get_name(),
			'description'       => $badge->get_description(),
			'progress_callback' => [ $badge, 'progress_callback' ],
		];

		$result['color'] = 'var(--prpl-color-accent-red)';
		if ( $result['progress']['progress'] > 50 ) {
			$result['color'] = 'var(--prpl-color-accent-orange)';
		}
		if ( $result['progress']['progress'] > 75 ) {
			$result['color'] = 'var(--prpl-color-accent-green)';
		}
		return $result;
	}
}
