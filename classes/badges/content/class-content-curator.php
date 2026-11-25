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
final class Content_Curator extends Badge_Content {

	/**
	 * The number of new posts or pages to earn this badge.
	 *
	 * @var int
	 */
	const TARGET = 10;

	/**
	 * Or: the number of published posts or pages, old and new.
	 *
	 * @var int
	 */
	const TARGET_EXISTING = 20;

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected $id = 'content-curator';

	/**
	 * The badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return \__( 'Content Curator', 'progress-planner' );
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
	 * @param array $args The arguments for the progress callback.
	 *
	 * @return array
	 */
	public function progress_callback( $args = [] ) {
		// Get the saved progress.
		$saved_progress = $this->get_saved();

		// If we have a saved value, return it.
		if ( isset( $saved_progress['progress'] ) && isset( $saved_progress['remaining'] ) ) {
			return $saved_progress;
		}

		// Get the total number of posts.
		$total_posts_count = 0;
		foreach ( \progress_planner()->get_settings()->get_post_types_names() as $post_type ) {
			$total_posts_count += \wp_count_posts( $post_type )->publish;
		}

		$remaining = self::TARGET_EXISTING - \min( self::TARGET_EXISTING, $total_posts_count );

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
		$new_count = \count(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'category'   => 'content',
					'type'       => 'publish',
					'start_date' => \progress_planner()->get_activation_date(),
				]
			)
		);

		$remaining_new = self::TARGET - \min( self::TARGET, $new_count );

		$final_percent   = \max(
			\min( 100, \floor( $total_posts_count / 2 ) ),
			\min( 100, \floor( 100 * $new_count / self::TARGET ) )
		);
		$final_remaining = \min( $remaining, $remaining_new );

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
