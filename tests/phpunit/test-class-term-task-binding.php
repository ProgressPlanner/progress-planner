<?php
/**
 * Tests for term task request binding.
 *
 * The term interactive tasks act on a term_id/taxonomy pair taken from the
 * request. These tests cover that the handlers only act on terms that a task
 * from the same provider actually suggested, so they cannot be repurposed to
 * delete or edit arbitrary terms.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Remove_Terms_Without_Posts;
use Progress_Planner\Suggested_Tasks\Providers\Update_Term_Description;

/**
 * Term task binding test case.
 */
class Term_Task_Binding_Test extends \WP_Ajax_UnitTestCase {

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();

		// The term tasks require edit_others_posts (editor level).
		$this->_setRole( 'editor' );
	}

	/**
	 * Clean up.
	 */
	public function tear_down() {
		unset( $_REQUEST['term_id'], $_REQUEST['taxonomy'], $_REQUEST['description'], $_REQUEST['nonce'] );
		$_POST = [];
		parent::tear_down();
	}

	/**
	 * Populate the request with a signed payload.
	 *
	 * @param int    $term_id     The term ID.
	 * @param string $taxonomy    The taxonomy.
	 * @param string $description Optional description.
	 *
	 * @return void
	 */
	private function set_request( $term_id, $taxonomy, $description = null ) {
		$_REQUEST['term_id']  = $term_id;
		$_REQUEST['taxonomy'] = $taxonomy;
		$_REQUEST['nonce']    = \wp_create_nonce( 'progress_planner' );

		if ( null !== $description ) {
			$_REQUEST['description'] = $description;
		}

		// The handlers read from $_POST; check_ajax_referer reads $_REQUEST.
		$_POST = $_REQUEST;
	}

	/**
	 * Run a handler and return the decoded JSON response.
	 *
	 * @param object $provider The task provider.
	 *
	 * @return array|null The decoded response.
	 */
	private function get_response( $provider ) {
		// WordPress Core's _handleAjax() starts output buffering before calling
		// AJAX actions. We do the same since we call the method directly.
		\ini_set( 'implicit_flush', false ); // phpcs:ignore WordPress.PHP.IniSet.Risky
		\ob_start();

		try {
			$provider->handle_interactive_task_submit();
		} catch ( \WPAjaxDieContinueException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Expected: wp_send_json_* calls wp_die().
		}

		return \json_decode( $this->_last_response, true );
	}

	/**
	 * Create a task from a provider that targets a specific term.
	 *
	 * @param object $provider The task provider.
	 * @param int    $term_id  The term ID.
	 * @param string $taxonomy The taxonomy.
	 *
	 * @return void
	 */
	private function create_task_for_term( $provider, $term_id, $taxonomy ) {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'      => 'Term task',
				'provider_id'     => $provider->get_provider_id(),
				'target_term_id'  => $term_id,
				'target_taxonomy' => $taxonomy,
			]
		);
	}

	/**
	 * An Editor cannot delete an unrelated term that no task suggested.
	 *
	 * This is the privilege-escalation case: wp_delete_term() performs no
	 * capability check of its own, so without binding an Editor could delete
	 * any term in any taxonomy.
	 *
	 * @return void
	 */
	public function test_delete_rejects_term_without_matching_task() {
		$term_id = $this->factory->term->create( [ 'taxonomy' => 'category' ] );

		$this->set_request( $term_id, 'category' );
		$response = $this->get_response( new Remove_Terms_Without_Posts() );

		$this->assertFalse( $response['success'], 'Deletion should be rejected.' );

		$term = \get_term( $term_id, 'category' );
		$this->assertFalse( \is_wp_error( $term ), 'Term should not have been deleted.' );
		$this->assertNotNull( $term, 'Term should not have been deleted.' );
	}

	/**
	 * An Editor cannot rewrite the description of a term no task suggested.
	 *
	 * @return void
	 */
	public function test_update_description_rejects_term_without_matching_task() {
		$term_id = $this->factory->term->create(
			[
				'taxonomy'    => 'category',
				'description' => 'Original description.',
			]
		);

		$this->set_request( $term_id, 'category', 'Injected description.' );
		$response = $this->get_response( new Update_Term_Description() );

		$this->assertFalse( $response['success'], 'Update should be rejected.' );

		$term = \get_term( $term_id, 'category' );
		$this->assertSame( 'Original description.', $term->description, 'Description should be unchanged.' );
	}

	/**
	 * A non-public taxonomy is rejected even when a task exists for the term.
	 *
	 * @return void
	 */
	public function test_delete_rejects_non_public_taxonomy() {
		\register_taxonomy( 'prpl_private_tax', 'post', [ 'public' => false ] );
		$term_id = $this->factory->term->create( [ 'taxonomy' => 'prpl_private_tax' ] );

		$provider = new Remove_Terms_Without_Posts();
		$this->create_task_for_term( $provider, $term_id, 'prpl_private_tax' );

		$this->set_request( $term_id, 'prpl_private_tax' );
		$response = $this->get_response( $provider );

		$this->assertFalse( $response['success'], 'Non-public taxonomy should be rejected.' );
		$this->assertFalse( \is_wp_error( \get_term( $term_id, 'prpl_private_tax' ) ), 'Term should not have been deleted.' );

		\unregister_taxonomy( 'prpl_private_tax' );
	}

	/**
	 * A term that a task legitimately suggested can still be deleted.
	 *
	 * Guards against the binding being too strict and breaking the feature.
	 *
	 * @return void
	 */
	public function test_delete_allows_term_suggested_by_a_task() {
		$term_id = $this->factory->term->create( [ 'taxonomy' => 'category' ] );

		$provider = new Remove_Terms_Without_Posts();
		$this->create_task_for_term( $provider, $term_id, 'category' );

		$this->set_request( $term_id, 'category' );
		$response = $this->get_response( $provider );

		$this->assertTrue( $response['success'], 'Deletion of a suggested term should succeed.' );

		$term = \get_term( $term_id, 'category' );
		$this->assertTrue( null === $term || \is_wp_error( $term ), 'Term should have been deleted.' );
	}

	/**
	 * A description update for a legitimately suggested term still works.
	 *
	 * @return void
	 */
	public function test_update_description_allows_term_suggested_by_a_task() {
		$term_id = $this->factory->term->create(
			[
				'taxonomy'    => 'category',
				'description' => 'Original description.',
			]
		);

		$provider = new Update_Term_Description();
		$this->create_task_for_term( $provider, $term_id, 'category' );

		$this->set_request( $term_id, 'category', 'A better description.' );
		$response = $this->get_response( $provider );

		$this->assertTrue( $response['success'], 'Update of a suggested term should succeed.' );

		$term = \get_term( $term_id, 'category' );
		$this->assertSame( 'A better description.', $term->description, 'Description should have been updated.' );
	}

	/**
	 * A suggested term that has since gained posts is not deleted.
	 *
	 * @return void
	 */
	public function test_delete_rejects_suggested_term_that_gained_posts() {
		$term_id = $this->factory->term->create( [ 'taxonomy' => 'category' ] );

		$provider = new Remove_Terms_Without_Posts();
		$this->create_task_for_term( $provider, $term_id, 'category' );

		// Give the term enough posts to exceed MIN_POSTS.
		foreach ( [ 1, 2 ] as $ignored ) {
			$post_id = $this->factory->post->create();
			\wp_set_object_terms( $post_id, [ $term_id ], 'category', true );
		}

		$this->set_request( $term_id, 'category' );
		$response = $this->get_response( $provider );

		$this->assertFalse( $response['success'], 'A term with posts should not be deleted.' );
		$this->assertFalse( \is_wp_error( \get_term( $term_id, 'category' ) ), 'Term should not have been deleted.' );
	}
}
