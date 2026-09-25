<?php
/**
 * Test the create-side gate on the recommendations REST controller and the
 * provider-aware suppression guard in Suggested_Tasks_DB::add().
 *
 * Regression test for the 1.10.0 audit S1 / review gap 2 (create half): an
 * Editor could create a task carrying an admin-only task's slug (or a non-user
 * provider term), which `Suggested_Tasks_DB::add()` then treated as the real
 * task already existing — silently suppressing it. The fix limits non-admins
 * to their own `user` to-dos on create, and makes `add()` match the provider,
 * not just the slug.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Recommendations_Create_Gate_Test
 */
class Recommendations_Create_Gate_Test extends \WP_UnitTestCase {

	/**
	 * Set up the REST server before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		global $wp_rest_server;
		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );
	}

	/**
	 * Tear down the REST server after each test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		global $wp_rest_server;
		$wp_rest_server = null;
		parent::tearDown();
	}

	/**
	 * Get (creating if needed) a provider term id by slug/name.
	 *
	 * @param string $slug The term slug/name.
	 *
	 * @return int
	 */
	private function term_id( $slug ) {
		$term = \get_term_by( 'slug', $slug, 'prpl_recommendations_provider' );
		if ( ! $term ) {
			$term = \get_term_by( 'name', $slug, 'prpl_recommendations_provider' );
		}
		if ( $term ) {
			return (int) $term->term_id;
		}
		$created = \wp_insert_term( $slug, 'prpl_recommendations_provider', [ 'slug' => $slug ] );
		return (int) $created['term_id'];
	}

	/**
	 * The `user` provider term id, created if needed.
	 *
	 * @return int
	 */
	private function user_term_id() {
		return $this->term_id( 'user' );
	}

	/**
	 * Run the create permission check as the given user and return whether it is
	 * allowed. Exercises the controller directly to isolate the authorization
	 * decision from response preparation.
	 *
	 * @param int                  $user_id The user id.
	 * @param array<string, mixed> $body    The request body.
	 *
	 * @return bool True if the create is allowed.
	 */
	private function create_allowed( $user_id, $body ) {
		\wp_set_current_user( $user_id );
		$controller = new \Progress_Planner\Rest\Recommendations_Controller( 'prpl_recommendations' );
		$request    = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );
		$request->set_body_params( $body );
		foreach ( $body as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return true === $controller->create_item_permissions_check( $request );
	}

	/**
	 * An editor cannot create a task with a client-supplied slug (slug squat).
	 *
	 * @return void
	 */
	public function test_editor_cannot_create_with_slug() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		$this->assertFalse(
			$this->create_allowed(
				$editor,
				[
					'title'  => 'squat',
					'slug'   => 'update-core-202601',
					'status' => 'trash',
				]
			),
			'editor slug-squat create must be forbidden'
		);
	}

	/**
	 * An editor cannot create a task under a non-`user` provider term.
	 *
	 * @return void
	 */
	public function test_editor_cannot_create_under_other_provider() {
		$editor   = self::factory()->user->create( [ 'role' => 'editor' ] );
		$other_id = $this->term_id( 'update-core' );
		$this->assertFalse(
			$this->create_allowed(
				$editor,
				[
					'title'                         => 'x',
					'status'                        => 'publish',
					'prpl_recommendations_provider' => [ $other_id ],
				]
			),
			'editor create under non-user provider must be forbidden'
		);
	}

	/**
	 * An editor CAN create their own `user` to-do (widget flow).
	 *
	 * @return void
	 */
	public function test_editor_can_create_user_todo() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		$this->assertTrue(
			$this->create_allowed(
				$editor,
				[
					'title'                         => 'my todo',
					'status'                        => 'publish',
					'prpl_recommendations_provider' => [ $this->user_term_id() ],
				]
			),
			'editor must be able to create their own user to-do'
		);
	}

	/**
	 * An editor CAN create a plain to-do with no provider term and no slug.
	 *
	 * @return void
	 */
	public function test_editor_can_create_plain_todo() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		$this->assertTrue(
			$this->create_allowed(
				$editor,
				[
					'title'  => 'plain',
					'status' => 'publish',
				]
			),
			'editor plain to-do (no provider/slug) should be allowed'
		);
	}

	/**
	 * An administrator is unrestricted on create (may set a slug).
	 *
	 * @return void
	 */
	public function test_admin_can_create_with_slug() {
		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );
		$this->assertTrue(
			$this->create_allowed(
				$admin,
				[
					'title'  => 'x',
					'slug'   => 'admin-chosen-slug',
					'status' => 'publish',
				]
			),
			'admin should be able to create with a slug'
		);
	}

	/**
	 * A slug-squat post under the wrong provider does not suppress the real
	 * task: add() injects the real recommendation anyway.
	 *
	 * @return void
	 */
	public function test_wrong_provider_squat_does_not_suppress() {
		$user_term = $this->user_term_id();

		// Simulate a squat: a trashed post with the target slug but the `user`
		// provider (not `update-core`).
		$squat = self::factory()->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_name'   => 'update-core-x',
				'post_status' => 'trash',
			]
		);
		\wp_set_object_terms( $squat, [ $user_term ], 'prpl_recommendations_provider' );

		$returned = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'update-core-x',
				'post_title'  => 'Perform all updates',
				'post_status' => 'publish',
				'provider_id' => 'update-core',
			]
		);

		$this->assertNotSame( $squat, $returned, 'add() must not return the squat post' );
		$new = \get_post( $returned );
		$this->assertNotNull( $new );
		$this->assertSame( 'publish', $new->post_status, 'the real task must be published, not suppressed' );
		$this->assertTrue(
			\has_term( 'update-core', 'prpl_recommendations_provider', $returned ),
			'the injected task carries its own provider'
		);
	}

	/**
	 * A matching-provider existing task IS deduped (add() returns it, not a
	 * duplicate) — the guard does not break legitimate dedup.
	 *
	 * @return void
	 */
	public function test_matching_provider_task_is_deduped() {
		$tid = $this->term_id( 'core-siteicon' );

		$existing = self::factory()->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_name'   => 'core-siteicon',
				'post_status' => 'trash',
			]
		);
		\wp_set_object_terms( $existing, [ $tid ], 'prpl_recommendations_provider' );

		$returned = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'core-siteicon',
				'post_title'  => 'Set site icon',
				'post_status' => 'publish',
				'provider_id' => 'core-siteicon',
			]
		);

		$this->assertSame( $existing, $returned, 'a matching-provider existing task must be deduped' );
	}
}
