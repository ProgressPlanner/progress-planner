<?php
/**
 * Test prpl_recommendations post type status transitions.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Prpl_Recommendations_Status_Transition_Test
 */
class Prpl_Recommendations_Status_Transition_Test extends \WP_UnitTestCase {

	/**
	 * Test that transitioning prpl_recommendations from future to publish doesn't cause errors.
	 *
	 * @return void
	 */
	public function test_prpl_recommendations_future_to_publish_transition() {
		// Capture any errors that might occur.
		$errors  = [];
		$notices = [];

		// Set up error handlers to capture errors and notices.
		set_error_handler( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
			function ( $errno, $errstr, $errfile, $errline ) use ( &$errors, &$notices ) {
				if ( $errno === E_ERROR || $errno === E_PARSE || $errno === E_CORE_ERROR || $errno === E_COMPILE_ERROR ) {
						$errors[] = [
							'type'    => $errno,
							'message' => $errstr,
							'file'    => $errfile,
							'line'    => $errline,
						];
				} elseif ( $errno === E_NOTICE || $errno === E_WARNING ) {
					$notices[] = [
						'type'    => $errno,
						'message' => $errstr,
						'file'    => $errfile,
						'line'    => $errline,
					];
				}
				return false; // Let PHP handle the error as well.
			}
		);

		// Remove the action that changes the post date to current time, they trigger notices since it is not checked if $post object exists or not.
		\remove_action( 'post_updated', 'wp_check_for_changed_slugs', 12, 3 );
		\remove_action( 'post_updated', 'wp_check_for_changed_dates', 12, 3 );

		try {
			// Create a prpl_recommendations post with future status.
			$post_data = [
				'post_title'   => 'Test Recommendation',
				'post_content' => 'This is a test recommendation content.',
				'post_status'  => 'future',
				'post_type'    => 'prpl_recommendations',
				'post_date'    => gmdate( 'Y-m-d H:i:s', strtotime( '+1 hour' ) ),
			];

			$post_id = wp_insert_post( $post_data );

			// Add required taxonomy terms for the post.
			wp_set_object_terms( $post_id, 'test-category', 'prpl_recommendations_category' );
			wp_set_object_terms( $post_id, 'test-provider', 'prpl_recommendations_provider' );

			// Now publish the post (change status from future to publish).
			$updated_post_data = [
				'ID'            => $post_id,
				'post_status'   => 'publish',
				'post_date'     => gmdate( 'Y-m-d H:i:s' ),
				'post_date_gmt' => gmdate( 'Y-m-d H:i:s' ),
			];

			wp_update_post( $updated_post_data );

		} finally {
			// Restore error handler.
			restore_error_handler();
		}

		// Assert that no PHP errors occurred.
		$this->assertEmpty( $errors, 'No PHP errors should occur during the status transition. Errors found: ' . wp_json_encode( $errors ) );

		// Assert that no PHP notices occurred.
		$this->assertEmpty( $notices, 'No PHP notices should occur during the status transition. Notices found: ' . wp_json_encode( $notices ) );
	}

	/**
	 * Clean up after tests.
	 */
	public function tearDown(): void {
		// Clean up any posts created during tests.
		$posts = get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'any',
				'numberposts' => -1,
			]
		);

		foreach ( $posts as $post ) {
			wp_delete_post( $post->ID, true );
		}

		parent::tearDown();
	}
}
