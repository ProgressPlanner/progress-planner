<?php
/**
 * Progress_Planner widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Activities\Content_Helpers;

/**
 * Published Content Widget.
 */
final class Published_Words extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'published-words';

	/**
	 * Get the chart args.
	 *
	 * @return array The chart args.
	 */
	public function get_chart_args() {
		return [
			'query_params'   => [
				'category' => 'content',
				'type'     => 'publish',
			],
			'dates_params'   => [
				'start'     => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $this->get_range() ),
				'end'       => new \DateTime(),
				'frequency' => $this->get_frequency(),
				'format'    => 'M',
			],
			'chart_params'   => [
				'type' => 'line',
			],
			'count_callback' => [ $this, 'count_words' ],
			'compound'       => false,
		];
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
			$words += Content_Helpers::get_word_count(
				$activity->get_post()->post_content,
				(int) $activity->data_id
			);
		}
		return $words;
	}

	/**
	 * Get the weekly words count.
	 *
	 * @return int The weekly words count.
	 */
	public function get_weekly_words() {
		static $weekly_words;
		if ( null === $weekly_words ) {
			$weekly_words = $this->count_words(
				Query::get_instance()->query_activities(
					[
						'category'   => 'content',
						'type'       => 'publish',
						'start_date' => new \DateTime( '-7 days' ),
					]
				)
			);
		}
		return $weekly_words;
	}
}
