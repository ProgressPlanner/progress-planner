<?php
/**
 * Progress_Planner System Status.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

use Progress_Planner\Base;
use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * System_Status class.
 */
class System_Status {

	/**
	 * Get the system status.
	 *
	 * @return array The system status data.
	 */
	public function get_system_status() {
		$data = [];

		// Get the number of pending updates.
		$data['pending_updates'] = \wp_get_update_data()['counts']['total'];

		// Get number of content from any public post-type, published in the past week.
		$data['weekly_posts'] = \count(
			\get_posts(
				[
					'post_status'    => 'publish',
					'post_type'      => 'post',
					'date_query'     => [ [ 'after' => '1 week ago' ] ],
					'posts_per_page' => 10,
				]
			)
		);

		// Get the number of activities in the past week.
		$data['activities'] = \count(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'start_date' => new \DateTime( '-7 days' ),
				]
			)
		);

		// Get the website activity score.
		$activity_score           = new Activity_Scores();
		$data['website_activity'] = [
			'score'     => $activity_score->get_score(),
			'checklist' => $activity_score->get_checklist_results(),
		];

		// Get the badges.
		$badges = \array_merge(
			\progress_planner()->get_badges()->get_badges( 'content' ),
			\progress_planner()->get_badges()->get_badges( 'maintenance' ),
			\progress_planner()->get_badges()->get_badges( 'monthly_flat' )
		);

		$data['badges'] = [];
		foreach ( $badges as $badge ) {
			$data['badges'][ $badge->get_id() ] = \array_merge(
				[
					'id'   => $badge->get_id(),
					'name' => $badge->get_name(),
				],
				$badge->progress_callback()
			);
		}

		$data['latest_badge'] = \progress_planner()->get_badges()->get_latest_completed_badge();

		$scores = \progress_planner()->get_ui__chart()->get_chart_data(
			[
				'items_callback' => function ( $start_date, $end_date ) {
					return \progress_planner()->get_activities__query()->query_activities(
						[
							'start_date' => $start_date,
							'end_date'   => $end_date,
						]
					);
				},
				'dates_params'   => [
					'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( '-6 months' ),
					'end_date'   => new \DateTime(),
					'frequency'  => 'monthly',
					'format'     => 'M',
				],
				'count_callback' => function ( $activities, $date ) {
					$score = 0;
					foreach ( $activities as $activity ) {
						$score += $activity->get_points( $date );
					}
					return $score * 100 / Base::SCORE_TARGET;
				},
				'normalized'     => true,
				'max'            => 100,
			]
		);

		$data['scores'] = [];
		foreach ( $scores as $item ) {
			$data['scores'][] = [
				'label' => $item['label'],
				'value' => $item['score'],
			];
		}

		// The website URL.
		$data['website'] = \home_url();

		// Timezone offset.
		$data['timezone_offset'] = \wp_timezone()->getOffset( new \DateTime( 'midnight' ) ) / 3600;
		$ravis_recommendations   = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );
		$data['recommendations'] = [];
		foreach ( $ravis_recommendations as $recommendation ) {
			$r = [
				'id'          => $recommendation->task_id,
				'title'       => $recommendation->post_title,
				'url'         => $recommendation->url,
				'provider_id' => $recommendation->get_provider_id(),
			];

			if ( 'user' === $recommendation->get_provider_id() ) {
				$r['points'] = (int) $recommendation->points;
			}
			$data['recommendations'][] = $r;
		}

		$data['plugin_url'] = \esc_url( \get_admin_url( null, 'admin.php?page=progress-planner' ) );

		$active_plugins  = \get_option( 'active_plugins' );
		$data['plugins'] = [];
		foreach ( $active_plugins as $plugin ) {
			$plugin_data       = \get_plugin_data( \WP_PLUGIN_DIR . '/' . $plugin );
			$data['plugins'][] = [
				'plugin'  => $plugin,
				'name'    => $plugin_data['Name'] ?? 'N/A', // @phpstan-ignore-line nullCoalesce.offset
				'version' => $plugin_data['Version'] ?? 'N/A', // @phpstan-ignore-line nullCoalesce.offset
			];
		}

		$data['branding_id'] = (int) \progress_planner()->get_ui__branding()->get_branding_id();

		return $data;
	}
}
