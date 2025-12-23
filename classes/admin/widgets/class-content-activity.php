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
	 * @param string $type The type of activity.
	 * @param string $color The color of the chart.
	 *
	 * @return array The chart args.
	 */
	public function get_chart_args_content_count( $type = 'publish', $color = '#534786' ) {
		return \array_merge(
			$this->get_chart_args( $type, $color ),
			[
				// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
				'count_callback' => fn( $activities, $date = null ) => \count( $activities ),
				'return_data'    => [ 'label', 'score' ],
			]
		);
	}

	/**
	 * Get the chart args.
	 *
	 * @param string $type The type of activity.
	 * @param string $color The color of the chart.
	 *
	 * @return array The chart args.
	 */
	public function get_chart_args( $type = 'publish', $color = '#534786' ) {
		return [
			'type'           => 'line',
			'items_callback' => fn( $start_date, $end_date ) => \progress_planner()->get_activities__query()->query_activities(
				[
					'category'   => 'content',
					'start_date' => $start_date,
					'end_date'   => $end_date,
					'type'       => $type,
				]
			),
			'dates_params'   => [
				'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $this->get_range() ),
				'end_date'   => new \DateTime(),
				'frequency'  => $this->get_frequency(),
				'format'     => 'M',
			],
			'filter_results' => [ $this, 'filter_activities' ],
			'color'          => fn() => $color,
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
		return \array_filter(
			$activities,
			fn( $activity ) => 'delete' === $activity->type
				|| ( \is_object( $activity->get_post() )
					&& \in_array( $activity->get_post()->post_type, \progress_planner()->get_activities__content_helpers()->get_post_types_names(), true )
				)
		);
	}
}
