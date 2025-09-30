<?php
/**
 * Badge object.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Badges\Maintenance;

use Progress_Planner\Badges\Badge_Maintenance;

/**
 * Badge class.
 */
final class Super_Site_Specialist extends Badge_Maintenance {

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected $id = 'super-site-specialist';

	/**
	 * The badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return \__( 'Super Site Specialist', 'progress-planner' );
	}

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	public function get_description() {
		/* translators: %d: The number of weeks. */
		return \sprintf( \esc_html__( '%d weeks streak', 'progress-planner' ), 52 );
	}

	/**
	 * Progress callback.
	 *
	 * @param array $args The arguments for the progress callback.
	 *
	 * @return array
	 */
	public function progress_callback( $args = [] ) {
		$saved_progress = $this->get_saved();

		// If we have a saved value, return it.
		if ( isset( $saved_progress['progress'] ) && isset( $saved_progress['remaining'] ) ) {
			return $saved_progress;
		}

		$max_streak = $this->get_goal()->get_streak()['max_streak'];
		$percent    = \min( 100, \floor( 100 * $max_streak / 52 ) );
		$remaining  = 52 - \min( 52, $max_streak );

		$this->save_progress(
			[
				'progress'  => $percent,
				'remaining' => $remaining,
			]
		);

		return [
			'progress'  => $percent,
			'remaining' => $remaining,
		];
	}
}
