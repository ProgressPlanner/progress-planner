<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Progress Planner main plugin class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Admin\Page as Admin_Page;
use Progress_Planner\Admin\Tour as Admin_Tour;
use Progress_Planner\Admin\Dashboard_Widget_Score as Admin_Dashboard_Widget_Score;
use Progress_Planner\Admin\Dashboard_Widget_Todo as Admin_Dashboard_Widget_Todo;
use Progress_Planner\Admin\Editor as Admin_Editor;
use Progress_Planner\Actions\Content as Actions_Content;
use Progress_Planner\Actions\Content_Scan as Actions_Content_Scan;
use Progress_Planner\Actions\Maintenance as Actions_Maintenance;
use Progress_Planner\Admin\Page_Settings as Admin_Page_Settings;
/**
 * Main plugin class.
 */
class Base {

	/**
	 * The target score.
	 *
	 * @var int
	 */
	const SCORE_TARGET = 200;

	/**
	 * An array of instantiated objects.
	 *
	 * @var array<string, object>
	 */
	private $cached = [];

	/**
	 * The plugin version.
	 *
	 * @var string
	 */
	private static $plugin_version;

	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! function_exists( 'current_user_can' ) ) {
			require_once ABSPATH . 'wp-includes/capabilities.php'; // @phpstan-ignore requireOnce.fileNotFound
		}
		if ( ! function_exists( 'wp_get_current_user' ) ) {
			require_once ABSPATH . 'wp-includes/pluggable.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		if ( defined( '\IS_PLAYGROUND_PREVIEW' ) && constant( '\IS_PLAYGROUND_PREVIEW' ) === true ) {
			new Playground();
		}

		// Basic classes.
		if ( \is_admin() && \current_user_can( 'edit_others_posts' ) ) {
			$this->cached['admin__page'] = new Admin_Page();
			$this->cached['admin__tour'] = new Admin_Tour();

			// Dont add the widget if the privacy policy is not accepted.
			if ( true === $this->is_privacy_policy_accepted() ) {
				$this->cached['admin__dashboard_widget_score'] = new Admin_Dashboard_Widget_Score();
				$this->cached['admin__dashboard_widget_todo']  = new Admin_Dashboard_Widget_Todo();
			}
		}
		$this->cached['admin__editor'] = new Admin_Editor();

		$this->cached['actions__content']      = new Actions_Content();
		$this->cached['actions__content_scan'] = new Actions_Content_Scan();
		$this->cached['actions__maintenance']  = new Actions_Maintenance();

		// REST API.
		$this->cached['rest_api_stats'] = new Rest_API_Stats();

		// Onboarding.
		$this->cached['onboard'] = new Onboard();

		// To-do.
		$this->cached['todo'] = new Todo();

		// Post-meta.
		if ( $this->is_pro_site() ) {
			$this->cached['page_todos'] = new Page_Todos();
		}

		\add_filter( 'plugin_action_links_' . plugin_basename( PROGRESS_PLANNER_FILE ), [ $this, 'add_action_links' ] );

		// We need to initialize some classes early.
		$this->cached['page_types']      = new Page_Types();
		$this->cached['settings']        = new Settings();
		$this->cached['suggested_tasks'] = new Suggested_Tasks();
		$this->cached['badges']          = new Badges();

		// Dont add the widget if the privacy policy is not accepted.
		if ( true === $this->is_privacy_policy_accepted() ) {
			$this->cached['settings_page'] = new Admin_Page_Settings();
		}
	}

	/**
	 * Magic method to get properties.
	 * We use this to avoid a lot of code duplication.
	 *
	 * Use a double underscore to separate namespaces:
	 * - get_foo() will return an instance of Progress_Planner\Foo.
	 * - get_foo_bar() will return an instance of Progress_Planner\Foo_Bar.
	 * - get_foo_bar__baz() will return an instance of Progress_Planner\Foo_Bar\Baz.
	 *
	 * @param string $name The name of the property.
	 * @param array  $arguments The arguments passed to the class constructor.
	 *
	 * @return mixed
	 */
	public function __call( $name, $arguments ) {
		if ( 0 !== strpos( $name, 'get_' ) ) {
			return;
		}
		$cache_name = substr( $name, 4 );
		if ( isset( $this->cached[ $cache_name ] ) ) {
			return $this->cached[ $cache_name ];
		}

		$class_name = implode( '\\', explode( '__', $cache_name ) );
		$class_name = 'Progress_Planner\\' . implode( '_', array_map( 'ucfirst', explode( '_', $class_name ) ) );
		if ( class_exists( $class_name ) ) {
			$this->cached[ $cache_name ] = new $class_name( $arguments );
			return $this->cached[ $cache_name ];
		}
	}

	/**
	 * Get the remote server root URL.
	 *
	 * @return string
	 */
	public function get_remote_server_root_url() {
		return defined( 'PROGRESS_PLANNER_REMOTE_SERVER_ROOT_URL' )
			? \PROGRESS_PLANNER_REMOTE_SERVER_ROOT_URL
			: 'https://progressplanner.com';
	}

	/**
	 * Get the placeholder SVG.
	 *
	 * @param int $width The width of the placeholder image.
	 * @param int $height The height of the placeholder image.
	 *
	 * @return string
	 */
	public function get_placeholder_svg( $width = 1200, $height = 675 ) {
		return 'data:image/svg+xml;base64,' . base64_encode( sprintf( '<svg width="%1$d" height="%2$d" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="%3$d" height="%4$d" style="fill:#F6F5FB;stroke:#534786;stroke-width:2"/><text x="50%%" y="50%%" font-size="20" text-anchor="middle" alignment-baseline="middle" font-family="monospace" fill="#534786">progressplanner.com</text></svg>', $width, $height, ( $width - 4 ), ( $height - 4 ) ) );
	}

	/**
	 * Get the activation date.
	 *
	 * @return \DateTime|false
	 */
	public function get_activation_date() {
		$activation_date = $this->get_settings()->get( 'activation_date' );
		if ( ! $activation_date ) {
			$activation_date = new \DateTime();
			$this->get_settings()->set( 'activation_date', $activation_date->format( 'Y-m-d' ) );
			return $activation_date;
		}
		return \DateTime::createFromFormat( 'Y-m-d', $activation_date );
	}

	/**
	 * Check if the privacy policy is accepted.
	 *
	 * @return bool
	 */
	public function is_privacy_policy_accepted() {
		return false !== get_option( 'progress_planner_license_key', false );
	}

	/**
	 * Add action link to dashboard page.
	 *
	 * @param array $actions Existing actions.
	 *
	 * @return array
	 */
	public function add_action_links( $actions ) {
		$action_link = [ '<a href="' . admin_url( 'admin.php?page=progress-planner' ) . '">' . __( 'Dashboard', 'progress-planner' ), '</a>' ];
		$actions     = array_merge( $action_link, $actions );
		return $actions;
	}

	/**
	 * Include a template.
	 *
	 * @param string|array $template The template to include.
	 *                               If an array, go through each item until the template exists.
	 * @param array        $args   The arguments to pass to the template.
	 * @return void
	 */
	public function the_view( $template, $args = [] ) {
		$templates = ( is_string( $template ) )
			? [ $template, "/views/{$template}" ]
			: $template;
		$this->the_file( $templates, $args );
	}

	/**
	 * Include an asset.
	 *
	 * @param string|array $asset The asset to include.
	 *                            If an array, go through each item until the asset exists.
	 * @param array        $args  The arguments to pass to the template.
	 *
	 * @return void
	 */
	public function the_asset( $asset, $args = [] ) {
		$assets = ( is_string( $asset ) )
			? [ $asset, "/assets/{$asset}" ]
			: $asset;
		$this->the_file( $assets, $args );
	}

	/**
	 * Get an asset.
	 *
	 * @param string|array $asset The asset to include.
	 *                            If an array, go through each item until the asset exists.
	 * @param array        $args  The arguments to pass to the template.
	 *
	 * @return string|false
	 */
	public function get_asset( $asset, $args = [] ) {
		ob_start();
		$assets = ( is_string( $asset ) )
			? [ $asset, "/assets/{$asset}" ]
			: $asset;
		$this->the_file( $assets, $args );
		return ob_get_clean();
	}

	/**
	 * Include a file.
	 *
	 * @param string|array $files The file to include.
	 *                           If an array, go through each item until the file exists.
	 * @param array        $args  The arguments to pass to the template.
	 * @return void
	 */
	public function the_file( $files, $args = [] ) {
		/**
		 * Allow filtering the files to include.
		 *
		 * @param array $files The files to include.
		 */
		$files = (array) $files;
		foreach ( $files as $file ) {
			$path = $file;
			if ( ! \file_exists( $path ) ) {
				$path = \PROGRESS_PLANNER_DIR . "/{$file}";
			}
			if ( \file_exists( $path ) ) {
				extract( $args ); // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
				include $path; // phpcs:ignore PEAR.Files.IncludingFile.UseRequire
				break;
			}
		}
	}

	/**
	 * Get the version of a file.
	 *
	 * @param string $file The file path.
	 * @return string
	 */
	public function get_file_version( $file ) {
		// If we're in debug mode, use filemtime.
		if ( defined( 'WP_SCRIPT_DEBUG' ) && \WP_SCRIPT_DEBUG ) {
			return (string) filemtime( $file );
		}

		// Otherwise, use the plugin header.
		if ( ! function_exists( 'get_file_data' ) ) {
			require_once ABSPATH . 'wp-includes/functions.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		if ( ! self::$plugin_version ) {
			self::$plugin_version = \get_file_data( PROGRESS_PLANNER_FILE, [ 'Version' => 'Version' ] )['Version'];
		}

		return self::$plugin_version;
	}

	/**
	 * Check if the site is considered a local one.
	 *
	 * This method is inspired by the `is_local_url` function from the
	 * EDD - Software Licensing plugin.
	 *
	 * @return boolean If we're considering the site local or not.
	 */
	public function is_local_site() {
		$url       = \get_home_url();
		$url_parts = \wp_parse_url( $url );
		$host      = ! empty( $url_parts['host'] ) ? $url_parts['host'] : false;

		if ( ! empty( $url ) && ! empty( $host ) ) {
			if (
				'localhost' === $host
				|| (
					false !== \ip2long( $host )
					&& ! \filter_var( $host, \FILTER_VALIDATE_IP, \FILTER_FLAG_NO_PRIV_RANGE | \FILTER_FLAG_NO_RES_RANGE )
				)
			) {
				return true;
			}

			foreach ( [ '.local', '.test' ] as $tld ) {
				if ( false !== \strpos( $host, $tld ) ) {
					return true;
				}
			}

			if ( \substr_count( $host, '.' ) > 1 ) {
				$subdomains_to_check = [
					'dev.',
					'*.staging.',
					'*.test.',
					'staging-*.',
					'*.wpengine.com',
					'*.instawp.xyz',
					'*.cloudwaysapps.com',
					'*.flywheelsites.com',
					'*.flywheelstaging.com',
					'*.myftpupload.com',
					'*.kinsta.cloud',
				];

				foreach ( $subdomains_to_check as $subdomain ) {
					$subdomain = \str_replace( '.', '(.)', $subdomain );
					$subdomain = \str_replace( [ '*', '(.)' ], '(.*)', $subdomain );

					if ( \preg_match( '/^(' . $subdomain . ')/', $host ) ) {
						return true;
					}
				}
			}

			// Some Hosting providers do subdirectory staging sites.
			if ( \preg_match( '/\/staging\/\d{3,}/', $url ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if this is a PRO site.
	 *
	 * @return bool
	 */
	public function is_pro_site() {
		return \get_option( 'progress_planner_pro_license_key' )
			&& 'valid' === \get_option( 'progress_planner_pro_license_status' );
	}
}
// phpcs:enable Generic.Commenting.Todo
