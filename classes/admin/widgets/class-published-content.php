<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Published_Content class.
 */
final class Published_Content extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'published-content';

	/**
	 * Get stats for posts, by post-type.
	 *
	 * @return array The stats.
	 */
	public function get_stats() {
		static $stats;
		if ( null !== $stats ) {
			return $stats;
		}
		$post_types = \progress_planner()->get_activities__content_helpers()->get_post_types_names();
		$weekly     = [];
		$all        = [];
		foreach ( $post_types as $post_type ) {
			// Get the content published this week.
			$weekly[ $post_type ] = count(
				\get_posts(
					[
						'post_status'    => 'publish',
						'post_type'      => $post_type,
						'date_query'     => [
							[
								'after' => '1 week ago',
							],
						],
						'posts_per_page' => 100,
					]
				)
			);
			// Get the total number of posts for this post-type.
			$all[ $post_type ] = \wp_count_posts( $post_type )->publish;
		}

		$stats = [
			'weekly' => $weekly,
			'all'    => $all,
		];
		return $stats;
	}

	/**
	 * Get the chart args.
	 *
	 * @return array The chart args.
	 */
	public function get_chart_args_content_count() {
		return array_merge(
			$this->get_chart_args(),
			[
				'count_callback' => function ( $activities, $date = null ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
					return count( $activities );
				},
			]
		);
	}

	/**
	 * Get the chart args.
	 *
	 * @return array The chart args.
	 */
	public function get_chart_args() {
		return [
			'type'           => 'line',
			'items_callback' => function ( $start_date, $end_date ) {
				return \progress_planner()->get_activities__query()->query_activities(
					[
						'category'   => 'content',
						'type'       => 'publish',
						'start_date' => $start_date,
						'end_date'   => $end_date,
					]
				);
			},
			'dates_params'   => [
				'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $this->get_range() ),
				'end_date'   => new \DateTime(),
				'frequency'  => $this->get_frequency(),
				'format'     => 'M',
			],
			'filter_results' => [ $this, 'filter_activities' ],
		];
	}

	/**
	 * Callback to filter the activities.
	 *
	 * @param \Progress_Planner\Activities\Content[] $activities The activities array.
	 *
	 * @return \Progress_Planner\Activities\Content[]
	 */
	public function filter_activities( $activities ) {
		return array_filter(
			$activities,
			function ( $activity ) {
				$post = $activity->get_post();
				return is_object( $post )
					&& \in_array( $post->post_type, \progress_planner()->get_activities__content_helpers()->get_post_types_names(), true );
			}
		);
	}

	/**
	 * Callback to count the words in the activities.
	 *
	 * @param \Progress_Planner\Activities\Content[] $activities The activities array.
	 *
	 * @return int
	 */
	public function count_words( $activities ) {
		$words = 0;
		foreach ( $activities as $activity ) {
			if ( null === $activity->get_post() ) {
				continue;
			}
			$words += \progress_planner()->get_activities__content_helpers()->get_word_count(
				$activity->get_post()->post_content,
				(int) $activity->data_id
			);
		}
		return $words;
	}
}
