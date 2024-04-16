<?php
/**
 * ProgressPlanner REST-API.
 *
 * Adds a REST-API endpoint to get stats, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/get-stats/token/<site-token>
 *
 * The token is generated and saved in the settings.
 *
 * @package ProgressPlanner
 */

namespace ProgressPlanner;

use ProgressPlanner\Badges;
use ProgressPlanner\Badges\Badge\Wonderful_Writer as Badge_Wonderful_Writer;
use ProgressPlanner\Badges\Badge\Awesome_Author as Badge_Awesome_Author;
use ProgressPlanner\Badges\Badge\Notorious_Novelist as Badge_Notorious_Novelist;
use ProgressPlanner\Badges\Badge\Progress_Professional as Badge_Progress_Professional;
use ProgressPlanner\Badges\Badge\Maintenance_Maniac as Badge_Maintenance_Maniac;
use ProgressPlanner\Badges\Badge\Super_Site_Specialist as Badge_Super_Site_Specialist;

/**
 * Rest_API class.
 */
class Rest_API {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
	}

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		register_rest_route(
			'progress-planner/v1',
			'/get-stats/(?P<token>\S+)',
			[
				[
					'methods'  => 'GET',
					'callback' => [ $this, 'get_stats' ],
					'args'     => [
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
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
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
			\progress_planner()->get_query()->query_activities(
				[
					'start_date' => new \DateTime( '-7 days' ),
				]
			)
		);

		// Get the badges.
		$data['badges'] = [
			'wonderful-writer'      => ( new Badge_Wonderful_Writer() )->progress_callback(),
			'awesome-author'        => ( new Badge_Awesome_Author() )->progress_callback(),
			'notorious-novelist'    => ( new Badge_Notorious_Novelist() )->progress_callback(),
			'progress-professional' => ( new Badge_Progress_Professional() )->progress_callback(),
			'maintenance-maniac'    => ( new Badge_Maintenance_Maniac() )->progress_callback(),
			'super-site-specialist' => ( new Badge_Super_Site_Specialist() )->progress_callback(),
		];

		$data['latest_badge'] = Badges::get_latest_completed_badge();

		// The website URL.
		$data['website'] = \home_url();

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

		return $token === Settings::get( 'license_key' );
	}
}
