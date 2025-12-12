<?php
/**
 * Progress_Planner System Status.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

use Progress_Planner\Base;
use Progress_Planner\Goals\Goal_Recurring;
use Progress_Planner\Goals\Goal;

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
			\progress_planner()->get_activities__query()->query_activities( [ 'start_date' => new \DateTime( '-7 days' ) ] )
		);

		// Get the website activity score.
		$data['website_activity'] = [
			'score'     => $this->get_activity_score(),
			'checklist' => $this->get_checklist_results(),
		];

		// Get the badges from saved stats.
		// Badge calculations are now handled in React, so we return saved progress.
		$settings = \progress_planner()->get_settings();
		$saved_badges = $settings->get( 'badges', [] );

		// Badge name mapping (for external API compatibility).
		$badge_names = [
			'content-curator'        => \__( 'Content Curator', 'progress-planner' ),
			'revision-ranger'        => \__( 'Revision Ranger', 'progress-planner' ),
			'purposeful-publisher'   => \__( 'Purposeful Publisher', 'progress-planner' ),
			'progress-padawan'       => \__( 'Progress Padawan', 'progress-planner' ),
			'maintenance-maniac'     => \__( 'Maintenance Maniac', 'progress-planner' ),
			'super-site-specialist' => \__( 'Super Site Specialist', 'progress-planner' ),
		];

		$data['badges'] = [];
		foreach ( $saved_badges as $badge_id => $badge_data ) {
			// Get badge name (for monthly badges, generate from ID).
			$badge_name = $badge_names[ $badge_id ] ?? '';
			if ( empty( $badge_name ) && \str_starts_with( $badge_id, 'monthly-' ) ) {
				// Generate monthly badge name from ID.
				$parts = \explode( '-', \str_replace( 'monthly-', '', $badge_id ) );
				if ( \count( $parts ) === 2 ) {
					$year  = (int) $parts[0];
					$month = (int) \str_replace( 'm', '', $parts[1] );
					$months = [
						1  => 'Jack January',
						2  => 'Felix February',
						3  => 'Mary March',
						4  => 'Avery April',
						5  => 'Matteo May',
						6  => 'Jasmine June',
						7  => 'Joey July',
						8  => 'Abed August',
						9  => 'Sam September',
						10 => 'Oksana October',
						11 => 'Noah November',
						12 => 'Daisy December',
					];
					$badge_name = $months[ $month ] ?? '';
				}
			}

			$data['badges'][ $badge_id ] = \array_merge(
				[
					'id'   => $badge_id,
					'name' => $badge_name,
				],
				$badge_data
			);
		}

		$data['latest_badge'] = \progress_planner()->get_badges()->get_latest_completed_badge();

		$scores = \progress_planner()->get_ui__chart()->get_chart_data(
			[
				'items_callback' => fn( $start_date, $end_date ) => \progress_planner()->get_activities__query()->query_activities(
					[
						'start_date' => $start_date,
						'end_date'   => $end_date,
					]
				),
				'dates_params'   => [
					'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( '-6 months' ),
					'end_date'   => new \DateTime(),
					'frequency'  => 'monthly',
					'format'     => 'M',
				],
				'count_callback' => fn( $activities, $date ) =>
					\array_sum( \array_map( fn( $activity ) => $activity->get_points( $date ), $activities ) ) * 100 / Base::SCORE_TARGET,
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
				'id'          => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $recommendation->post_name ),
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

	/**
	 * Get the activity score.
	 *
	 * @return int The score.
	 */
	private function get_activity_score() {
		$activities = \progress_planner()->get_activities__query()->query_activities(
			// Use 31 days to take into account the activities score decay from previous activities.
			[ 'start_date' => new \DateTime( '-31 days' ) ]
		);

		$score        = 0;
		$current_date = new \DateTime();
		foreach ( $activities as $activity ) {
			$score += $activity->get_points( $current_date );
		}
		$score = \min( 100, \max( 0, $score ) );

		// Get the number of pending updates.
		$pending_updates = \wp_get_update_data()['counts']['total'];

		// Reduce points for pending updates.
		$score -= \min( \min( $score / 2, 25 ), $pending_updates * 5 );
		return (int) \floor( $score );
	}

	/**
	 * Get the checklist results.
	 *
	 * @return array<string, bool> The checklist results.
	 */
	private function get_checklist_results() {
		$items   = $this->get_checklist();
		$results = [];
		foreach ( $items as $item ) {
			$label             = (string) $item['label']; // @phpstan-ignore offsetAccess.invalidOffset
			$results[ $label ] = $item['callback'](); // @phpstan-ignore offsetAccess.invalidOffset
		}
		return $results;
	}

	/**
	 * Get the checklist items.
	 *
	 * @return array The checklist items.
	 */
	private function get_checklist() {
		return [
			[
				'label'    => \esc_html__( 'published content', 'progress-planner' ),
				'callback' => fn() => \count(
					\progress_planner()->get_activities__query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'publish',
						]
					)
				) > 0,
			],
			[
				'label'    => \esc_html__( 'updated content', 'progress-planner' ),
				'callback' => fn() => \count(
					\progress_planner()->get_activities__query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'update',
						]
					)
				) > 0,
			],
			[
				'label'    => 0 === \wp_get_update_data()['counts']['total']
					? \esc_html__( 'performed all updates', 'progress-planner' )
					: '<a href="' . \esc_url( \admin_url( 'update-core.php' ) ) . '">' . \esc_html__( 'Perform all updates', 'progress-planner' ) . '</a>',
				'callback' => fn() => ! \wp_get_update_data()['counts']['total'],
			],
		];
	}
}
