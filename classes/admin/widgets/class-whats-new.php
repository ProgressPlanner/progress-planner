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
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'whats-new';

	/**
	 * Enqueue scripts for the widget.
	 *
	 * @return void
	 */
	/**
	 * Get widget configuration.
	 *
	 * @return array Widget configuration.
	 */
	public function get_widget_config() {
		// Get widget title (may be custom branded or default).
		$widget_title = \progress_planner()->get_ui__branding()->get_widget_title(
			'whats-new',
			\esc_html__( 'What\'s new on the Progress Planner blog', 'progress-planner' )
		);

		return [
			'title' => $widget_title,
		];
	}

	/**
	 * Get the feed from the blog.
	 *
	 * @return array
	 */
	public function get_blog_feed() {
		$feed_data = \progress_planner()->get_utils__cache()->get( $this->get_cache_key() );

		// Migrate old feed to new format.
		if ( \is_array( $feed_data ) && ! isset( $feed_data['expires'] ) && ! isset( $feed_data['feed'] ) ) {
			$feed_data = [
				'feed'    => $feed_data,
				'expires' => \get_option( '_transient_timeout_' . Cache::CACHE_PREFIX . $this->get_cache_key(), 0 ),
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
			// Get the feed URL - append /feed/ if not already present.
			$feed_url = \progress_planner()->get_ui__branding()->get_blog_feed_url();
			if ( ! \str_contains( $feed_url, '/feed' ) && ! \str_ends_with( $feed_url, '.rss' ) ) {
				$feed_url = \trailingslashit( $feed_url ) . 'feed/';
			}

			// Fetch the RSS feed using WordPress's built-in function.
			$rss = \fetch_feed( $feed_url );

			if ( \is_wp_error( $rss ) ) {
				// If we can't fetch the feed, we will try again later.
				$feed_data['expires'] = \time() + 5 * MINUTE_IN_SECONDS;
			} else {
				$feed      = [];
				$max_items = $rss->get_item_quantity( 2 );
				$rss_items = $rss->get_items( 0, $max_items );

				foreach ( $rss_items as $item ) {
					$post = $this->parse_rss_item( $item );
					if ( $post ) {
						$feed[] = $post;
					}
				}

				$feed_data['feed']    = $feed;
				$feed_data['expires'] = \time() + 1 * DAY_IN_SECONDS;
			}

			// Transient uses 'expires' key to determine if it's expired.
			\progress_planner()->get_utils__cache()->set( $this->get_cache_key(), $feed_data, 0 );
		}

		return $feed_data['feed'];
	}

	/**
	 * Parse an RSS feed item and convert it to the expected format.
	 *
	 * @param \SimplePie\Item|null $item The RSS feed item.
	 * @return array|null The parsed item data or null if parsing fails.
	 */
	private function parse_rss_item( $item ) {
		if ( ! $item ) {
			return null;
		}

		$post = [
			'title'          => [
				'rendered' => $item->get_title(),
			],
			'link'           => $item->get_permalink(),
			'date'           => $item->get_date( 'c' ),
			'excerpt'        => [
				'rendered' => $item->get_description(),
			],
			'content'        => [
				'rendered' => $item->get_content(),
			],
			'featured_media' => null,
		];

		// Try to extract featured image from various sources.
		$featured_image_url = $this->extract_featured_image( $item );

		if ( $featured_image_url ) {
			$post['featured_media'] = [
				'source_url'    => $featured_image_url,
				'media_details' => [
					'sizes' => [
						'medium'       => [
							'source_url' => $featured_image_url,
						],
						'medium_large' => [
							'source_url' => $featured_image_url,
						],
					],
				],
			];
		}

		return $post;
	}

	/**
	 * Extract featured image URL from an RSS feed item.
	 *
	 * @param \SimplePie\Item $item The RSS feed item.
	 * @return string|null The featured image URL or null if not found.
	 */
	private function extract_featured_image( $item ) {
		// Method 1: Try media:thumbnail namespace.
		$media_thumbnail = $item->get_item_tags( 'http://search.yahoo.com/mrss/', 'thumbnail' );
		if ( $media_thumbnail && isset( $media_thumbnail[0]['attribs']['']['url'] ) ) {
			return $media_thumbnail[0]['attribs']['']['url'];
		}

		// Method 2: Try media:content.
		$media_content = $item->get_item_tags( 'http://search.yahoo.com/mrss/', 'content' );
		if ( $media_content && isset( $media_content[0]['attribs']['']['url'] ) ) {
			return $media_content[0]['attribs']['']['url'];
		}

		// Method 3: Try enclosure.
		$enclosure = $item->get_enclosure();
		if ( $enclosure ) {
			if ( $enclosure->get_thumbnail() ) {
				return $enclosure->get_thumbnail();
			}
			if ( $enclosure->get_link() && \str_contains( $enclosure->get_type(), 'image' ) ) {
				return $enclosure->get_link();
			}
		}

		// Method 4: Try to extract from description HTML (prioritize featured images).
		$description = $item->get_description();
		if ( $description ) {
			$image_url = $this->extract_image_from_html( $description, true );
			if ( $image_url ) {
				return $image_url;
			}
		}

		// Method 5: Try to extract from content HTML (prioritize featured images).
		$content = $item->get_content();
		if ( $content ) {
			$image_url = $this->extract_image_from_html( $content, true );
			if ( $image_url ) {
				return $image_url;
			}
		}

		// Method 6: Try to get from REST API as fallback if feed is from a WordPress site.
		$permalink = $item->get_permalink();
		if ( $permalink && \str_contains( $permalink, \progress_planner()->get_ui__branding()->get_blog_feed_url() ) ) {
			$rest_api_image = $this->get_featured_image_from_rest_api( $permalink );
			if ( $rest_api_image ) {
				return $rest_api_image;
			}
		}

		// Method 7: Try to extract ANY image from content as last resort.
		if ( $content ) {
			$image_url = $this->extract_image_from_html( $content, false );
			if ( $image_url ) {
				return $image_url;
			}
		}

		// Method 8: Try to extract ANY image from description as last resort.
		if ( $description ) {
			$image_url = $this->extract_image_from_html( $description, false );
			if ( $image_url ) {
				return $image_url;
			}
		}

		return null;
	}

	/**
	 * Extract image URL from HTML content.
	 *
	 * Checks for various HTML elements and attributes that can contain images:
	 * - <img> tags (src, srcset, data-src)
	 * - <picture> elements (source tags and img fallback)
	 * - <figure> elements
	 * - Background images in style attributes
	 *
	 * @param string $html                The HTML content to parse.
	 * @param bool   $prioritize_featured Whether to prioritize featured images (wp-post-thumbnail, wp-post-image).
	 * @return string|null The first image URL found, or null if none found.
	 */
	private function extract_image_from_html( $html, $prioritize_featured = false ) {
		if ( empty( $html ) ) {
			return null;
		}

		// If prioritizing featured images, check for WordPress featured image classes first.
		if ( $prioritize_featured ) {
			// Check for wp-post-thumbnail or wp-post-image class.
			if ( \preg_match( '/<img[^>]+class=["\'][^"\']*(?:wp-post-thumbnail|wp-post-image)[^"\']*["\'][^>]+src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches ) ) {
				return $matches[1];
			}
			if ( \preg_match( '/<img[^>]+src=["\']([^"\']+)["\'][^>]+class=["\'][^"\']*(?:wp-post-thumbnail|wp-post-image)[^"\']*["\'][^>]*>/i', $html, $matches ) ) {
				return $matches[1];
			}
		}

		// Check for <picture> element with <source> tags.
		if ( \preg_match( '/<picture[^>]*>.*?<source[^>]+srcset=["\']([^"\'\s]+)[^"\']*["\'][^>]*>.*?<\/picture>/is', $html, $matches ) ) {
			// Extract first URL from srcset (may contain multiple URLs with sizes).
			$srcset = $matches[1];
			if ( \preg_match( '/^([^\s]+)/', $srcset, $url_match ) ) {
				return $url_match[1];
			}
		}

		// Check for <img> with srcset attribute (responsive images).
		if ( \preg_match( '/<img[^>]+srcset=["\']([^"\'\s]+)[^"\']*["\'][^>]*>/i', $html, $matches ) ) {
			// Extract first URL from srcset.
			$srcset = $matches[1];
			if ( \preg_match( '/^([^\s]+)/', $srcset, $url_match ) ) {
				return $url_match[1];
			}
		}

		// Check for lazy-loaded images (data-src).
		if ( \preg_match( '/<img[^>]+data-src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches ) ) {
			return $matches[1];
		}

		// Check for standard <img> src.
		if ( \preg_match( '/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches ) ) {
			return $matches[1];
		}

		// Check for background images in style attributes.
		if ( \preg_match( '/style=["\'][^"\']*background-image\s*:\s*url\(["\']?([^"\')]+)["\']?\)[^"\']*["\'][^>]*>/i', $html, $matches ) ) {
			return $matches[1];
		}

		// Check for <figure> with nested img.
		if ( \preg_match( '/<figure[^>]*>.*?<img[^>]+src=["\']([^"\']+)["\'][^>]*>.*?<\/figure>/is', $html, $matches ) ) {
			return $matches[1];
		}

		return null;
	}

	/**
	 * Get featured image from WordPress REST API using post permalink.
	 *
	 * @param string $permalink The post permalink.
	 * @return string|null The featured image URL or null if not found.
	 */
	private function get_featured_image_from_rest_api( $permalink ) {
		// Extract post slug from permalink.
		$slug = \basename( \untrailingslashit( $permalink ) );
		if ( ! $slug ) {
			return null;
		}

		// Try to get post data from REST API.
		$api_url  = \trailingslashit( \progress_planner()->get_ui__branding()->get_blog_feed_url() ) . 'wp-json/wp/v2/posts?slug=' . $slug;
		$response = \wp_remote_get( $api_url );

		if ( \is_wp_error( $response ) || 200 !== \wp_remote_retrieve_response_code( $response ) ) {
			return null;
		}

		$posts = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( empty( $posts ) || ! isset( $posts[0]['featured_media'] ) || ! $posts[0]['featured_media'] ) {
			return null;
		}

		// Get the featured media.
		$media_id       = $posts[0]['featured_media'];
		$media_response = \wp_remote_get(
			\trailingslashit( \progress_planner()->get_ui__branding()->get_blog_feed_url() ) . 'wp-json/wp/v2/media/' . $media_id
		);

		if ( \is_wp_error( $media_response ) || 200 !== \wp_remote_retrieve_response_code( $media_response ) ) {
			return null;
		}

		$media = \json_decode( \wp_remote_retrieve_body( $media_response ), true );
		if ( isset( $media['media_details']['sizes']['medium_large']['source_url'] ) ) {
			return $media['media_details']['sizes']['medium_large']['source_url'];
		}

		if ( isset( $media['source_url'] ) ) {
			return $media['source_url'];
		}

		return null;
	}

	/**
	 * Get the cache key.
	 *
	 * @return string
	 */
	public function get_cache_key() {
		return 'blog_feed_' . \md5( \progress_planner()->get_ui__branding()->get_blog_feed_url() );
	}
}
