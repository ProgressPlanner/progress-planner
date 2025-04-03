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
final class Wonderful_Writer extends Badge_Content {

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected $id = 'wonderful-writer';

	/**
	 * The badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return \__( 'Wonderful Writer', 'progress-planner' );
	}

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	public function get_description() {
		return \esc_html__( '20 existing posts/pages, or 10 new posts/pages', 'progress-planner' );
	}

	/**
	 * Progress callback.
	 *
	 * @return array
	 */
	public function progress_callback() {
		// Get the saved progress.
		$saved_progress = $this->get_saved();

		// If we have a saved value, return it.
		if ( isset( $saved_progress['progress'] ) && isset( $saved_progress['remaining'] ) ) {
			return $saved_progress;
		}

		// Get the total number of posts.
		$total_posts_count = 0;
		foreach ( \progress_planner()->get_activities__content_helpers()->get_post_types_names() as $post_type ) {
			$total_posts_count += \wp_count_posts( $post_type )->publish;
		}

		$remaining = 20 - min( 20, $total_posts_count );

		// If there are 20 existing posts, save the badge as complete and return.
		if ( 0 === $remaining ) {
			$this->save_progress(
				[
					'progress'  => 100,
					'remaining' => 0,
				]
			);

			return [
				'progress'  => 100,
				'remaining' => 0,
			];
		}

		// Get the new posts count.
		$new_count = count(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'category'   => 'content',
					'type'       => 'publish',
					'start_date' => \progress_planner()->get_activation_date(),
				]
			)
		);

		$remaining_new = 10 - min( 10, $new_count );

		$final_percent   = max(
			min( 100, floor( $total_posts_count / 2 ) ),
			min( 100, floor( $new_count * 10 ) )
		);
		$final_remaining = min( $remaining, $remaining_new );

		$this->save_progress(
			[
				'progress'  => $final_percent,
				'remaining' => $final_remaining,
			]
		);

		return [
			'progress'  => $final_percent,
			'remaining' => $final_remaining,
		];
	}
}
