<?php
/**
 * Test the per-task provider capability check on the recommendations REST
 * controller.
 *
 * Regression test for 1.10.0 audit S1 / review gap 2: the surface-level
 * `edit_others_posts` gate let an editor read, update or delete ANY task,
 * including admin-only ones such as `update-core` (which needs `update_core`).
 * The controller now also requires the task's own provider capability, mirroring
 * the AJAX handler. Personal `user` to-dos require `edit_others_posts`, so
 * editors can still manage their own.
 *
 * The permission checks are exercised directly (rather than through a full
 * request) to isolate the authorization logic from response preparation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Recommendations_Controller;

/**
 * Class Rest_Recommendations_Provider_Caps_Test
 */
class Rest_Recommendations_Provider_Caps_Test extends \WP_UnitTestCase {

	/**
	 * The controller under test.
	 *
	 * @var \Progress_Planner\Rest\Recommendations_Controller
	 */
	private $controller;

	/**
	 * Set up the controller before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->controller = new Recommendations_Controller( 'prpl_recommendations' );
	}

	/**
	 * Create a published task carrying a given provider term.
	 *
	 * @param string $slug        The post slug.
	 * @param string $provider_id The provider term to assign.
	 *
	 * @return int The post ID.
	 */
	private function make_task( $slug, $provider_id ) {
		$id   = self::factory()->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_name'   => $slug,
				'post_status' => 'publish',
			]
		);
		$term = \get_term_by( 'name', $provider_id, 'prpl_recommendations_provider' );
		if ( ! $term ) {
			$created = \wp_insert_term( $provider_id, 'prpl_recommendations_provider' );
			$term_id = (int) $created['term_id'];
		} else {
			$term_id = (int) $term->term_id;
		}
		\wp_set_object_terms( $id, [ $term_id ], 'prpl_recommendations_provider' );
		return $id;
	}

	/**
	 * Run a permission check for the given verb and return true/false.
	 *
	 * @param int    $user_id The user to act as.
	 * @param string $method  GET, POST (update) or DELETE.
	 * @param int    $post_id The task ID.
	 *
	 * @return bool True if allowed.
	 */
	private function is_allowed( $user_id, $method, $post_id ) {
		\wp_set_current_user( $user_id );
		$request = new \WP_REST_Request( $method, '/wp/v2/prpl_recommendations/' . $post_id );
		$request->set_param( 'id', $post_id );

		switch ( $method ) {
			case 'DELETE':
				$result = $this->controller->delete_item_permissions_check( $request );
				break;
			case 'POST':
				$result = $this->controller->update_item_permissions_check( $request );
				break;
			default:
				$result = $this->controller->get_item_permissions_check( $request );
				break;
		}

		return true === $result;
	}

	/**
	 * An editor can read, update and delete their own `user` to-do.
	 *
	 * @return void
	 */
	public function test_editor_can_manage_user_task() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		$id     = $this->make_task( 'user-todo', 'user' );

		$this->assertTrue( $this->is_allowed( $editor, 'GET', $id ), 'editor GET user task' );
		$this->assertTrue( $this->is_allowed( $editor, 'POST', $id ), 'editor update user task' );
		$this->assertTrue( $this->is_allowed( $editor, 'DELETE', $id ), 'editor delete user task' );
	}

	/**
	 * An editor cannot touch an admin-only task (update-core needs update_core).
	 *
	 * @return void
	 */
	public function test_editor_blocked_from_admin_only_task() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		$id     = $this->make_task( 'update-core-task', 'update-core' );

		$this->assertFalse( $this->is_allowed( $editor, 'GET', $id ), 'editor GET update-core' );
		$this->assertFalse( $this->is_allowed( $editor, 'POST', $id ), 'editor update update-core' );
		$this->assertFalse( $this->is_allowed( $editor, 'DELETE', $id ), 'editor delete update-core' );
	}

	/**
	 * An administrator can manage an admin-only task.
	 *
	 * @return void
	 */
	public function test_admin_can_manage_admin_only_task() {
		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );
		// On multisite, `update_core` is reserved for super admins.
		if ( \is_multisite() ) {
			\grant_super_admin( $admin );
		}
		$id = $this->make_task( 'update-core-task-2', 'update-core' );

		$this->assertTrue( $this->is_allowed( $admin, 'DELETE', $id ), 'admin delete update-core' );
	}
}
