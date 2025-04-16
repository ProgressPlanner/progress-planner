<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Content_Activity class.
 */
final class Content_Activity extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'content-activity';

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
}
