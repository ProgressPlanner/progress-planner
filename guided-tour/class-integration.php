<?php
/**
 * Guided Tour Integration
 *
 * Shows how to integrate the guided tour system into Progress Planner.
 * This is for hosting partner installations, distinct from the plugin onboarding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Guided_Tour;

// Prevent direct access.
defined( 'ABSPATH' ) || exit;

/**
 * Initialize the guided tour system.
 *
 * Call this from your main plugin file, e.g.:
 * add_action( 'plugins_loaded', [ 'Progress_Planner\Guided_Tour\Integration', 'init' ] );
 */
class Integration {

	/**
	 * Guided tour instance.
	 *
	 * @var Guided_Tour
	 */
	private static ?Guided_Tour $tour = null;

	/**
	 * Tour launcher instance.
	 *
	 * @var Tour_Launcher
	 */
	private static ?Tour_Launcher $launcher = null;

	/**
	 * Initialize the guided tour system.
	 */
	public static function init(): void {
		// Load classes.
		require_once __DIR__ . '/class-guided-tour.php';
		require_once __DIR__ . '/class-tour-launcher.php';

		// Create instances.
		self::$tour     = new Guided_Tour();
		self::$launcher = new Tour_Launcher( self::$tour );

		// Register hooks.
		self::$tour->init();

		// Add AJAX handler for dismissing tour prompts.
		add_action( 'wp_ajax_pp_dismiss_guided_tour_prompt', [ __CLASS__, 'ajax_dismiss_prompt' ] );

		// Add tour launcher to dashboard widget.
		add_action( 'progress_planner_dashboard_sidebar', [ __CLASS__, 'render_dashboard_launcher' ] );

		// Maybe show first-time user prompt.
		add_action( 'admin_notices', [ __CLASS__, 'maybe_show_first_time_prompt' ] );

		// Auto-start tour for new installations.
		add_action( 'progress_planner_activated', [ __CLASS__, 'maybe_auto_start_tour' ] );
	}

	/**
	 * Get the tour instance.
	 *
	 * @return Guided_Tour Tour instance.
	 */
	public static function get_tour(): Guided_Tour {
		return self::$tour;
	}

	/**
	 * Get the launcher instance.
	 *
	 * @return Tour_Launcher Launcher instance.
	 */
	public static function get_launcher(): Tour_Launcher {
		return self::$launcher;
	}

	/**
	 * Render tour launcher in dashboard sidebar.
	 */
	public static function render_dashboard_launcher(): void {
		if ( ! self::$launcher ) {
			return;
		}

		self::$launcher->render(
			[
				'title'       => __( 'Guided Tours', 'progress-planner' ),
				'description' => __( 'Learn Progress Planner with interactive walkthroughs.', 'progress-planner' ),
			]
		);
	}

	/**
	 * Show prompt for first-time users on Progress Planner pages.
	 */
	public static function maybe_show_first_time_prompt(): void {
		if ( ! self::$launcher ) {
			return;
		}

		// Only on Progress Planner pages.
		$screen = get_current_screen();
		if ( ! $screen || ! str_contains( $screen->id, 'progress-planner' ) ) {
			return;
		}

		// Show first-time setup tour prompt.
		self::$launcher->maybe_show_prompt(
			'first-time-setup',
			[
				'title'       => __( 'Welcome to Progress Planner!', 'progress-planner' ),
				'description' => __( 'Take a quick tour to learn how to get the most out of your new tool.', 'progress-planner' ),
			]
		);
	}

	/**
	 * Maybe auto-start the hosting setup tour for new installations.
	 */
	public static function maybe_auto_start_tour(): void {
		if ( ! self::$tour ) {
			return;
		}

		// Check if this is a hosting partner installation.
		$is_hosting_install = apply_filters( 'progress_planner_is_hosting_install', false );

		if ( $is_hosting_install ) {
			// Start the hosting setup tour automatically.
			self::$tour->start_tour( 'hosting-setup' );
		}
	}

	/**
	 * AJAX handler for dismissing tour prompts.
	 */
	public static function ajax_dismiss_prompt(): void {
		check_ajax_referer( 'pp_dismiss_guided_tour_prompt', 'nonce' );

		$tour_id = isset( $_POST['tour_id'] ) ? sanitize_key( $_POST['tour_id'] ) : '';

		if ( $tour_id ) {
			update_user_meta(
				get_current_user_id(),
				'pp_guided_tour_prompt_dismissed_' . $tour_id,
				true
			);
		}

		wp_send_json_success();
	}

	/**
	 * Programmatically start a tour.
	 *
	 * Useful for triggering tours from other parts of the plugin.
	 *
	 * @param string $tour_id Tour identifier.
	 * @return bool Success.
	 */
	public static function start_tour( string $tour_id ): bool {
		if ( ! self::$tour ) {
			return false;
		}

		$result = self::$tour->start_tour( $tour_id );
		return false !== $result;
	}

	/**
	 * Check if a tour has been completed.
	 *
	 * @param string $tour_id Tour identifier.
	 * @return bool True if completed.
	 */
	public static function is_tour_completed( string $tour_id ): bool {
		if ( ! self::$tour ) {
			return false;
		}

		$state = self::$tour->get_state();
		return in_array( $tour_id, $state['completed'] ?? [], true );
	}

	/**
	 * Reset a tour so it can be taken again.
	 *
	 * @param string $tour_id Tour identifier.
	 * @return bool Success.
	 */
	public static function reset_tour( string $tour_id ): bool {
		if ( ! self::$tour ) {
			return false;
		}

		$state = self::$tour->get_state();

		// Remove from completed list.
		$state['completed'] = array_filter(
			$state['completed'] ?? [],
			fn( $id ) => $id !== $tour_id
		);

		// Clear dismissed prompt.
		delete_user_meta( get_current_user_id(), 'pp_guided_tour_prompt_dismissed_' . $tour_id );

		return self::$tour->update_state( $state );
	}
}

/*
 * ==========================================================================
 * USAGE EXAMPLES
 * ==========================================================================
 *
 * 1. Initialize in main plugin file:
 * ----------------------------------
 *
 *     add_action( 'plugins_loaded', [ 'Progress_Planner\Guided_Tour\Integration', 'init' ] );
 *
 *
 * 2. Render tour launcher widget anywhere:
 * ----------------------------------------
 *
 *     $launcher = Progress_Planner\Guided_Tour\Integration::get_launcher();
 *     $launcher->render();
 *
 *
 * 3. Render a single tour button:
 * -------------------------------
 *
 *     $launcher = Progress_Planner\Guided_Tour\Integration::get_launcher();
 *     $launcher->render_button( 'hosting-setup', [
 *         'text'  => 'Setup Hosting Integration',
 *         'class' => 'button button-primary button-hero',
 *     ] );
 *
 *
 * 4. Programmatically start a tour:
 * ---------------------------------
 *
 *     Progress_Planner\Guided_Tour\Integration::start_tour( 'hosting-setup' );
 *
 *
 * 5. Check if user completed a tour:
 * ----------------------------------
 *
 *     if ( ! Progress_Planner\Guided_Tour\Integration::is_tour_completed( 'first-time-setup' ) ) {
 *         // Show guided tour prompt
 *     }
 *
 *
 * 6. Add custom tour via filter:
 * ------------------------------
 *
 *     add_filter( 'progress_planner_guided_tours', function( $tours ) {
 *         $tours['my-custom-tour'] = [
 *             'id'          => 'my-custom-tour',
 *             'title'       => 'Custom Feature Tour',
 *             'description' => 'Learn about this custom feature.',
 *             'steps'       => [
 *                 [
 *                     'page'        => 'admin.php?page=progress-planner',
 *                     'element'     => '.my-feature-element',
 *                     'title'       => 'Step 1',
 *                     'description' => 'This is the first step.',
 *                     'side'        => 'bottom',
 *                 ],
 *                 // ... more steps
 *             ],
 *         ];
 *         return $tours;
 *     } );
 *
 *
 * 7. Start tour on hosting partner installs:
 * ------------------------------------------
 *
 *     add_filter( 'progress_planner_is_hosting_install', function( $is_hosting ) {
 *         // Check for hosting-specific constant or option
 *         return defined( 'HOSTING_PARTNER_INSTALL' ) && HOSTING_PARTNER_INSTALL;
 *     } );
 *
 */
