<?php
/**
 * Lessons class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Get the lessons from a remote server.
 *
 * @package Progress_Planner
 */
class Lessons {

	/**
	 * The ID for this API object.
	 *
	 * @var string
	 */
	protected $id = 'lessons';

	/**
	 * Get the items.
	 *
	 * @return array
	 */
	public function get_items() {
		return $this->get_remote_api_items();
	}

	/**
	 * Get items from the remote API.
	 *
	 * @return array
	 */
	public function get_remote_api_items() {
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/lessons';
		$url = ( \progress_planner()->is_pro_site() )
			? \add_query_arg(
				[
					'site'        => \get_site_url(),
					'license_key' => \get_option( 'progress_planner_pro_license_key' ),
				],
				$url
			)
			: \add_query_arg( [ 'site' => \get_site_url() ], $url );

		$cache_key = \md5( $url );

		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( \is_array( $cached ) ) {
			return $cached;
		}

		$response = \wp_remote_get( $url );

		if ( \is_wp_error( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		if ( 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		$json = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( ! \is_array( $json ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		\progress_planner()->get_utils__cache()->set( $cache_key, $json, WEEK_IN_SECONDS );

		return $json;
	}

	/**
	 * Get the lessons pagetypes.
	 *
	 * @return array
	 */
	public function get_lesson_pagetypes() {
		$lessons       = $this->get_items();
		$pagetypes     = [];
		$show_on_front = \get_option( 'show_on_front' );

		foreach ( $lessons as $lesson ) {
			// Remove the "homepage" lesson if the site doesn't show a static page as the frontpage.
			if ( 'posts' === $show_on_front && 'homepage' === $lesson['settings']['id'] ) {
				continue;
			}
			$pagetypes[] = [
				'label' => $lesson['name'],
				'value' => $lesson['settings']['id'],
			];
		}
		return $pagetypes;
	}
}
