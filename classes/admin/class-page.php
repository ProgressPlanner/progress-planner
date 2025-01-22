<?php
/**
 * Create the admin page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Admin page class.
 */
class Page {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register the hooks.
	 *
	 * @return void
	 */
	private function register_hooks() {
		\add_action( 'admin_menu', [ $this, 'add_page' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'wp_ajax_progress_planner_save_cpt_settings', [ $this, 'save_cpt_settings' ] );
	}

	/**
	 * Get the widgets objects
	 *
	 * @return array<\Progress_Planner\Widget>
	 */
	public function get_widgets() {
		$widgets = [
			\progress_planner()->get_widgets__activity_scores(),
			\progress_planner()->get_widgets__suggested_tasks(),
			\progress_planner()->get_widgets__todo(),
			\progress_planner()->get_widgets__challenge(),
			\progress_planner()->get_widgets__latest_badge(),
			\progress_planner()->get_widgets__badge_streak(),
			\progress_planner()->get_widgets__published_content(),
			\progress_planner()->get_widgets__whats_new(),
		];

		/**
		 * Filter the widgets.
		 *
		 * @param array<\Progress_Planner\Widget> $widgets The widgets.
		 *
		 * @return array<\Progress_Planner\Widget>
		 */
		return \apply_filters( 'progress_planner_admin_widgets', $widgets );
	}

	/**
	 * Get a widget object.
	 *
	 * @param string $id The widget ID.
	 *
	 * @return \Progress_Planner\Widget|void
	 */
	public function get_widget( $id ) {
		$widgets = $this->get_widgets();
		foreach ( $widgets as $widget ) {
			if ( $widget->get_id() === $id ) {
				return $widget;
			}
		}
	}

	/**
	 * Add the admin page.
	 *
	 * @return void
	 */
	public function add_page() {
		\add_menu_page(
			\esc_html__( 'Progress Planner', 'progress-planner' ),
			\esc_html__( 'Progress Planner', 'progress-planner' ),
			'manage_options',
			'progress-planner',
			[ $this, 'render_page' ],
			'data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjggNTAwIj48cGF0aCBmaWxsPSIjMzgyOTZkIiBkPSJNMjE3LjQ2IDE3Mi45YzMuMjEuMTIgNS45NyAxLjc0IDcuNzMgNC4xNS0xLjg3LTEwLjI0LTEwLjY0LTE4LjE3LTIxLjQ4LTE4LjU2LTEyLjUyLS40NS0yMy4wMyA5LjMzLTIzLjQ4IDIxLjg1LS40NSAxMi41MiA5LjMzIDIzLjAzIDIxLjg1IDIzLjQ4IDkuNC4zNCAxNy42Ny01LjEgMjEuNC0xMy4xMy0xLjgzIDEuNTEtNC4xOCAyLjQyLTYuNzQgMi4zMy01LjU1LS4yLTkuODktNC44Ni05LjY5LTEwLjQxLjItNS41NSA0Ljg2LTkuODkgMTAuNDEtOS42OVpNMjQxLjUxIDMwNS44NGMuNTggMS45MiAxLjEzIDMuODYgMS43MyA1Ljc3IDE0LjA0IDQ0Ljk3IDMzLjk0IDg4Ljc1IDU2LjQyIDEyNC4yN2w2Ny43NS0xMzAuMDRoLTEyNS45Wk0yOTcuOTYgMjA1Ljk3YzEyLjEyLTQuNSAyMy41NC03LjE4IDMzLjY0LTguOTYtMjIuNTEtMjIuMjctNjEuMjQtMjcuMDYtNjEuNDctMjcuMDkgMS4yNyA2LjE3LjU4IDE1LjgtMi40NCAyNi40Ni0zLjMgMTEuNjYtOS4zOCAyNC41NC0xOC43IDM1LjQ4LTMuNDUgNC4wNi03LjM2IDcuODMtMTEuNzMgMTEuMTloLjA3di0uMDFjLjE2LjYyLjM4IDEuMi41OCAxLjc5IDIuNzQgOC4yNyA4LjYxIDEzLjc0IDE0LjkzIDE3LjE0IDYuNDggMy40OSAxMy4zNyA0LjgzIDE3LjY4IDQuODMgNi40IDAgMTEuODgtMy43OSAxNC40My05LjIyLjk3LTIuMDYgMS41NS00LjMzIDEuNTUtNi43NiAwLTMuODUtMS40Mi03LjM0LTMuNjktMTAuMS0xLjkyLTIuMzMtNC40Ni00LjA4LTcuMzktNS4wM2w0NC44Mi04LjY1Yy02LjYzLTYuMTItMTQuNzItMTEuNTktMjIuNzMtMTYuMjMtMS45Ny0xLjE0LTEuNjktNC4wNS40NS00Ljg0WiIvPjxwYXRoIGZpbGw9IiNmYWEzMTAiIGQ9Ik0yODEuMzcgNDU4LjM3Yy0yNS43OS0zOC44NC00OC42OC04OC4wNC02NC40NS0xMzguNTQtMS40NS00LjYzLTIuODMtOS4zMS00LjE3LTEzLjk5LTEuMTItMy45NC0yLjIyLTcuODgtMy4yNS0xMS44LTIuMDktNy45Mi05LjI4LTEzLjQ2LTE3LjQ4LTEzLjQ2aC0yNy45NWMtOC4yIDAtMTUuMzkgNS41My0xNy40OCAxMy40NS0yLjI4IDguNjUtNC43OCAxNy4zMi03LjQyIDI1Ljc5LTE1Ljc3IDUwLjUtMzguNjUgOTkuNy02NC40NSAxMzguNTQtNC4wMSA2LjAzLTEuNzggMTEuNjMtLjY0IDEzLjc2IDIuNCA0LjQ3IDYuODYgNy4xNCAxMS45NCA3LjE0aDY2LjAxbDMuOTcgNi45MmM0LjU0IDcuOSAxMi45OSAxMi44MSAyMi4wNSAxMi44MXMxNy41MS00LjkxIDIyLjA2LTEyLjgxbDMuOTgtNi45Mmg2NmMzLjIyIDAgNi4xOS0xLjA4IDguNTUtMy4wMiAxLjM1LTEuMTEgMi41MS0yLjQ5IDMuMzgtNC4xMy41Ny0xLjA3IDEuNDItMy4wMiAxLjYxLTUuNDYuMTktMi40MS0uMjYtNS4zMS0yLjI1LTguMzFaIi8+PHBhdGggZmlsbD0iIzM4Mjk2ZCIgZD0iTTI5NS43IDc2LjA2Yy03LjU0LTEyLjA1LTMyLjM4IDEtNTkuNTQgMi44Ni0xNS4wNCAxLjAzLTM3LjA1LTExMC42My03MS43Ny01Ni45OS0zOS41NiA2MS4xLTc5LjEyLTQ0LjY4LTg4LjY2LTE1LjgzLTIxLjExIDQzLjI3IDI1LjE1IDg0LjYxIDI1LjE1IDg0LjYxcy0xMi44NCA3LjkyLTIwLjYzIDEzLjkzYy01LjQ3IDQuMTctMTAuODIgOC42NS0xNi4wMyAxMy41MS0yMC40NSAxOS4wMy0zNi4wNCA0MC4zMi00Ni43NyA2My44NkM2LjcyIDIwNS41NSAxLjExIDIyOS41OS42MiAyNTQuMTVjLS40OSAyNC41NiA0LjAxIDQ5LjEgMTMuNTQgNzMuNjMgOS41MiAyNC41MyAyNC4xNyA0Ny40MiA0My45NSA2OC42OCA0LjAyIDQuMzIgOC4xMiA4LjQxIDEyLjMxIDEyLjMgNC4xLTYuMzEgNy45Ny0xMi43NCAxMS42NC0xOS4yNiA0LjM5LTcuOCA4LjUtMTUuNzIgMTIuMjUtMjMuNzgtLjMzLS4zNS0uNjYtLjY5LS45OS0xLjAzLS4xNy0uMTgtLjM0LS4zNS0uNTEtLjUzLTE1LjUzLTE2LjY5LTI3LjE3LTM0LjU5LTM0LjkzLTUzLjcyLTcuNzctMTkuMTMtMTEuNS0zOC4yNS0xMS4yLTU3LjM2LjI5LTE5LjEgNC40Ny0zNy42OCAxMi41My01NS43MiA4LjA2LTE4LjA1IDIwLjAyLTM0LjQ1IDM1LjktNDkuMjIgMTMuOTktMTMuMDIgMjguODQtMjIuODMgNDQuNTUtMjkuNDEgMTUuNy02LjU5IDMxLjYzLTkuOTggNDcuNzYtMTAuMTggOS4wNS0uMTEgMTkuMTEgMS4xNSAyOS41MSA0LjUgMTAuMzIgNC4yNyAxOS4yMiA5LjQ0IDI2LjYzIDE1LjM1IDEwLjE5IDguMTMgMTcuNjEgMTcuNjUgMjIuMjIgMjguMSAxLjkxIDQuMzIgMy4zNyA4LjggNC4zMiAxMy40MSAxNi4yNy0yOC4yNyAzNi43NS03NS45NiAyNS41Ny05My44M1oiLz48L3N2Zz4='
		);
	}

	/**
	 * Render the admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		\progress_planner()->the_view( 'admin-page.php' );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'toplevel_page_progress-planner' !== $hook && 'progress-planner_page_progress-planner-settings' !== $hook ) {
			return;
		}

		$this->enqueue_scripts();
		$this->enqueue_styles();
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}

		\progress_planner()->get_admin__scripts()->register_scripts();

		if ( 'toplevel_page_progress-planner' === $current_screen->id ) {

			if ( true === \progress_planner()->is_privacy_policy_accepted() ) {
				\wp_enqueue_script( 'progress-planner-web-components-prpl-gauge' );
				\wp_enqueue_script( 'progress-planner-web-components-prpl-chart-bar' );
				\wp_enqueue_script( 'progress-planner-web-components-prpl-chart-line' );
				\wp_enqueue_script( 'progress-planner-web-components-prpl-big-counter' );
				\wp_enqueue_script( 'progress-planner-header-filters' );
				\wp_enqueue_script( 'progress-planner-settings' );
				\wp_enqueue_script( 'progress-planner-grid-masonry' );
			} else {
				\wp_enqueue_script( 'progress-planner-onboard' );
			}
		}

		if ( 'progress-planner_page_progress-planner-settings' === $current_screen->id ) {
			\wp_enqueue_script( 'progress-planner-settings-page' );
		}
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		$current_screen = \get_current_screen();
		if ( ! $current_screen ) {
			return;
		}

		\wp_enqueue_style(
			'progress-planner-header-filters',
			PROGRESS_PLANNER_URL . '/assets/css/admin.css',
			[],
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/admin.css' )
		);

		if ( 'progress-planner_page_progress-planner-settings' === $current_screen->id ) {
			\wp_enqueue_style(
				'progress-planner-settings-page',
				PROGRESS_PLANNER_URL . '/assets/css/settings-page.css',
				[],
				\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/settings-page.css' )
			);
		}
	}

	/**
	 * Save the post types settings.
	 *
	 * @return void
	 */
	public function save_cpt_settings() {
		\check_ajax_referer( 'progress_planner', 'nonce', false );
		$include_post_types = isset( $_POST['include_post_types'] ) ? \sanitize_text_field( \wp_unslash( $_POST['include_post_types'] ) ) : 'post,page';
		$include_post_types = \explode( ',', $include_post_types );
		\progress_planner()->get_settings()->set( 'include_post_types', $include_post_types );

		\wp_send_json_success(
			[
				'message' => \esc_html__( 'Settings saved.', 'progress-planner' ),
			]
		);
	}
}
