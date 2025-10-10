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
					echo '<img src="' . \esc_url( $media['source_url'] ) . '" alt="Logo" style="height:100px;"/>';
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
	 * @return string
	 */
	public function get_admin_menu_icon(): string {
		$icon = 'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjggNTAwIj48cGF0aCBmaWxsPSIjMzgyOTZkIiBkPSJNMjE3LjQ2IDE3Mi45YzMuMjEuMTIgNS45NyAxLjc0IDcuNzMgNC4xNS0xLjg3LTEwLjI0LTEwLjY0LTE4LjE3LTIxLjQ4LTE4LjU2LTEyLjUyLS40NS0yMy4wMyA5LjMzLTIzLjQ4IDIxLjg1LS40NSAxMi41MiA5LjMzIDIzLjAzIDIxLjg1IDIzLjQ4IDkuNC4zNCAxNy42Ny01LjEgMjEuNC0xMy4xMy0xLjgzIDEuNTEtNC4xOCAyLjQyLTYuNzQgMi4zMy01LjU1LS4yLTkuODktNC44Ni05LjY5LTEwLjQxLjItNS41NSA0Ljg2LTkuODkgMTAuNDEtOS42OVpNMjQxLjUxIDMwNS44NGMuNTggMS45MiAxLjEzIDMuODYgMS43MyA1Ljc3IDE0LjA0IDQ0Ljk3IDMzLjk0IDg4Ljc1IDU2LjQyIDEyNC4yN2w2Ny43NS0xMzAuMDRoLTEyNS45Wk0yOTcuOTYgMjA1Ljk3YzEyLjEyLTQuNSAyMy41NC03LjE4IDMzLjY0LTguOTYtMjIuNTEtMjIuMjctNjEuMjQtMjcuMDYtNjEuNDctMjcuMDkgMS4yNyA2LjE3LjU4IDE1LjgtMi40NCAyNi40Ni0zLjMgMTEuNjYtOS4zOCAyNC41NC0xOC43IDM1LjQ4LTMuNDUgNC4wNi03LjM2IDcuODMtMTEuNzMgMTEuMTloLjA3di0uMDFjLjE2LjYyLjM4IDEuMi41OCAxLjc5IDIuNzQgOC4yNyA4LjYxIDEzLjc0IDE0LjkzIDE3LjE0IDYuNDggMy40OSAxMy4zNyA0LjgzIDE3LjY4IDQuODMgNi40IDAgMTEuODgtMy43OSAxNC40My05LjIyLjk3LTIuMDYgMS41NS00LjMzIDEuNTUtNi43NiAwLTMuODUtMS40Mi03LjM0LTMuNjktMTAuMS0xLjkyLTIuMzMtNC40Ni00LjA4LTcuMzktNS4wM2w0NC44Mi04LjY1Yy02LjYzLTYuMTItMTQuNzItMTEuNTktMjIuNzMtMTYuMjMtMS45Ny0xLjE0LTEuNjktNC4wNS40NS00Ljg0WiIvPjxwYXRoIGZpbGw9IiNmYWEzMTAiIGQ9Ik0yODEuMzcgNDU4LjM3Yy0yNS43OS0zOC44NC00OC42OC04OC4wNC02NC40NS0xMzguNTQtMS40NS00LjYzLTIuODMtOS4zMS00LjE3LTEzLjk5LTEuMTItMy45NC0yLjIyLTcuODgtMy4yNS0xMS44LTIuMDktNy45Mi05LjI4LTEzLjQ2LTE3LjQ4LTEzLjQ2aC0yNy45NWMtOC4yIDAtMTUuMzkgNS41My0xNy40OCAxMy40NS0yLjI4IDguNjUtNC43OCAxNy4zMi03LjQyIDI1Ljc5LTE1Ljc3IDUwLjUtMzguNjUgOTkuNy02NC40NSAxMzguNTQtNC4wMSA2LjAzLTEuNzggMTEuNjMtLjY0IDEzLjc2IDIuNCA0LjQ3IDYuODYgNy4xNCAxMS45NCA3LjE0aDY2LjAxbDMuOTcgNi45MmM0LjU0IDcuOSAxMi45OSAxMi44MSAyMi4wNSAxMi44MXMxNy41MS00LjkxIDIyLjA2LTEyLjgxbDMuOTgtNi45Mmg2NmMzLjIyIDAgNi4xOS0xLjA4IDguNTUtMy4wMiAxLjM1LTEuMTEgMi41MS0yLjQ5IDMuMzgtNC4xMy41Ny0xLjA3IDEuNDItMy4wMiAxLjYxLTUuNDYuMTktMi40MS0uMjYtNS4zMS0yLjI1LTguMzFaIi8+PHBhdGggZmlsbD0iIzM4Mjk2ZCIgZD0iTTI5NS43IDc2LjA2Yy03LjU0LTEyLjA1LTMyLjM4IDEtNTkuNTQgMi44Ni0xNS4wNCAxLjAzLTM3LjA1LTExMC42My03MS43Ny01Ni45OS0zOS41NiA2MS4xLTc5LjEyLTQ0LjY4LTg4LjY2LTE1LjgzLTIxLjExIDQzLjI3IDI1LjE1IDg0LjYxIDI1LjE1IDg0LjYxcy0xMi44NCA3LjkyLTIwLjYzIDEzLjkzYy01LjQ3IDQuMTctMTAuODIgOC42NS0xNi4wMyAxMy41MS0yMC40NSAxOS4wMy0zNi4wNCA0MC4zMi00Ni43NyA2My44NkM2LjcyIDIwNS41NSAxLjExIDIyOS41OS42MiAyNTQuMTVjLS40OSAyNC41NiA0LjAxIDQ5LjEgMTMuNTQgNzMuNjMgOS41MiAyNC41MyAyNC4xNyA0Ny40MiA0My45NSA2OC42OCA0LjAyIDQuMzIgOC4xMiA4LjQxIDEyLjMxIDEyLjMgNC4xLTYuMzEgNy45Ny0xMi43NCAxMS42NC0xOS4yNiA0LjM5LTcuOCA4LjUtMTUuNzIgMTIuMjUtMjMuNzgtLjMzLS4zNS0uNjYtLjY5LS45OS0xLjAzLS4xNy0uMTgtLjM0LS4zNS0uNTEtLjUzLTE1LjUzLTE2LjY5LTI3LjE3LTM0LjU5LTM0LjkzLTUzLjcyLTcuNzctMTkuMTMtMTEuNS0zOC4yNS0xMS4yLTU3LjM2LjI5LTE5LjEgNC40Ny0zNy42OCAxMi41My01NS43MiA4LjA2LTE4LjA1IDIwLjAyLTM0LjQ1IDM1LjktNDkuMjIgMTMuOTktMTMuMDIgMjguODQtMjIuODMgNDQuNTUtMjkuNDEgMTUuNy02LjU5IDMxLjYzLTkuOTggNDcuNzYtMTAuMTggOS4wNS0uMTEgMTkuMTEgMS4xNSAyOS41MSA0LjUgMTAuMzIgNC4yNyAxOS4yMiA5LjQ0IDI2LjYzIDE1LjM1IDEwLjE5IDguMTMgMTcuNjEgMTcuNjUgMjIuMjIgMjguMSAxLjkxIDQuMzIgMy4zNyA4LjggNC4zMiAxMy40MSAxNi4yNy0yOC4yNyAzNi43NS03NS45NiAyNS41Ny05My44M1oiLz48L3N2Zz4=';

		$admin_menu_icon_id = empty( $this->get_api_data() ) || empty( $this->get_api_data()['admin_menu_icon'] )
			? ''
			: $this->get_api_data()['admin_menu_icon'];

		if ( $admin_menu_icon_id ) {
			// Get the logo URL.
			$response = $this->get_remote_data( \progress_planner()->get_remote_server_root_url() . '/wp-json/wp/v2/media/' . $admin_menu_icon_id );
			if ( $response ) {
				$media = \json_decode( $response, true );
				if ( \is_array( $media ) && \array_key_exists( 'source_url', $media ) ) {
					// Get the content of the image.
					$content = $this->get_remote_data( $media['source_url'] );
					if ( $content ) {
						$icon = 'data:image/svg+xml;base64,' . \base64_encode( $content ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
					}
				}
			}
		}

		return $icon;
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
	 * Get the "Progress Planner" name.
	 *
	 * @return string
	 */
	public function get_progress_planner_name(): string {
		return empty( $this->get_api_data() ) || empty( $this->get_api_data()['progress_planner_name'] )
			? 'Progress Planner'
			: $this->get_api_data()['progress_planner_name'];
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
}
