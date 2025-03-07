<?php
/**
 * File that creates a better playground environment for the Progress Planner plugin.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Class Playground
 */
class Playground {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'init', [ $this, 'register_hooks' ], 9 );

		\add_action( 'plugins_loaded', [ $this, 'enable_debug_tools' ], 1 );
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! \get_option( 'progress_planner_license_key', false ) && ! \get_option( 'progress_planner_demo_data_generated', false ) ) {
			$this->generate_data();
			\update_option( 'progress_planner_license_key', str_replace( ' ', '-', $this->create_random_string( 20 ) ) );
			\update_option( 'progress_planner_force_show_onboarding', false );
			\update_option( 'progress_planner_demo_data_generated', true );
		}
		\add_action( 'progress_planner_admin_page_header_before', [ $this, 'show_header_notice' ] );
		\add_action( 'wp_ajax_progress_planner_hide_onboarding', [ $this, 'hide_onboarding' ] );
		\add_action( 'wp_ajax_progress_planner_show_onboarding', [ $this, 'show_onboarding' ] );
	}

	/**
	 * Enable debug tools.
	 *
	 * @return void
	 */
	public function enable_debug_tools() {
		\update_option( 'prpl_debug', true );
	}

	/**
	 * Toggle the onboarding visibility in the Playground environment.
	 *
	 * @param string $action Either 'show' or 'hide'.
	 *
	 * @return void
	 */
	private function toggle_onboarding( $action ) {
		$nonce_action = "progress_planner_{$action}_onboarding";
		\check_ajax_referer( $nonce_action, 'nonce' );

		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_die( \esc_html__( 'You do not have sufficient permissions to access this page.', 'progress-planner' ) );
		}

		if ( $action === 'hide' ) {
			\add_option( 'progress_planner_license_key', str_replace( ' ', '-', $this->create_random_string( 20 ) ) );
			\update_option( 'progress_planner_force_show_onboarding', false );
			$message = \esc_html__( 'Onboarding hidden successfully', 'progress-planner' );
		} else {
			\delete_option( 'progress_planner_license_key' );
			\update_option( 'progress_planner_force_show_onboarding', true );
			$message = \esc_html__( 'Onboarding shown successfully', 'progress-planner' );
		}

		\wp_send_json_success( [ 'message' => $message ] );
	}

	/**
	 * Hide the onboarding in the Playground environment.
	 *
	 * @return void
	 */
	public function hide_onboarding() {
		$this->toggle_onboarding( 'hide' );
	}

	/**
	 * Show the onboarding in the Playground environment.
	 *
	 * @return void
	 */
	public function show_onboarding() {
		$this->toggle_onboarding( 'show' );
	}

	/**
	 * Print an admin notice helping people.
	 *
	 * @return void
	 */
	public function show_header_notice() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing any data.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'progress-planner' ) {
			return;
		}

		$show_onboarding = \get_option( 'progress_planner_force_show_onboarding', false );
		$button_text     = $show_onboarding ? __( 'Hide onboarding', 'progress-planner' ) : __( 'Show onboarding', 'progress-planner' );
		$action          = $show_onboarding ? 'hide' : 'show';
		$nonce           = \wp_create_nonce( "progress_planner_{$action}_onboarding" );
		?>

		<div class="prpl-widget-wrapper prpl-top-notice" id="prpl-playground-notice">
			<button class="prpl-close-button" onclick="document.getElementById('prpl-playground-notice').remove();">
				<span class="dashicons dashicons-no-alt"></span>
				<span class="screen-reader-text"><?php esc_html_e( 'Close notice', 'progress-planner' ); ?></span>
			</button>

			<div class="inner-content">
				<h1><?php \esc_html_e( 'Progress Planner demo', 'progress-planner' ); ?></h1>

				<button id="progress-planner-toggle-onboarding" class="prpl-button-primary" style="margin-top: 20px; width:250px; float:right;">
					<?php echo \esc_html( $button_text ); ?>
				</button>

				<p style="max-width:680px;">
					<?php \esc_html_e( 'This is a demo of Progress Planner. We\'ve prefilled this site with some content to show you what the reports in Progress Planner look like. We\'ve also added a few to-do\'s for you, you can see these here and on your dashoard.', 'progress-planner' ); ?>
				</p>
				<script>
				document.getElementById( 'progress-planner-toggle-onboarding' ).addEventListener( 'click', function() {
					const request = wp.ajax.post( 'progress_planner_<?php echo \esc_attr( $action ); ?>_onboarding', {
						_ajax_nonce: '<?php echo \esc_attr( $nonce ); ?>',
					} );
					request.done( () => {
						window.location.reload();
					} );
				} );
				</script>
			</div>
		</div>
		<?php
	}

	/**
	 * Generate random posts & terms.
	 *
	 * @return void
	 */
	public function generate_data() {
		for ( $i = 0; $i < 24; $i++ ) {
			$this->create_random_post();
		}
		for ( $i = 0; $i < 5; $i++ ) {
			$this->create_random_post( true, 'page' );
		}
		// One post for today.
		$this->create_random_post( false );
	}

	/**
	 * Create a random post.
	 *
	 * @param bool   $random_date Whether to use a random date or not.
	 * @param string $post_type   The post type to create.
	 *
	 * @return int Post ID.
	 */
	private function create_random_post( $random_date = true, $post_type = 'post' ) {
		$postarr = [
			'post_title'   => str_replace( '.', '', $this->create_random_string( 5 ) ),
			'post_content' => $this->create_random_string( wp_rand( 200, 500 ) ),
			'post_status'  => 'publish',
			'post_type'    => $post_type,
			'post_date'    => $this->get_random_date_last_12_months(),
		];

		if ( ! $random_date ) {
			unset( $postarr['post_date'] );
		}
		return \wp_insert_post( $postarr );
	}

	/**
	 * Generate a random date within the last 12 months.
	 *
	 * @return string Random date in 'Y-m-d H:i:s' format.
	 */
	private function get_random_date_last_12_months() {
		// Current time.
		// phpcs:ignore WordPress.DateTime.CurrentTimeTimestamp.Requested -- This works fine for these purposes.
		$now = \current_time( 'timestamp' );

		// Timestamp for 12 months ago.
		$last_year = strtotime( '-12 months', $now );

		// Generate a random timestamp between last year and now.
		$random_timestamp = wp_rand( $last_year, $now );

		// Format the random timestamp as a MySQL datetime string.
		return gmdate( 'Y-m-d H:i:s', $random_timestamp );
	}

	/**
	 * Create a random string of content consisting of sentences.
	 *
	 * @param int $length Number of words in total to create across all sentences.
	 *
	 * @return string Random string of sentences.
	 */
	private function create_random_string( $length ) {
		$words = [ 'the', 'and', 'have', 'that', 'for', 'you', 'with', 'say', 'this', 'they', 'but', 'his', 'from', 'not', 'she', 'as', 'what', 'their', 'can', 'who', 'get', 'would', 'her', 'all', 'make', 'about', 'know', 'will', 'one', 'time', 'there', 'year', 'think', 'when', 'which', 'them', 'some', 'people', 'take', 'out', 'into', 'just', 'see', 'him', 'your', 'come', 'could', 'now', 'than', 'like', 'other', 'how', 'then', 'its', 'our', 'two', 'more', 'these', 'want', 'way', 'look', 'first', 'also', 'new', 'because', 'day', 'use', 'man', 'find', 'here', 'thing', 'give', 'many', 'well', 'only', 'those', 'tell', 'very', 'even', 'back', 'any', 'good', 'woman', 'through', 'life', 'child', 'work', 'down', 'may', 'after', 'should', 'call', 'world', 'over', 'school', 'still', 'try', 'last', 'ask', 'need' ];

		$sentences       = '';
		$words_remaining = $length;

		while ( $words_remaining > 0 ) {
			// Randomly decide the length of the current sentence (between 8 and 12 words).
			$sentence_length  = min( wp_rand( 8, 12 ), $words_remaining );
			$words_remaining -= $sentence_length;

			// Select random words for the sentence.
			$word_keys = array_rand( $words, $sentence_length );
			$sentence  = '';

			foreach ( (array) $word_keys as $key ) {
					$sentence .= $words[ $key ] . ' ';
			}

			// Capitalize the first word and add a period at the end.
			$sentences .= ucfirst( trim( $sentence ) ) . '. ';
		}

		return trim( $sentences );
	}
}
