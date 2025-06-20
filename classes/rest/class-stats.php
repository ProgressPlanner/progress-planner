<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get stats, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/get-stats/token/<site-token>
 *
 * The token is generated and saved in the settings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

use Progress_Planner\Base;
use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * Rest_API_Stats class.
 */
class Stats {
	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
	}

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/get-stats/(?P<token>\S+)',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_stats' ],
					'permission_callback' => '__return_true',
					'args'                => [
						'token' => [
							'required'          => true,
							'validate_callback' => [ $this, 'validate_token' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Receive the data from the client.
	 *
	 * This method handles a REST request and returns a REST response.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response The REST response object containing the stats.
	 */
	public function get_stats( \WP_REST_Request $request ) {
		$data = $request->get_json_params();

		$data = [];

		// Get the number of pending updates.
		$data['pending_updates'] = \wp_get_update_data()['counts']['total'];

		// Get number of content from any public post-type, published in the past week.
		$data['weekly_posts'] = count(
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
		$data['activities'] = count(
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
		$badges = array_merge(
			\progress_planner()->get_badges()->get_badges( 'content' ),
			\progress_planner()->get_badges()->get_badges( 'maintenance' ),
			\progress_planner()->get_badges()->get_badges( 'monthly_flat' )
		);

		$data['badges'] = [];
		foreach ( $badges as $badge ) {
			$data['badges'][ $badge->get_id() ] = array_merge(
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

		return new \WP_REST_Response( $data );
	}

	/**
	 * Validate the token.
	 *
	 * @param string $token The token.
	 *
	 * @return bool
	 */
	public function validate_token( $token ) {
		$token = str_replace( 'token/', '', $token );
		if ( \progress_planner()->is_pro_site() && $token === \get_option( 'progress_planner_pro_license_key' ) ) {
			return true;
		}
		$license_key = \get_option( 'progress_planner_license_key', false );
		if ( ! $license_key || 'no-license' === $license_key ) {
			return false;
		}

		return $token === $license_key;
	}
}
