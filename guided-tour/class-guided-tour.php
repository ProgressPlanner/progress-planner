<?php
/**
 * Multi-screen guided tour system for WordPress.
 *
 * This is for hosting partner installations, distinct from the plugin onboarding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Guided_Tour;

/**
 * Handles multi-screen guided tours using driver.js with persistent state.
 */
class Guided_Tour {

	/**
	 * User meta key for storing tour state.
	 */
	const META_KEY = 'progress_planner_guided_tour';

	/**
	 * Available tours configuration.
	 *
	 * @var array
	 */
	private array $tours = [];

	/**
	 * Current user's tour state.
	 *
	 * @var array|null
	 */
	private ?array $current_state = null;

	/**
	 * Initialize the guided tour system.
	 */
	public function __construct() {
		$this->register_tours();
	}

	/**
	 * Register WordPress hooks.
	 */
	public function init(): void {
		// Admin assets.
		add_action( 'admin_enqueue_scripts', [ $this, 'maybe_enqueue_admin_assets' ] );
		add_action( 'admin_footer', [ $this, 'render_continue_prompt' ] );

		// Frontend assets (for homepage tour).
		add_action( 'wp_enqueue_scripts', [ $this, 'maybe_enqueue_frontend_assets' ] );
		add_action( 'wp_footer', [ $this, 'render_frontend_tour_card' ] );

		// Block editor assets.
		add_action( 'enqueue_block_editor_assets', [ $this, 'maybe_enqueue_editor_assets' ] );

		// AJAX handlers.
		add_action( 'wp_ajax_pp_guided_tour_update', [ $this, 'ajax_update_progress' ] );
		add_action( 'wp_ajax_pp_guided_tour_start', [ $this, 'ajax_start_tour' ] );
		add_action( 'wp_ajax_pp_guided_tour_skip', [ $this, 'ajax_skip_tour' ] );
		add_action( 'wp_ajax_pp_guided_tour_complete', [ $this, 'ajax_complete_tour' ] );

		// Admin bar link for starting tour (temporary for testing).
		add_action( 'admin_bar_menu', [ $this, 'add_admin_bar_tour_link' ], 100 );

		// Handle tour start via GET parameter.
		add_action( 'template_redirect', [ $this, 'maybe_start_tour_from_url' ] );
	}

	/**
	 * Add "Start Tour" link to admin bar on frontend homepage.
	 *
	 * @param \WP_Admin_Bar $admin_bar Admin bar instance.
	 */
	public function add_admin_bar_tour_link( $admin_bar ): void {
		// Only on frontend.
		if ( is_admin() ) {
			return;
		}

		// Only on front page.
		if ( ! is_front_page() ) {
			return;
		}

		// Only for users who can edit.
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		// Check if tour is already active - show reset link instead.
		$state = $this->get_state();
		if ( ! empty( $state['active'] ) ) {
			$admin_bar->add_node(
				[
					'id'    => 'pp-reset-guided-tour',
					'title' => __( 'Reset Tour', 'progress-planner' ),
					'href'  => add_query_arg( 'pp_reset_tour', '1', home_url() ),
					'meta'  => [
						'class' => 'pp-guided-tour-admin-bar-link',
					],
				]
			);
			return;
		}

		$admin_bar->add_node(
			[
				'id'    => 'pp-start-guided-tour',
				'title' => __( 'Start Guided Tour', 'progress-planner' ),
				'href'  => add_query_arg( 'pp_start_tour', 'go-to-publish', home_url() ),
				'meta'  => [
					'class' => 'pp-guided-tour-admin-bar-link',
				],
			]
		);
	}

	/**
	 * Maybe start tour from URL parameter.
	 */
	public function maybe_start_tour_from_url(): void {
		// Only for users who can edit.
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		// Handle reset.
		if ( isset( $_GET['pp_reset_tour'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			delete_user_meta( get_current_user_id(), self::META_KEY );
			$this->current_state = null;
			wp_safe_redirect( remove_query_arg( 'pp_reset_tour' ) );
			exit;
		}

		// Check for the start parameter.
		if ( ! isset( $_GET['pp_start_tour'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}

		$tour_id = sanitize_key( $_GET['pp_start_tour'] ); // phpcs:ignore WordPress.Security.NonceVerification

		// Verify the tour exists.
		if ( ! isset( $this->tours[ $tour_id ] ) ) {
			return;
		}

		// Start the tour.
		$this->start_tour( $tour_id );

		// Redirect to remove the query parameter (clean URL).
		wp_safe_redirect( remove_query_arg( 'pp_start_tour' ) );
		exit;
	}

	/**
	 * Register all available tours.
	 */
	private function register_tours(): void {
		$this->tours = [
			'go-to-publish'    => [
				'id'          => 'go-to-publish',
				'title'       => __( 'Go to Publish', 'progress-planner' ),
				'description' => __( 'Get your website ready for the world.', 'progress-planner' ),
				'badge'       => 'go-to-publish',
				'steps'       => [
					// Step 0: Welcome on frontend homepage.
					[
						'context'     => 'frontend',
						'page'        => 'front_page',
						'element'     => '',
						'title'       => __( 'Yesssssss! Welcome to your website!', 'progress-planner' ),
						'description' => __( 'And now we\'re going to improve and customize it together so it\'s ready for the world. Are you ready to get started?', 'progress-planner' ),
						'cta'         => __( 'Edit Page', 'progress-planner' ),
						'cta_hint'    => __( 'Click here to start the guided tour.', 'progress-planner' ),
					],
					// Step 1: Check the title in block editor.
					[
						'context'     => 'editor',
						'page'        => 'front_page',
						'element'     => 'first-heading',
						'title'       => __( 'This is your homepage!', 'progress-planner' ),
						'description' => __( 'Looks good, right? Check the title. Are you happy with it, or do you want to adjust it?', 'progress-planner' ),
						'hint'        => __( 'Do you want to know more about what exactly a good homepage entails? Click on the Progress Planner logo in the sidebar. There you will find videos and tips.', 'progress-planner' ),
						'side'        => 'right',
					],
					// Step 2: Check the main message/paragraph.
					[
						'context'     => 'editor',
						'page'        => 'front_page',
						'element'     => 'first-paragraph',
						'title'       => __( 'What is the main message of your website?', 'progress-planner' ),
						'description' => __( 'Is it clearly stated? Go ahead and adjust the text!', 'progress-planner' ),
						'hint'        => __( 'Do you want to know more about what exactly a good homepage entails? Click on the Progress Planner logo in the sidebar. There you will find videos and tips.', 'progress-planner' ),
						'side'        => 'right',
					],
					// Step 3: Check the first image.
					[
						'context'              => 'editor',
						'page'                 => 'front_page',
						'element'              => 'first-image',
						'title'                => __( 'Make sure to use authentic photos', 'progress-planner' ),
						'description'          => __( 'What do you think of the pictures and photos now? Go ahead and upload some of your own photos and images!', 'progress-planner' ),
						'fallback_description' => __( 'We couldn\'t find any images on this page yet. Consider adding some authentic photos to make your homepage more engaging! You can add an image block using the + button in the editor.', 'progress-planner' ),
						'side'                 => 'right',
					],
					// Step 4: Reorder blocks.
					[
						'context'     => 'editor',
						'page'        => 'front_page',
						'element'     => 'list-view-button',
						'title'       => __( 'Reorder your blocks', 'progress-planner' ),
						'description' => __( 'The page consists of a number of blocks. You can change the order of these blocks. Are your blocks in the order you want them to be? Try reordering them!', 'progress-planner' ),
						'hint'        => __( 'Click here to open the List View where you can drag and drop blocks to reorder them.', 'progress-planner' ),
						'side'        => 'bottom',
					],
					// Step 5: Add or remove blocks.
					[
						'context'     => 'editor',
						'page'        => 'front_page',
						'element'     => 'block-inserter',
						'title'       => __( 'Add or remove blocks', 'progress-planner' ),
						'description' => __( 'Perhaps you want to delete some of the blocks. Or add some! Check whether you need all the blocks that are now on your homepage.', 'progress-planner' ),
						'hint'        => __( 'Click the + button to add new blocks, or select a block and press Delete to remove it.', 'progress-planner' ),
						'side'        => 'bottom',
					],
					// Step 6: Save the changes.
					[
						'context'     => 'editor',
						'page'        => 'front_page',
						'element'     => 'save-button',
						'title'       => __( 'Save your changes', 'progress-planner' ),
						'description' => __( 'Great job! Now click the Save button to publish your changes and make them live on your website.', 'progress-planner' ),
						'hint'        => __( 'Your changes won\'t be visible to visitors until you save them.', 'progress-planner' ),
						'side'        => 'bottom',
					],
				],
			],
			'hosting-setup'    => [
				'id'          => 'hosting-setup',
				'title'       => __( 'Hosting Integration Setup', 'progress-planner' ),
				'description' => __( 'Learn how to connect your hosting account.', 'progress-planner' ),
				'steps'       => [
					[
						'context'     => 'admin',
						'page'        => 'index.php',
						'element'     => '#dashboard-widgets-wrap',
						'title'       => __( 'Welcome to Progress Planner!', 'progress-planner' ),
						'description' => __( 'Let\'s set up your hosting integration. This quick tour will guide you through the process.', 'progress-planner' ),
						'side'        => 'bottom',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner',
						'element'     => '.progress-planner-nav',
						'title'       => __( 'Progress Planner Dashboard', 'progress-planner' ),
						'description' => __( 'This is your main dashboard. Navigate using these tabs.', 'progress-planner' ),
						'side'        => 'bottom',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner-settings',
						'element'     => '.pp-settings-section-hosting',
						'title'       => __( 'Hosting Settings', 'progress-planner' ),
						'description' => __( 'Here you\'ll configure your hosting connection.', 'progress-planner' ),
						'side'        => 'right',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner-settings',
						'element'     => '#pp-hosting-api-key',
						'title'       => __( 'Enter Your API Key', 'progress-planner' ),
						'description' => __( 'Paste your hosting API key here. You can find this in your hosting dashboard.', 'progress-planner' ),
						'side'        => 'bottom',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner-settings',
						'element'     => '#pp-hosting-connect-btn',
						'title'       => __( 'Connect Your Account', 'progress-planner' ),
						'description' => __( 'Click this button to verify and connect your hosting account.', 'progress-planner' ),
						'side'        => 'top',
					],
				],
			],
			'first-time-setup' => [
				'id'          => 'first-time-setup',
				'title'       => __( 'Getting Started', 'progress-planner' ),
				'description' => __( 'Quick introduction to Progress Planner features.', 'progress-planner' ),
				'steps'       => [
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner',
						'element'     => '.pp-score-widget',
						'title'       => __( 'Your Progress Score', 'progress-planner' ),
						'description' => __( 'This widget shows your overall site health score.', 'progress-planner' ),
						'side'        => 'right',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner',
						'element'     => '.pp-tasks-widget',
						'title'       => __( 'Recommended Tasks', 'progress-planner' ),
						'description' => __( 'Here you\'ll find actionable tasks to improve your site.', 'progress-planner' ),
						'side'        => 'left',
					],
					[
						'context'     => 'admin',
						'page'        => 'admin.php?page=progress-planner-settings',
						'element'     => '.pp-settings-general',
						'title'       => __( 'Customize Your Experience', 'progress-planner' ),
						'description' => __( 'Adjust settings to match your workflow.', 'progress-planner' ),
						'side'        => 'bottom',
					],
				],
			],
		];

		/**
		 * Filter to allow adding custom tours.
		 *
		 * @param array $tours Registered tours.
		 */
		$this->tours = apply_filters( 'progress_planner_guided_tours', $this->tours );
	}

	/**
	 * Get current user's tour state.
	 *
	 * @return array Tour state or empty array.
	 */
	public function get_state(): array {
		if ( null === $this->current_state ) {
			$state = get_user_meta(
				get_current_user_id(),
				self::META_KEY,
				true
			);

			// Handle cases where meta returns empty string or non-array.
			$this->current_state = is_array( $state ) ? $state : [];
		}

		return $this->current_state;
	}

	/**
	 * Update tour state.
	 *
	 * @param array $state New state data.
	 * @return bool Success.
	 */
	public function update_state( array $state ): bool {
		$this->current_state = wp_parse_args(
			$state,
			[
				'active'     => false,
				'tour_id'    => '',
				'step'       => 0,
				'started_at' => '',
				'completed'  => [],
			]
		);

		return (bool) update_user_meta(
			get_current_user_id(),
			self::META_KEY,
			$this->current_state
		);
	}

	/**
	 * Start a tour for the current user.
	 *
	 * @param string $tour_id Tour identifier.
	 * @return bool|array False on failure, tour data on success.
	 */
	public function start_tour( string $tour_id ) {
		if ( ! isset( $this->tours[ $tour_id ] ) ) {
			return false;
		}

		$state = [
			'active'     => true,
			'tour_id'    => $tour_id,
			'step'       => 0,
			'started_at' => current_time( 'mysql' ),
			'completed'  => $this->get_state()['completed'] ?? [],
		];

		$this->update_state( $state );

		return [
			'state' => $state,
			'tour'  => $this->tours[ $tour_id ],
		];
	}

	/**
	 * Check if admin assets should be enqueued.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function maybe_enqueue_admin_assets( string $hook ): void {
		$state = $this->get_state();

		// Check if we have an active tour with admin context steps.
		if ( ! empty( $state['active'] ) && ! empty( $state['tour_id'] ) ) {
			$tour_id = (string) $state['tour_id'];
			$tour    = $this->tours[ $tour_id ] ?? null;
			if ( $tour ) {
				$step_index   = (int) ( $state['step'] ?? 0 );
				$current_step = $tour['steps'][ $step_index ] ?? null;
				if ( $current_step && ( $current_step['context'] ?? 'admin' ) === 'admin' ) {
					$this->enqueue_assets( $state, 'admin' );
					return;
				}
			}
		}

		// Enqueue on Progress Planner pages for starting tours.
		if ( str_contains( $hook, 'progress-planner' ) ) {
			$this->enqueue_assets( $state, 'admin' );
		}
	}

	/**
	 * Check if frontend assets should be enqueued (for homepage tour).
	 */
	public function maybe_enqueue_frontend_assets(): void {
		// Only on the front page.
		if ( ! is_front_page() ) {
			return;
		}

		// Only for logged-in users who can edit.
		if ( ! is_user_logged_in() || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		$state = $this->get_state();

		// Check if there's an active tour with frontend step.
		if ( ! empty( $state['active'] ) && ! empty( $state['tour_id'] ) ) {
			$tour_id = (string) $state['tour_id'];
			$tour    = $this->tours[ $tour_id ] ?? null;
			if ( $tour ) {
				$step_index   = (int) ( $state['step'] ?? 0 );
				$current_step = $tour['steps'][ $step_index ] ?? null;
				if ( $current_step && ( $current_step['context'] ?? '' ) === 'frontend' ) {
					$this->enqueue_assets( $state, 'frontend' );
				}
			}
		}
	}

	/**
	 * Check if block editor assets should be enqueued.
	 */
	public function maybe_enqueue_editor_assets(): void {
		$state = $this->get_state();

		// Check if we have an active tour with editor context.
		if ( empty( $state['active'] ) || empty( $state['tour_id'] ) ) {
			return;
		}

		$tour_id = (string) $state['tour_id'];
		$tour    = $this->tours[ $tour_id ] ?? null;
		if ( ! $tour ) {
			return;
		}

		$step_index   = (int) ( $state['step'] ?? 0 );
		$current_step = $tour['steps'][ $step_index ] ?? null;

		if ( ! $current_step || ( $current_step['context'] ?? '' ) !== 'editor' ) {
			return;
		}

		$this->enqueue_assets( $state, 'editor' );
	}

	/**
	 * Enqueue tour assets.
	 *
	 * @param array  $state   Current tour state.
	 * @param string $context Current context (admin, frontend, editor).
	 */
	private function enqueue_assets( array $state, string $context = 'admin' ): void {
		$base_url = plugins_url( '', __FILE__ );

		// Driver.js from CDN (needed for highlights).
		wp_enqueue_style(
			'driver-js',
			'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css',
			[],
			'1.3.1'
		);

		wp_enqueue_script(
			'driver-js',
			'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js',
			[],
			'1.3.1',
			true
		);

		// Our guided tour styles.
		wp_enqueue_style(
			'pp-guided-tour',
			$base_url . '/guided-tour.css',
			[ 'driver-js' ],
			'1.0'
		);

		// Our guided tour scripts.
		$script_deps = [ 'wp-i18n', 'driver-js' ];
		if ( 'editor' === $context ) {
			$script_deps[] = 'wp-blocks';
			$script_deps[] = 'wp-data';
			$script_deps[] = 'wp-dom-ready';
		}

		wp_enqueue_script(
			'pp-guided-tour',
			$base_url . '/guided-tour.js',
			$script_deps,
			'1.0',
			true
		);

		// Prepare current page identifier.
		$current_page = $this->get_current_page_identifier( $context );

		// Get active tour data if any.
		$active_tour = null;
		if ( ! empty( $state['active'] ) && ! empty( $state['tour_id'] ) ) {
			$tour_id     = (string) $state['tour_id'];
			$active_tour = $this->tours[ $tour_id ] ?? null;
		}

		// Get the edit URL for the front page (needed for step 0 CTA).
		$front_page_edit_url = '';
		$front_page_id       = (int) get_option( 'page_on_front' );
		if ( $front_page_id ) {
			$front_page_edit_url = get_edit_post_link( $front_page_id, 'raw' );
		}

		wp_localize_script(
			'pp-guided-tour',
			'ppGuidedTour',
			[
				'state'            => $state,
				'context'          => $context,
				'currentPage'      => $current_page,
				'activeTour'       => $active_tour,
				'tours'            => $this->get_available_tours(),
				'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
				'nonce'            => wp_create_nonce( 'pp_guided_tour' ),
				'adminUrl'         => admin_url(),
				'frontPageEditUrl' => $front_page_edit_url,
				'brandingId'       => (int) \progress_planner()->get_ui__branding()->get_branding_id(),
				'isBlockTheme'     => (bool) wp_is_block_theme(),
				'i18n'             => [
					'next'            => __( 'Next', 'progress-planner' ),
					'prev'            => __( 'Previous', 'progress-planner' ),
					'done'            => __( 'Done', 'progress-planner' ),
					'skip'            => __( 'Skip Tour', 'progress-planner' ),
					'skipStep'        => __( 'Skip', 'progress-planner' ),
					'continueTitle'   => __( 'Continue Tour?', 'progress-planner' ),
					'continueMessage' => __( 'The next step is on a different page. Click continue to proceed.', 'progress-planner' ),
					'continueCta'     => __( 'Continue', 'progress-planner' ),
					'dismiss'         => __( 'Dismiss', 'progress-planner' ),
					'letsGo'          => __( 'Let\'s Go!', 'progress-planner' ),
					'editPageTitle'   => __( 'Edit Page', 'progress-planner' ),
					'editPageDesc'    => __( 'Click here to start editing your homepage.', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Get the current page identifier based on context.
	 *
	 * @param string $context Current context.
	 * @return string Page identifier.
	 */
	private function get_current_page_identifier( string $context ): string {
		if ( 'frontend' === $context ) {
			return is_front_page() ? 'front_page' : 'other';
		}

		if ( 'editor' === $context ) {
			global $post;
			$front_page_id = (int) get_option( 'page_on_front' );
			if ( $post instanceof \WP_Post && $post->ID === $front_page_id ) {
				return 'front_page';
			}
			return 'post_' . ( $post instanceof \WP_Post ? $post->ID : '0' );
		}

		// Admin context.
		$current_page = $GLOBALS['pagenow'] ?? '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Just reading page identifier.
		if ( ! empty( $_GET['page'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$current_page .= '?page=' . sanitize_text_field( wp_unslash( $_GET['page'] ) );
		}
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Just reading tab identifier.
		if ( ! empty( $_GET['tab'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$current_page .= '&tab=' . sanitize_text_field( wp_unslash( $_GET['tab'] ) );
		}

		return $current_page;
	}

	/**
	 * Get tours available to current user (excluding completed ones).
	 *
	 * @return array Available tours.
	 */
	public function get_available_tours(): array {
		$state     = $this->get_state();
		$completed = $state['completed'] ?? [];
		$available = [];

		foreach ( $this->tours as $id => $tour ) {
			if ( ! in_array( $id, $completed, true ) ) {
				$available[ $id ] = [
					'id'          => $tour['id'],
					'title'       => $tour['title'],
					'description' => $tour['description'],
					'stepCount'   => count( $tour['steps'] ),
				];
			}
		}

		return $available;
	}

	/**
	 * AJAX: Update tour progress.
	 */
	public function ajax_update_progress(): void {
		check_ajax_referer( 'pp_guided_tour', 'nonce' );

		$step = isset( $_POST['step'] ) ? absint( $_POST['step'] ) : 0;

		$state         = $this->get_state();
		$state['step'] = $step;

		$this->update_state( $state );

		// Get next step's page URL.
		$next_page = '';
		$tour_id   = (string) ( $state['tour_id'] ?? '' );
		if ( $tour_id && isset( $this->tours[ $tour_id ] ) ) {
			$tour = $this->tours[ $tour_id ];
			if ( isset( $tour['steps'][ $step ] ) ) {
				$next_page = admin_url( $tour['steps'][ $step ]['page'] );
			}
		}

		wp_send_json_success(
			[
				'state'    => $state,
				'nextPage' => $next_page,
			]
		);
	}

	/**
	 * AJAX: Start a tour.
	 */
	public function ajax_start_tour(): void {
		check_ajax_referer( 'pp_guided_tour', 'nonce' );

		$tour_id = isset( $_POST['tour_id'] ) ? sanitize_key( $_POST['tour_id'] ) : '';

		$result = $this->start_tour( $tour_id );

		if ( false === $result ) {
			wp_send_json_error( [ 'message' => __( 'Invalid tour.', 'progress-planner' ) ] );
		}

		// Get first step's page URL.
		$first_page = '';
		if ( isset( $this->tours[ $tour_id ]['steps'][0] ) ) {
			$first_page = admin_url( $this->tours[ $tour_id ]['steps'][0]['page'] );
		}

		wp_send_json_success(
			[
				'state'     => $result['state'],
				'tour'      => $result['tour'],
				'firstPage' => $first_page,
			]
		);
	}

	/**
	 * AJAX: Skip/dismiss current tour.
	 */
	public function ajax_skip_tour(): void {
		check_ajax_referer( 'pp_guided_tour', 'nonce' );

		$state           = $this->get_state();
		$state['active'] = false;

		$this->update_state( $state );

		wp_send_json_success( [ 'state' => $state ] );
	}

	/**
	 * AJAX: Complete current tour.
	 */
	public function ajax_complete_tour(): void {
		check_ajax_referer( 'pp_guided_tour', 'nonce' );

		$state = $this->get_state();

		// Add to completed list.
		if ( ! empty( $state['tour_id'] ) ) {
			$state['completed']   = $state['completed'] ?? [];
			$state['completed'][] = $state['tour_id'];
			$state['completed']   = array_unique( $state['completed'] );
		}

		$state['active']  = false;
		$state['tour_id'] = '';
		$state['step']    = 0;

		$this->update_state( $state );

		wp_send_json_success( [ 'state' => $state ] );
	}

	/**
	 * Render the "continue tour" prompt container.
	 */
	public function render_continue_prompt(): void {
		$state = $this->get_state();
		if ( empty( $state['active'] ) ) {
			return;
		}
		?>
		<div id="pp-guided-tour-continue-prompt" class="pp-guided-tour-continue" style="display: none;">
			<div class="pp-guided-tour-continue-content">
				<h4 class="pp-guided-tour-continue-title"></h4>
				<p class="pp-guided-tour-continue-message"></p>
				<div class="pp-guided-tour-continue-actions">
					<button type="button" class="button button-primary pp-guided-tour-continue-btn">
						<?php esc_html_e( 'Continue', 'progress-planner' ); ?>
					</button>
					<button type="button" class="button pp-guided-tour-continue-dismiss">
						<?php esc_html_e( 'Dismiss', 'progress-planner' ); ?>
					</button>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the frontend tour card (for homepage welcome step).
	 */
	public function render_frontend_tour_card(): void {
		// Only on front page.
		if ( ! is_front_page() ) {
			return;
		}

		// Only for logged-in users who can edit.
		if ( ! is_user_logged_in() || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		// Admin bar must be showing for the "Edit Page" link to be available.
		if ( ! is_admin_bar_showing() ) {
			return;
		}

		$state = $this->get_state();

		// Check if there's an active tour at frontend step.
		if ( empty( $state['active'] ) || empty( $state['tour_id'] ) ) {
			return;
		}

		$tour_id = (string) $state['tour_id'];
		$tour    = $this->tours[ $tour_id ] ?? null;
		if ( ! $tour ) {
			return;
		}

		$step_index   = (int) ( $state['step'] ?? 0 );
		$current_step = $tour['steps'][ $step_index ] ?? null;
		if ( ! $current_step || ( $current_step['context'] ?? '' ) !== 'frontend' ) {
			return;
		}

		?>
		<div id="pp-guided-tour-welcome" class="pp-guided-tour-welcome">
			<div class="pp-guided-tour-welcome-content">
				<button type="button" class="pp-guided-tour-welcome-close" aria-label="<?php esc_attr_e( 'Close', 'progress-planner' ); ?>">
					<span aria-hidden="true">&times;</span>
				</button>

				<div class="pp-guided-tour-welcome-badge">
					<!-- Badge placeholder - will be replaced with actual badge component -->
					<div class="pp-guided-tour-badge-placeholder">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
							<path d="M24 14L26.5 21H34L28 25.5L30.5 33L24 28.5L17.5 33L20 25.5L14 21H21.5L24 14Z" fill="currentColor"/>
						</svg>
						<span class="pp-guided-tour-badge-progress"><?php echo esc_html( ( $state['step'] ?? 0 ) . '/' . count( $tour['steps'] ) ); ?></span>
					</div>
				</div>

				<div class="pp-guided-tour-welcome-text">
					<h3 class="pp-guided-tour-welcome-title">
						<?php echo esc_html( $current_step['title'] ); ?>
					</h3>
					<p class="pp-guided-tour-welcome-description">
						<?php echo esc_html( $current_step['description'] ); ?>
					</p>

					<?php if ( ! empty( $current_step['cta_hint'] ) ) : ?>
						<p class="pp-guided-tour-welcome-hint">
							<?php echo esc_html( $current_step['cta_hint'] ); ?>
						</p>
					<?php endif; ?>
				</div>

				<div class="pp-guided-tour-welcome-actions">
					<button type="button" class="pp-guided-tour-welcome-skip">
						<?php esc_html_e( 'Skip Tour', 'progress-planner' ); ?>
					</button>
				</div>
			</div>
		</div>
		<?php
	}
}
