<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Challenge class.
 */
final class Challenge extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'challenge';

	/**
	 * Get the feed from the blog.
	 *
	 * @return array
	 */
	public function get_challenge() {
		$cache_key = $this->get_cache_key();
		$feed_data = \progress_planner()->get_utils__cache()->get( $cache_key );

		// Transient not set.
		if ( false === $feed_data ) {
			$feed_data = [
				'feed'    => [],
				'expires' => 0,
			];
		}

		// Transient expired, fetch new feed.
		if ( $feed_data['expires'] < \time() ) {
			// Get the feed using the REST API.
			$response = \wp_remote_get( $this->get_remote_api_url() );

			if ( 200 !== \wp_remote_retrieve_response_code( $response ) ) {
				// If we cant fetch the feed, we will try again later.
				$feed_data['expires'] = \time() + 5 * MINUTE_IN_SECONDS;
			} else {
				$feed = \json_decode( \wp_remote_retrieve_body( $response ), true );

				$feed_data['feed']    = $feed;
				$feed_data['expires'] = \time() + 1 * DAY_IN_SECONDS;
				if ( empty( $feed ) ) {
					$feed_data['expires'] = \time() + 1 * HOUR_IN_SECONDS;
				}
			}

			// Transient uses 'expires' key to determine if it's expired.
			\progress_planner()->get_utils__cache()->set( $cache_key, $feed_data, 0 );
		}

		return $feed_data['feed'];
	}

	/**
	 * Render the widget.
	 *
	 * @return void
	 */
	public function render() {
		if ( empty( $this->get_challenge() ) ) {
			return;
		}
		parent::render();
	}

	/**
	 * Get the cache key.
	 *
	 * @return string
	 */
	public function get_cache_key() {
		return \md5( $this->get_remote_api_url() );
	}

	/**
	 * Get the remote-API URL.
	 *
	 * @return string
	 */
	public function get_remote_api_url() {
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/challenges';
		$url = \add_query_arg(
			[
				'license_key' => \get_option( 'progress_planner_license_key' ),
				'site'        => \get_site_url(),
			],
			$url
		);

		return $url;
	}
}
