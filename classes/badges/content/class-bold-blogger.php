<?php
/**
 * Badge object.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Badges\Content;

use Progress_Planner\Badges\Badge_Content;

/**
 * Badge class.
 */
final class Bold_Blogger extends Badge_Content {

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected $id = 'bold-blogger';

	/**
	 * The badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return \__( 'Bold Blogger', 'progress-planner' );
	}

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	public function get_description() {
		/* translators: %d: The number of new posts to write. */
		return sprintf( \esc_html__( 'Write %d new posts or pages', 'progress-planner' ), 30 );
	}

	/**
	 * Progress callback.
	 *
	 * @return array
	 */
	public function progress_callback() {
		$saved_progress = $this->get_saved();

		// If we have a saved value, return it.
		if ( isset( $saved_progress['progress'] ) && isset( $saved_progress['remaining'] ) ) {
			return $saved_progress;
		}

		// Get the number of new posts published.
		$new_count = count(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'category'   => 'content',
					'type'       => 'publish',
					'start_date' => \progress_planner()->get_activation_date(),
				],
			)
		);

		$percent   = min( 100, floor( 100 * $new_count / 30 ) );
		$remaining = 30 - min( 30, $new_count );

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
