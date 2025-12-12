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
	 * @return array Array of lesson objects from remote API. Each lesson contains:
	 *               - name (string): Lesson title
	 *               - settings (array): Lesson configuration including 'id'
	 *               - Other lesson-specific fields from remote server
	 */
	public function get_items() {
		return $this->get_remote_api_items();
	}

	/**
	 * Get items from the remote API.
	 *
	 * Caching strategy:
	 * - Success: Cache for 1 week (WEEK_IN_SECONDS)
	 * - Errors: Cache empty array for 5 minutes to prevent API hammering
	 * - This prevents repeated failed requests while allowing eventual recovery
	 *
	 * Error handling:
	 * - WP_Error responses (network failures, timeouts)
	 * - Non-200 HTTP status codes (404, 500, etc)
	 * - Invalid JSON responses
	 * All errors return empty array and cache for 5 minutes
	 *
	 * @return array Array of lesson objects, or empty array on error. Each lesson contains:
	 *               - name (string): Lesson title
	 *               - settings (array): Configuration with 'id' and other properties
	 *               - Additional fields as provided by remote API
	 */
	public function get_remote_api_items() {
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/lessons';
		$url = \add_query_arg(
			[
				'site'        => \get_site_url(),
				'license_key' => \get_option( 'progress_planner_license_key' ),
			],
			$url
		);

		$cache_key = \md5( $url );

		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( \is_array( $cached ) ) {
			return $cached;
		}

		$response = \wp_remote_get( $url );

		// Handle network errors (timeouts, DNS failures, etc).
		if ( \is_wp_error( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		// Handle HTTP errors (404, 500, etc).
		if ( 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		// Parse and validate JSON response.
		$json = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( ! \is_array( $json ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		// Cache successful response for one week.
		\progress_planner()->get_utils__cache()->set( $cache_key, $json, WEEK_IN_SECONDS );

		return $json;
	}

	/**
	 * Get the lessons pagetypes for use in page type selection.
	 *
	 * Filters lessons based on site configuration:
	 * - If site shows posts on front ('show_on_front' = 'posts'), excludes homepage lesson
	 * - If site has static front page, includes all lessons including homepage
	 *
	 * @return array Array of pagetype options formatted for dropdown/select fields. Structure:
	 *               [
	 *                   [
	 *                       'label' => 'Homepage',          // Human-readable lesson name
	 *                       'value' => 'homepage'           // Lesson ID for storage
	 *                   ],
	 *                   [
	 *                       'label' => 'About Page',
	 *                       'value' => 'about'
	 *                   ],
	 *                   ...
	 *               ]
	 */
	public function get_lesson_pagetypes() {
		$lessons       = $this->get_items();
		$pagetypes     = [];
		$show_on_front = \get_option( 'show_on_front' );

		foreach ( $lessons as $lesson ) {
			// Remove the "homepage" lesson if the site doesn't show a static page as the frontpage.
			// Sites showing blog posts on front don't need homepage-specific lessons.
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
