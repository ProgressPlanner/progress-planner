<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Progress Planner main plugin class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Main plugin class.
 *
 * @method \Progress_Planner\Suggested_Tasks get_suggested_tasks()
 * @method \Progress_Planner\Settings get_settings()
 * @method \Progress_Planner\Activities\Query get_activities__query()
 * @method \Progress_Planner\Utils\Cache get_utils__cache()
 * @method \Progress_Planner\Page_Types get_page_types()
 * @method \Progress_Planner\Rest\Stats get_rest__stats()
 * @method \Progress_Planner\Rest\Tasks get_rest__tasks()
 * @method \Progress_Planner\Todo get_todo()
 * @method \Progress_Planner\Utils\Onboard get_utils__onboard()
 * @method \Progress_Planner\Utils\Playground get_utils__playground()
 * @method \Progress_Planner\Admin\Page get_admin__page()
 * @method \Progress_Planner\Admin\Tour get_admin__tour()
 * @method \Progress_Planner\Admin\Dashboard_Widget_Score get_admin__dashboard_widget_score()
 * @method \Progress_Planner\Admin\Dashboard_Widget_Todo get_admin__dashboard_widget_todo()
 * @method \Progress_Planner\Admin\Editor get_admin__editor()
 * @method \Progress_Planner\Actions\Content get_actions__content()
 * @method \Progress_Planner\Actions\Content_Scan get_actions__content_scan()
 * @method \Progress_Planner\Actions\Maintenance get_actions__maintenance()
 * @method \Progress_Planner\Admin\Page_Settings get_admin__page_settings()
 * @method \Progress_Planner\Plugin_Deactivation get_plugin_deactivation()
 * @method \Progress_Planner\Plugin_Upgrade_Tasks get_plugin_upgrade_tasks()
 * @method \Progress_Planner\Page_Todos get_page_todos()
 * @method \Progress_Planner\Suggested_Tasks\Data_Collector\Data_Collector_Manager get_suggested_tasks__data_collector__data_collector_manager()
 * @method \Progress_Planner\Utils\Debug_Tools get_utils__debug_tools()
 * @method \Progress_Planner\Badges get_badges()
 * @method \Progress_Planner\Plugin_Migrations get_plugin_migrations()
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
			$this->get_utils__playground();
		}

		// Basic classes.
		if ( \is_admin() && \current_user_can( 'edit_others_posts' ) ) {
			$this->get_admin__page();
			$this->get_admin__tour();

			// Dont add the widget if the privacy policy is not accepted.
			if ( true === $this->is_privacy_policy_accepted() ) {
				$this->get_admin__dashboard_widget_score();
				$this->get_admin__dashboard_widget_todo();
			}
		}
		$this->get_admin__editor();

		$this->get_actions__content();
		$this->get_actions__content_scan();
		$this->get_actions__maintenance();

		// REST API.
		$this->get_rest__stats();
		$this->get_rest__tasks();

		// Onboarding.
		$this->get_utils__onboard();

		// To-do.
		$this->get_todo();

		// Post-meta.
		if ( $this->is_pro_site() ) {
			$this->get_page_todos();
		}

		\add_filter( 'plugin_action_links_' . plugin_basename( PROGRESS_PLANNER_FILE ), [ $this, 'add_action_links' ] );

		// We need to initialize some classes early.
		$this->get_page_types();
		$this->get_settings();
		$this->get_suggested_tasks();
		$this->get_badges();

		if ( true === $this->is_privacy_policy_accepted() ) {
			$this->get_admin__page_settings();

			new Plugin_Deactivation();
		}

		$this->get_plugin_upgrade_tasks();

		// Add hooks for data collectors.
		$this->get_suggested_tasks__data_collector__data_collector_manager();

		// Debug tools.
		if ( ( defined( 'PRPL_DEBUG' ) && PRPL_DEBUG ) || \get_option( 'prpl_debug' ) ) {
			$this->get_utils__debug_tools();
		}

		// Plugin upgrade.
		$this->get_plugin_migrations();

		/**
		 * Redirect on login.
		 */
		\add_action( 'wp_login', [ $this, 'redirect_on_login' ], 10, 2 );

		if ( \defined( 'WP_CLI' ) && \WP_CLI ) {
			$this->get_wp_cli__get_stats_command();
			$this->get_wp_cli__task_command();
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

		// Backwards-compatibility.
		$deprecated = [
			'get_query'                                  => [ 'get_activities__query', '1.1.1' ],
			'get_date'                                   => [ 'get_utils__date', '1.1.1' ],
			'get_widgets__suggested_tasks'               => [ 'get_admin__widgets__suggested_tasks', '1.1.1' ],
			'get_widgets__activity_scores'               => [ 'get_admin__widgets__activity_scores', '1.1.1' ],
			'get_widgets__todo'                          => [ 'get_admin__widgets__todo', '1.1.1' ],
			'get_widgets__challenge'                     => [ 'get_admin__widgets__challenge', '1.1.1' ],
			'get_widgets__latest_badge'                  => [ 'get_admin__widgets__latest_badge', '1.1.1' ],
			'get_widgets__badge_streak'                  => [ 'get_admin__widgets__badge_streak', '1.1.1' ],
			'get_widgets__published_content'             => [ 'get_admin__widgets__published_content', '1.1.1' ],
			'get_widgets__whats_new'                     => [ 'get_admin__widgets__whats_new', '1.1.1' ],
			'get_onboard'                                => [ 'get_utils__onboard', '1.1.1' ],
			'get_cache'                                  => [ 'get_utils__cache', '1.1.1' ],
			'get_rest_api_stats'                         => [ 'get_rest__stats', '1.1.1' ],
			'get_rest_api_tasks'                         => [ 'get_rest__tasks', '1.1.1' ],
			'get_data_collector__data_collector_manager' => [ 'get_suggested_tasks__data_collector__data_collector_manager', '1.1.1' ],
			'get_debug_tools'                            => [ 'get_utils__debug_tools', '1.1.1' ],
			'get_playground'                             => [ 'get_utils__playground', '1.1.1' ],
			'get_chart'                                  => [ 'get_ui__chart', '1.1.1' ],
			'get_popover'                                => [ 'get_ui__popover', '1.1.1' ],

			'get_admin__widgets__published_content'      => [ 'get_admin__widgets__content_activity', '1.3.0' ],
		];

		if ( isset( $deprecated[ $name ] ) ) {
			// Deprecated method.
			\_deprecated_function( \esc_html( $name ), \esc_html( $deprecated[ $name ][1] ), \esc_html( $deprecated[ $name ][0] ) );
			return $this->{$deprecated[ $name ][0]}();
		}
	}

	/**
	 * Get the remote server root URL.
	 *
	 * @return string
	 */
	public function get_remote_server_root_url() {
		return defined( 'PROGRESS_PLANNER_REMOTE_SERVER_ROOT_URL' )
			? \constant( 'PROGRESS_PLANNER_REMOTE_SERVER_ROOT_URL' )
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
		return 'data:image/svg+xml;base64,' . base64_encode( sprintf( '<svg width="%1$d" height="%2$d" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="%3$d" height="%4$d" style="fill:#F6F5FB;stroke:#534786;stroke-width:2"/><text x="50%%" y="50%%" font-size="20" text-anchor="middle" alignment-baseline="middle" font-family="monospace" fill="#534786">progressplanner.com</text></svg>', $width, $height, ( $width - 4 ), ( $height - 4 ) ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	}

	/**
	 * Get the activation date.
	 *
	 * @return \DateTime
	 */
	public function get_activation_date() {
		$activation_date = $this->get_settings()->get( 'activation_date' );
		if ( ! $activation_date ) {
			$activation_date = new \DateTime();
			$this->get_settings()->set( 'activation_date', $activation_date->format( 'Y-m-d' ) );
			return $activation_date;
		}
		return \DateTime::createFromFormat( 'Y-m-d', $activation_date ); // @phpstan-ignore-line return.type
	}

	/**
	 * Check if the privacy policy is accepted.
	 *
	 * @return bool
	 */
	public function is_privacy_policy_accepted() {
		return false !== \get_option( 'progress_planner_license_key', false );
	}

	/**
	 * Add action link to dashboard page.
	 *
	 * @param array $actions Existing actions.
	 *
	 * @return array
	 */
	public function add_action_links( $actions ) {
		return array_merge(
			[
				sprintf(
					'<a href="%1$s">%2$s</a>',
					\admin_url( 'admin.php?page=progress-planner' ),
					__( 'Dashboard', 'progress-planner' )
				),
			],
			$actions
		);
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
		if ( defined( 'WP_SCRIPT_DEBUG' ) && constant( 'WP_SCRIPT_DEBUG' ) ) {
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

	/**
	 * Redirect on login.
	 *
	 * @param string   $user_login The user login.
	 * @param \WP_User $user The user object.
	 *
	 * @return void
	 */
	public function redirect_on_login( $user_login, $user ) {
		// Check if the $user can `manage_options`.
		if ( ! $user->has_cap( 'manage_options' ) ) {
			return;
		}

		// Check if the user has the `prpl_redirect_on_login` meta.
		if ( ! \get_user_meta( $user->ID, 'prpl_redirect_on_login', true ) ) {
			return;
		}

		if ( isset( $_REQUEST['redirect_to'] ) && '' !== $_REQUEST['redirect_to'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.NonceVerification.Missing -- We're not processing any data.
			return;
		}

		// Redirect to the Progress Planner dashboard.
		\wp_safe_redirect( \admin_url( 'admin.php?page=progress-planner' ) );
		exit;
	}

	/**
	 * Check if we're on the Progress Planner dashboard page.
	 *
	 * @return bool
	 */
	public function is_on_progress_planner_dashboard_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing any data.
		return \is_admin() && isset( $_GET['page'] ) && $_GET['page'] === 'progress-planner';
	}
}
// phpcs:enable Generic.Commenting.Todo
