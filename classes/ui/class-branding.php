<?php
/**
 * Class for branding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\UI;

/**
 * Class for branding.
 */
final class Branding {

	/**
	 * Default branding post-ID.
	 *
	 * @var array<string, int>
	 */
	const BRANDING_IDS = [
		'default' => 0,
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_filter( 'progress_planner_admin_widgets', [ $this, 'filter_widgets' ] );
	}

	/**
	 * Get the branding ID.
	 *
	 * @return int
	 */
	public function get_branding_id(): int {
		// Check for placeholder demo cookie.
		if ( \defined( '\IS_PLAYGROUND_PREVIEW' )
			&& \constant( '\IS_PLAYGROUND_PREVIEW' ) === true
			&& isset( $_COOKIE['prpl_placeholder_demo'] )
			&& '1' === $_COOKIE['prpl_placeholder_demo']
		) {
			return 5938;
		}

		// Get branding ID depending on the host, agency etc.
		if ( \defined( 'PROGRESS_PLANNER_BRANDING_ID' ) ) {
			return \constant( 'PROGRESS_PLANNER_BRANDING_ID' );
		}
		if ( isset( $_GET['pp_branding_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return (int) $_GET['pp_branding_id']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}

		$hostname = (string) \gethostname();
		if ( \str_contains( $hostname, 'siteground' ) ) {
			$hostname = 'siteground';
		} elseif ( \str_contains( $hostname, 'wpengine' ) ) {
			$hostname = 'wpengine';
		} elseif ( \str_contains( $hostname, 'bluehost' ) ) {
			$hostname = 'bluehost';
		} elseif ( \str_contains( $hostname, 'godaddy' ) ) {
			$hostname = 'godaddy';
		}

		return isset( self::BRANDING_IDS[ $hostname ] )
			? self::BRANDING_IDS[ $hostname ]
			: self::BRANDING_IDS['default'];
	}

	/**
	 * Get the api data.
	 *
	 * @return array
	 */
	public function get_api_data(): array {
		if ( 0 === $this->get_branding_id() ) {
			return [];
		}

		$response = $this->get_remote_data(
			\progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/pp-branding/' . $this->get_branding_id()
		);
		if ( ! $response ) {
			return [];
		}

		return \is_array( $response ) ? $response : \json_decode( $response, true );
	}

	/**
	 * Print the logo.
	 *
	 * @return void
	 */
	public function the_logo(): void {
		// Get the logo ID from the API data.
		if ( ! empty( $this->get_api_data() )
			&& isset( $this->get_api_data()['logo'] )
			&& ! empty( $this->get_api_data()['logo'] )
		) {
			$logo_id = $this->get_api_data()['logo'];
			// Get the logo URL.
			$response = $this->get_remote_data( \progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/media/' . $logo_id );
			if ( $response ) {
				$media = \json_decode( $response, true );
				if ( isset( $media['source_url'] ) ) {
					echo '<img src="' . \esc_url( $media['source_url'] ) . '" alt="Logo"/>';
					return;
				}
			}
		}

		\progress_planner()->the_asset( 'images/logo_progress_planner.svg' );
	}

	/**
	 * Get the custom CSS.
	 *
	 * @return string
	 */
	public function get_custom_css(): string {
		return empty( $this->get_api_data() ) || empty( $this->get_api_data()['custom_css'] )
			? ''
			: $this->get_api_data()['custom_css'];
	}

	/**
	 * Get the admin-menu icon.
	 *
	 * @param bool $raw Whether to return raw SVG markup (true) or base64 data URI (false).
	 *
	 * @return string SVG markup or base64-encoded data URI.
	 */
	public function get_admin_menu_icon( bool $raw = false ): string {
		$admin_menu_icon_id = empty( $this->get_api_data() ) || empty( $this->get_api_data()['admin_menu_icon'] )
			? ''
			: $this->get_api_data()['admin_menu_icon'];

		// Default SVG with brand colors (purple #38296d and orange #faa310).
		$svg = '<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368 500"><path fill="#38296d" d="M217.46 172.9c3.21.12 5.97 1.74 7.73 4.15-1.87-10.24-10.64-18.17-21.48-18.56-12.52-.45-23.03 9.33-23.48 21.85-.45 12.52 9.33 23.03 21.85 23.48 9.4.34 17.67-5.1 21.4-13.13-1.83 1.51-4.18 2.42-6.74 2.33-5.55-.2-9.89-4.86-9.69-10.41.2-5.55 4.86-9.89 10.41-9.69ZM241.51 305.84c.58 1.92 1.13 3.86 1.73 5.77 14.04 44.97 33.94 88.75 56.42 124.27l67.75-130.04h-125.9ZM297.96 205.97c12.12-4.5 23.54-7.18 33.64-8.96-22.51-22.27-61.24-27.06-61.47-27.09 1.27 6.17.58 15.8-2.44 26.46-3.3 11.66-9.38 24.54-18.7 35.48-3.45 4.06-7.36 7.83-11.73 11.19h.07v-.01c.16.62.38 1.2.58 1.79 2.74 8.27 8.61 13.74 14.93 17.14 6.48 3.49 13.37 4.83 17.68 4.83 6.4 0 11.88-3.79 14.43-9.22.97-2.06 1.55-4.33 1.55-6.76 0-3.85-1.42-7.34-3.69-10.1-1.92-2.33-4.46-4.08-7.39-5.03l44.82-8.65c-6.63-6.12-14.72-11.59-22.73-16.23-1.97-1.14-1.69-4.05.45-4.84Z"/><path fill="#faa310" d="M281.37 458.37c-25.79-38.84-48.68-88.04-64.45-138.54-1.45-4.63-2.83-9.31-4.17-13.99-1.12-3.94-2.22-7.88-3.25-11.8-2.09-7.92-9.28-13.46-17.48-13.46h-27.95c-8.2 0-15.39 5.53-17.48 13.45-2.28 8.65-4.78 17.32-7.42 25.79-15.77 50.5-38.65 99.7-64.45 138.54-4.01 6.03-1.78 11.63-.64 13.76 2.4 4.47 6.86 7.14 11.94 7.14h66.01l3.97 6.92c4.54 7.9 12.99 12.81 22.05 12.81s17.51-4.91 22.06-12.81l3.98-6.92h66c3.22 0 6.19-1.08 8.55-3.02 1.35-1.11 2.51-2.49 3.38-4.13.57-1.07 1.42-3.02 1.61-5.46.19-2.41-.26-5.31-2.25-8.31Z"/><path fill="#38296d" d="M295.7 76.06c-7.54-12.05-32.38 1-59.54 2.86-15.04 1.03-37.05-110.63-71.77-56.99-39.56 61.1-79.12-44.68-88.66-15.83-21.11 43.27 25.15 84.61 25.15 84.61s-12.84 7.92-20.63 13.93c-5.47 4.17-10.82 8.65-16.03 13.51-20.45 19.03-36.04 40.32-46.77 63.86C6.72 205.55 1.11 229.59.62 254.15c-.49 24.56 4.01 49.1 13.54 73.63 9.52 24.53 24.17 47.42 43.95 68.68 4.02 4.32 8.12 8.41 12.31 12.3 4.1-6.31 7.97-12.74 11.64-19.26 4.39-7.8 8.5-15.72 12.25-23.78-.33-.35-.66-.69-.99-1.03-.17-.18-.34-.35-.51-.53-15.53-16.69-27.17-34.59-34.93-53.72-7.77-19.13-11.5-38.25-11.2-57.36.29-19.1 4.47-37.68 12.53-55.72 8.06-18.05 20.02-34.45 35.9-49.22 13.99-13.02 28.84-22.83 44.55-29.41 15.7-6.59 31.63-9.98 47.76-10.18 9.05-.11 19.11 1.15 29.51 4.5 10.32 4.27 19.22 9.44 26.63 15.35 10.19 8.13 17.61 17.65 22.22 28.1 1.91 4.32 3.37 8.8 4.32 13.41 16.27-28.27 36.75-75.96 25.57-93.83Z"/></svg>';

		if ( $admin_menu_icon_id ) {
			// Get the icon URL from the API.
			$response = $this->get_remote_data( \progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/media/' . $admin_menu_icon_id );
			if ( $response ) {
				$media = \json_decode( $response, true );
				if ( \is_array( $media ) && \array_key_exists( 'source_url', $media ) ) {
					// Get the content of the SVG.
					$content = $this->get_remote_data( $media['source_url'] );
					if ( $content ) {
						$svg = $content;
					}
				}
			}
		}

		if ( $raw ) {
			return $svg;
		}

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		return 'data:image/svg+xml;base64,' . \base64_encode( $svg );
	}

	/**
	 * Get the admin-menu name.
	 *
	 * @return string
	 */
	public function get_admin_menu_name(): string {
		return empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['admin_menu_name'] )
			? 'Progress Planner'
			: $this->get_api_data()['admin_menu_name'];
	}

	/**
	 * Get the admin-submenu name.
	 *
	 * @return string
	 */
	public function get_admin_submenu_name(): string {
		return empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['admin_submenu_name'] )
			? $this->get_admin_menu_name()
			: $this->get_api_data()['admin_submenu_name'];
	}

	/**
	 * Get the admin-submenu position.
	 *
	 * @return int|null
	 */
	public function get_admin_submenu_position(): mixed {
		if ( $this->get_branding_id() !== 0 && $this->get_branding_id() !== 4958 ) {
			return -1000;
		}

		return null;
	}

	/**
	 * Get the Ravi name.
	 *
	 * @return string
	 */
	public function get_ravi_name(): string {
		return empty( $this->get_api_data() ) || empty( $this->get_api_data()['ravis_name'] )
			? 'Ravi'
			: $this->get_api_data()['ravis_name'];
	}

	/**
	 * Get data from a remote URL, cached.
	 *
	 * @param string $url The URL to get the data from.
	 * @return mixed
	 */
	public function get_remote_data( $url ) {
		$cache_key = \md5( $url );
		$cached    = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( $cached ) {
			return $cached;
		}

		$response = \wp_remote_get( $url );
		if ( \is_wp_error( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return false;
		}

		if ( 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return false;
		}

		$body = \wp_remote_retrieve_body( $response );

		\progress_planner()->get_utils__cache()->set( $cache_key, $body, WEEK_IN_SECONDS );

		return $body;
	}

	/**
	 * Filter the widgets to be displayed on the admin page.
	 *
	 * @param array<\Progress_Planner\Admin\Widgets\Widget> $widgets The widgets.
	 *
	 * @return array<\Progress_Planner\Admin\Widgets\Widget>
	 */
	public function filter_widgets( $widgets ) {
		if ( empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['papers'] ) ) {
			return $widgets;
		}

		$show_papers = $this->get_api_data()['papers'];
		if ( ! $show_papers ) {
			return $widgets;
		}

		return \array_filter( $widgets, fn( $widget ) => \in_array( $widget->get_id(), $show_papers, true ) );
	}

	/**
	 * Get the widget title.
	 *
	 * @param string $widget_id     The widget ID.
	 * @param string $default_value The default value.
	 *
	 * @return string
	 */
	public function get_widget_title( $widget_id, $default_value = '' ) {
		if ( empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['widget_titles'] ) ) {
			return $default_value;
		}

		foreach ( $this->get_api_data()['widget_titles'] as $widget ) {
			if ( $widget['widget_id'] === $widget_id && isset( $widget['title'] ) ) {
				return $widget['title'];
			}
		}

		return $default_value;
	}

	/**
	 * Get the blog-feed URL.
	 *
	 * @return string
	 */
	public function get_blog_feed_url(): string {
		return empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['blog_feed_url'] )
			? \progress_planner()->get_remote_server_root_url()
			: $this->get_api_data()['blog_feed_url'];
	}

	/**
	 * Get a URL from the API data.
	 *
	 * @param string $default_url The default value.
	 *
	 * @return string
	 */
	public function get_url( $default_url = '' ) {
		$api_data = $this->get_api_data();
		if ( empty( $api_data ) || ! isset( $api_data['links'] ) ) {
			return $default_url;
		}

		foreach ( $api_data['links'] as $link ) {
			if ( $link['original_url'] === $default_url ) {
				return $link['url'];
			}
		}

		return $default_url;
	}

	/**
	 * Get the recommended SEO plugin slug.
	 *
	 * @return string
	 */
	public function get_seo_plugin_recommendation_slug(): string {
		return empty( $this->get_api_data() ) || ! isset( $this->get_api_data()['seo_plugin_recommendation_slug'] )
			? 'wordpress-seo'
			: $this->get_api_data()['seo_plugin_recommendation_slug'];
	}

	/**
	 * Export a kit-compatible {@see \ProgressPlanner\AdminUI\Branding} VO
	 * populated with the currently-resolved SaaS values.
	 *
	 * Kit code (the wp-admin-ui package) takes a plain Branding VO and does
	 * no remote calls of its own — this method is the handoff point.
	 */
	public function to_kit_branding(): \ProgressPlanner\AdminUI\Branding {
		\ob_start();
		$this->the_logo();
		$logo_html = (string) \ob_get_clean();

		return new \ProgressPlanner\AdminUI\Branding(
			$this->get_admin_menu_name(),
			$this->get_admin_submenu_name(),
			$this->get_admin_menu_icon( true ),
			$logo_html,
			'#dd324f', // --prpl-color-button-primary (kit default; SaaS doesn't currently override).
			null,
			'#ffffff',
			'#38296d', // --prpl-color-headings.
			'#faa310', // --prpl-background-monthly.
			$this->get_custom_css()
		);
	}
}
