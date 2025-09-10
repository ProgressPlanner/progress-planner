<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use Progress_Planner\Utils\Cache;

/**
 * Whats_New class.
 */
final class Whats_New extends Widget {

	/**
	 * The cache key.
	 *
	 * @var string
	 */
	const CACHE_KEY = 'blog_feed';

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'whats-new';

	/**
	 * Get the feed from the blog.
	 *
	 * @return array
	 */
	public function get_blog_feed() {
		$feed_data = \progress_planner()->get_utils__cache()->get( self::CACHE_KEY );

		// Migrate old feed to new format.
		if ( \is_array( $feed_data ) && ! isset( $feed_data['expires'] ) && ! isset( $feed_data['feed'] ) ) {
			$feed_data = [
				'feed'    => $feed_data,
				'expires' => \get_option( '_transient_timeout_' . Cache::CACHE_PREFIX . self::CACHE_KEY, 0 ),
			];
		}

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
			$response = \wp_remote_get( \progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/posts/?per_page=2' );

			if ( 200 !== \wp_remote_retrieve_response_code( $response ) ) {
				// If we cant fetch the feed, we will try again later.
				$feed_data['expires'] = \time() + 5 * MINUTE_IN_SECONDS;
			} else {
				$feed = \json_decode( \wp_remote_retrieve_body( $response ), true );

				foreach ( $feed as $key => $post ) {
					// Get the featured media.
					$featured_media_id = $post['featured_media'];
					if ( $featured_media_id ) {
						$response = \wp_remote_get( \progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/media/' . $featured_media_id );
						if ( ! \is_wp_error( $response ) ) {
							$media = \json_decode( \wp_remote_retrieve_body( $response ), true );

							$post['featured_media'] = $media;
						}
					}
					$feed[ $key ] = $post;
				}

				$feed_data['feed']    = $feed;
				$feed_data['expires'] = \time() + 1 * DAY_IN_SECONDS;
			}

			// Transient uses 'expires' key to determine if it's expired.
			\progress_planner()->get_utils__cache()->set( self::CACHE_KEY, $feed_data, 0 );
		}

		return $feed_data['feed'];
	}
}
