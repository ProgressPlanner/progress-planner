<?php
/**
 * Debug tools for the Progress Planner plugin.
 *
 * This file contains the Debug_Tools class which provides debugging functionality
 * through the WordPress admin bar, including cache clearing, task management,
 * and license management capabilities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Class Debug_Tools
 *
 * Provides debugging tools and functionality through the WordPress admin bar.
 * Only accessible to users with 'manage_options' capability.
 */
class Debug_Tools {

	/**
	 * Current URL.
	 *
	 * @var string
	 */
	protected $current_url;

	/**
	 * Constructor.
	 *
	 * Initializes the debug tools by setting up action hooks for the admin bar
	 * and various debugging functions.
	 */
	public function __construct() {
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}

		$this->current_url = wp_nonce_url( esc_url_raw( \wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'prpl_debug_tools' );

		\add_action( 'admin_bar_menu', [ $this, 'add_toolbar_items' ], 100 );
		\add_action( 'init', [ $this, 'check_clear_cache' ] );
		\add_action( 'init', [ $this, 'check_delete_suggested_tasks' ] );
		\add_action( 'init', [ $this, 'check_delete_local_tasks' ] );
		\add_action( 'init', [ $this, 'check_delete_licenses' ] );
		\add_action( 'init', [ $this, 'check_delete_badges' ] );

		// Add filter to modify the maximum number of suggested tasks to display.
		\add_filter( 'progress_planner_suggested_tasks_max_items_per_type', [ $this, 'check_show_all_suggested_tasks' ] );
	}

	/**
	 * Add debug items to the WordPress admin bar.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	public function add_toolbar_items( $admin_bar ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Add top level menu item.
		$admin_bar->add_node(
			[
				'id'    => 'prpl-debug',
				'title' => 'PRPL Debug',
			]
		);

		$this->add_delete_submenu_item( $admin_bar );

		// Show all suggested tasks.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-show-all-suggested-tasks',
				'parent' => 'prpl-debug',
				'title'  => 'Show All Suggested Tasks',
				'href'   => add_query_arg( 'prpl_show_all_suggested_tasks', '99', $this->current_url ),
			]
		);

		$this->add_upgrading_tasks_submenu_item( $admin_bar );

		$this->add_local_tasks_submenu_item( $admin_bar );
		$this->add_suggestions_submenu_item( $admin_bar );

		$this->add_more_info_submenu_item( $admin_bar );
	}

	/**
	 * Add delete submenu item.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	protected function add_delete_submenu_item( $admin_bar ) {

		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}

		// Add delete submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-debug-delete',
				'parent' => 'prpl-debug',
				'title'  => 'Delete',
			]
		);

		// Add submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-clear-cache',
				'parent' => 'prpl-debug-delete',
				'title'  => 'Delete Cache',
				'href'   => add_query_arg( 'prpl_clear_cache', '1', $this->current_url ),
			]
		);

		// Add Delete Local Tasks submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-delete-local-tasks',
				'parent' => 'prpl-debug-delete',
				'title'  => 'Delete Local Tasks',
				'href'   => add_query_arg( 'prpl_delete_local_tasks', '1', $this->current_url ),
			]
		);

		// Add Delete Suggested Tasks submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-delete-suggested-tasks',
				'parent' => 'prpl-debug-delete',
				'title'  => 'Delete Suggested Tasks',
				'href'   => add_query_arg( 'prpl_delete_suggested_tasks', '1', $this->current_url ),
			]
		);

		// Add Delete License submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-delete-licenses',
				'parent' => 'prpl-debug-delete',
				'title'  => 'Delete Licenses',
				'href'   => add_query_arg( 'prpl_delete_licenses', '1', $this->current_url ),
			]
		);

		// Add Delete License submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-delete-badges',
				'parent' => 'prpl-debug-delete',
				'title'  => 'Delete Badges',
				'href'   => add_query_arg( 'prpl_delete_badges', '1', $this->current_url ),
			]
		);
	}

	/**
	 * Add Upgrading Tasks submenu to the debug menu.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	protected function add_upgrading_tasks_submenu_item( $admin_bar ) {

		$admin_bar->add_node(
			[
				'id'     => 'prpl-upgrading-tasks',
				'parent' => 'prpl-debug',
				'title'  => 'Onboarding / Upgrade Tasks',
			]
		);

		$onboard_task_provider_ids = apply_filters( 'prpl_onboarding_task_providers', [] );

		foreach ( $onboard_task_provider_ids as $task_provider_id ) {
			$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_provider_id ); // @phpstan-ignore-line method.nonObject
			if ( $task_provider ) { // @phpstan-ignore-line
				$task_provider_details = $task_provider->get_task_details();

				$admin_bar->add_node(
					[
						'id'     => 'prpl-upgrading-task-' . $task_provider_id,
						'parent' => 'prpl-upgrading-tasks',
						'title'  => $task_provider_details['title'],
					]
				);
			}
		}
	}

	/**
	 * Add Local Tasks submenu to the debug menu.
	 *
	 * Displays a list of local tasks or a message if none exist.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	protected function add_local_tasks_submenu_item( $admin_bar ) {
		// Add Local Tasks submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-local-tasks',
				'parent' => 'prpl-debug',
				'title'  => 'Local Tasks',
			]
		);

		// Get and display local tasks.
		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		if ( ! empty( $local_tasks ) ) {
			foreach ( $local_tasks as $key => $task ) {
				$admin_bar->add_node(
					[
						'id'     => 'prpl-local-task-' . $key,
						'parent' => 'prpl-local-tasks',
						'title'  => $task,
					]
				);
			}
		} else {
			$admin_bar->add_node(
				[
					'id'     => 'prpl-no-local-tasks',
					'parent' => 'prpl-local-tasks',
					'title'  => 'No local tasks found',
				]
			);
		}
	}

	/**
	 * Add Suggestion Tasks submenu to the debug menu.
	 *
	 * Displays lists of completed, snoozed, and pending celebration tasks.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	protected function add_suggestions_submenu_item( $admin_bar ) {
		// Add Suggested Tasks submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-suggested-tasks',
				'parent' => 'prpl-debug',
				'title'  => 'Suggested Tasks',
				'href'   => '#',
			]
		);

		// Get suggested tasks.
		$suggested_tasks = \progress_planner()->get_settings()->get( 'suggested_tasks', [] );

		$suggested_tasks_sorted = [];
		foreach ( $suggested_tasks as $task ) {
			if ( isset( $task['status'] ) ) {
				$suggested_tasks_sorted[ $task['status'] ][] = $task;
			}
		}

		$menu_items = [
			'completed'           => 'Completed',
			'snoozed'             => 'Snoozed',
			'pending_celebration' => 'Pending Celebration',
		];

		foreach ( $menu_items as $key => $title ) {
			$admin_bar->add_node(
				[
					'id'     => 'prpl-suggested-' . $key,
					'parent' => 'prpl-suggested-tasks',
					'title'  => $title,
				]
			);

			if ( ! empty( $suggested_tasks_sorted[ $key ] ) ) {
				foreach ( $suggested_tasks_sorted[ $key ] as $task_key => $task_id ) {

					$title = $task_id['id'];
					if ( 'snoozed' === $key && isset( $task_id['time'] ) ) {
						$title .= is_float( $task_id['time'] )
							? ' (forever)'
							: ' (until ' . \gmdate( 'Y-m-d H:i', $task_id['time'] ) . ')';
					}

					$admin_bar->add_node(
						[
							'id'     => 'prpl-suggested-' . $key . '-' . $title,
							'parent' => 'prpl-suggested-' . $key,
							'title'  => $title,
						]
					);
				}
			} else {
				$admin_bar->add_node(
					[
						'id'     => 'prpl-no-' . $key . '-tasks',
						'parent' => 'prpl-suggested-' . $key,
						'title'  => 'No ' . $title . ' tasks',
					]
				);
			}
		}
	}

	/**
	 * Check and process the delete local tasks action.
	 *
	 * Deletes all local tasks if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_delete_local_tasks() {

		if (
			! isset( $_GET['prpl_delete_local_tasks'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_GET['prpl_delete_local_tasks'] !== '1' || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' )
		) {
			return;
		}

		// Verify nonce for security.
		$this->verify_nonce();

		// Delete the option.
		\progress_planner()->get_settings()->set( 'local_tasks', [] );

		// Redirect to the same page without the parameter.
		wp_safe_redirect( remove_query_arg( 'prpl_delete_local_tasks' ) );
		exit;
	}

	/**
	 * Check and process the delete badges action.
	 *
	 * Deletes all badges and related activities if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_delete_badges() {

		if (
			! isset( $_GET['prpl_delete_badges'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_GET['prpl_delete_badges'] !== '1' || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' )
		) {
			return;
		}

		// Verify nonce for security.
		$this->verify_nonce();

		// Delete activities.
		\progress_planner()->get_query()->delete_category_activities( 'suggested_task' );

		// Delete the badges.
		$progress_planner_settings           = \get_option( \Progress_Planner\Settings::OPTION_NAME, [] );
		$progress_planner_settings['badges'] = [];
		\update_option( \Progress_Planner\Settings::OPTION_NAME, $progress_planner_settings );

		// Redirect to the same page without the parameter.
		wp_safe_redirect( remove_query_arg( 'prpl_delete_badges' ) );
		exit;
	}

	/**
	 * Modify the maximum number of suggested tasks to display.
	 *
	 * @param array $max_items_per_type Array of maximum items per task type.
	 * @return array Modified array of maximum items per task type.
	 */
	public function check_show_all_suggested_tasks( $max_items_per_type ) {
		if (
			! isset( $_GET['prpl_show_all_suggested_tasks'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' ) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		) {
			return $max_items_per_type;
		}

		$max_items = \absint( \wp_unslash( $_GET['prpl_show_all_suggested_tasks'] ) );  // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		foreach ( $max_items_per_type as $key => $value ) {
			$max_items_per_type[ $key ] = $max_items;
		}

		return $max_items_per_type;
	}

	/**
	 * Add More Info submenu to the debug menu.
	 *
	 * Displays various system information including remote URL and license details.
	 *
	 * @param \WP_Admin_Bar $admin_bar The WordPress admin bar object.
	 * @return void
	 */
	protected function add_more_info_submenu_item( $admin_bar ) {
		// Add More Info submenu item.
		$admin_bar->add_node(
			[
				'id'     => 'prpl-more-info',
				'parent' => 'prpl-debug',
				'title'  => 'More Info',
			]
		);

		// Add Remote Server URL info.
		if ( function_exists( 'progress_planner' ) ) {
			$remote_url = \progress_planner()->get_remote_server_root_url();
			$admin_bar->add_node(
				[
					'id'     => 'prpl-remote-url',
					'parent' => 'prpl-more-info',
					'title'  => 'Remote URL: ' . esc_html( $remote_url ),
				]
			);
		}

		// Free license info.
		$prpl_free_license_key = \get_option( 'progress_planner_license_key', false );
		$admin_bar->add_node(
			[
				'id'     => 'prpl-free-license',
				'parent' => 'prpl-more-info',
				'title'  => 'Free License: ' . ( false !== $prpl_free_license_key ? $prpl_free_license_key : 'Not set' ),
			]
		);

		$prpl_pro_license = \get_option( 'progress_planner_pro_license_key', false );
		$admin_bar->add_node(
			[
				'id'     => 'prpl-pro-license',
				'parent' => 'prpl-more-info',
				'title'  => 'Pro License: ' . ( false !== $prpl_pro_license ? $prpl_pro_license : 'Not set' ),
			]
		);

		$prpl_pro_license_status = \get_option( 'progress_planner_pro_license_status', false );
		$admin_bar->add_node(
			[
				'id'     => 'prpl-pro-license-status',
				'parent' => 'prpl-more-info',
				'title'  => 'Pro License Status: ' . ( false !== $prpl_pro_license_status ? $prpl_pro_license_status : 'Not set' ),
			]
		);
	}

	/**
	 * Check and process the delete suggested tasks action.
	 *
	 * Deletes all suggested tasks if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_delete_suggested_tasks() {
		if (
			! isset( $_GET['prpl_delete_suggested_tasks'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_GET['prpl_delete_suggested_tasks'] !== '1' || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' )
		) {
			return;
		}

		// Verify nonce for security.
		$this->verify_nonce();

		// Delete the option.
		\progress_planner()->get_settings()->set( 'suggested_tasks', [] );

		// Redirect to the same page without the parameter.
		wp_safe_redirect( remove_query_arg( 'prpl_delete_suggested_tasks' ) );
		exit;
	}

	/**
	 * Check and process the clear cache action.
	 *
	 * Clears the plugin cache if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_clear_cache() {
		if (
			! isset( $_GET['prpl_clear_cache'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_GET['prpl_clear_cache'] !== '1' || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' ) ||
			! function_exists( 'progress_planner' )
		) {
			return;
		}

		// Verify nonce for security.
		$this->verify_nonce();

		// Clear cache.
		\progress_planner()->get_cache()->delete_all();

		// Redirect to the same page without the parameter.
		wp_safe_redirect( remove_query_arg( 'prpl_clear_cache' ) );
		exit;
	}

	/**
	 * Check and process the delete licenses action.
	 *
	 * Deletes all license-related options if the appropriate query parameter is set
	 * and user has required capabilities.
	 *
	 * @return void
	 */
	public function check_delete_licenses() {
		if (
			! isset( $_GET['prpl_delete_licenses'] ) || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$_GET['prpl_delete_licenses'] !== '1' || // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! current_user_can( 'manage_options' )
		) {
			return;
		}

		// Verify nonce for security.
		$this->verify_nonce();

		// Delete the option.
		delete_option( 'progress_planner_license_key' );
		delete_option( 'progress_planner_pro_license_key' );
		delete_option( 'progress_planner_pro_license_status' );

		// Redirect to the same page without the parameter.
		wp_safe_redirect( remove_query_arg( 'prpl_delete_licenses' ) );
		exit;
	}

	/**
	 * Verify nonce for security.
	 *
	 * @return void
	 */
	protected function verify_nonce() {
		if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( \wp_unslash( $_GET['_wpnonce'] ), 'prpl_debug_tools' ) ) { //  phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			wp_die( esc_html__( 'Security check failed', 'progress-planner' ) );
		}
	}
}
