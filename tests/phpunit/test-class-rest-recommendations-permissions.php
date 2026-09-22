<?php
/**
 * Test REST permissions for the prpl_recommendations CPT.
 *
 * Regression tests for the 1.10.0 release audit findings S1 and S2:
 *
 * - S1 (HIGH): the CPT inherited default `post` capabilities, so a
 *   Contributor/Author (`edit_posts`) could create, alter, trash and
 *   enumerate recommendations via core REST — including squatting a task
 *   slug to suppress a real recommendation, and injecting attacker-titled
 *   content into every admin's dashboard.
 * - S2 (MEDIUM): any published recommendation was readable anonymously by ID,
 *   leaking pending-update state, draft titles, the active SEO plugin, etc.
 *
 * The fix requires `edit_others_posts` (the plugin's own UI gate) for every
 * read and write operation on the endpoint. Editors and admins keep full
 * access; everyone below is rejected.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Rest_Recommendations_Permissions_Test
 */
class Rest_Recommendations_Permissions_Test extends \WP_UnitTestCase {

	/**
	 * A published recommendation to read/update/delete against.
	 *
	 * @var int
	 */
	private $task_id;

	/**
	 * Set up the REST server and a sample task before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		global $wp_rest_server;
		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$this->task_id = self::factory()->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Perform all updates',
				'post_name'   => 'update-core-202638',
				'post_status' => 'publish',
			]
		);
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
	 * Perform a REST request as a given user and return the response.
	 *
	 * @param int                 $user_id The user to act as (0 = anonymous).
	 * @param string              $method  HTTP method.
	 * @param string              $route   REST route.
	 * @param array<string,mixed> $body The request body params.
	 *
	 * @return \WP_REST_Response
	 */
	private function request_as( $user_id, $method, $route, $body = [] ) {
		\wp_set_current_user( $user_id );
		$request = new \WP_REST_Request( $method, $route );
		if ( ! empty( $body ) ) {
			$request->set_body_params( $body );
		}
		return \rest_do_request( $request );
	}

	/**
	 * Assert that a response is a permission denial.
	 *
	 * @param \WP_REST_Response $response The response.
	 * @param string            $context  A label for the failure message.
	 *
	 * @return void
	 */
	private function assertDenied( $response, $context ) {
		$this->assertContains(
			$response->get_status(),
			[ 401, 403 ],
			"$context should be denied (401/403), got " . $response->get_status()
		);
	}

	/**
	 * Data provider: roles that must NOT be able to touch the endpoint.
	 *
	 * @return array<string,array<int,string>>
	 */
	public function unauthorized_roles() {
		return [
			'subscriber'  => [ 'subscriber' ],
			'contributor' => [ 'contributor' ],
			'author'      => [ 'author' ],
		];
	}

	/**
	 * S2: low-privilege and anonymous users cannot read a single task.
	 *
	 * @dataProvider unauthorized_roles
	 *
	 * @param string $role The role to test.
	 *
	 * @return void
	 */
	public function test_low_priv_cannot_read_single_item( $role ) {
		$user     = self::factory()->user->create( [ 'role' => $role ] );
		$response = $this->request_as( $user, 'GET', '/wp/v2/prpl_recommendations/' . $this->task_id );
		$this->assertDenied( $response, "$role single-item read" );
	}

	/**
	 * S2: anonymous users cannot read a single task.
	 *
	 * @return void
	 */
	public function test_anonymous_cannot_read_single_item() {
		$response = $this->request_as( 0, 'GET', '/wp/v2/prpl_recommendations/' . $this->task_id );
		$this->assertDenied( $response, 'anonymous single-item read' );
	}

	/**
	 * S2: low-privilege and anonymous users cannot read the collection.
	 *
	 * @dataProvider unauthorized_roles
	 *
	 * @param string $role The role to test.
	 *
	 * @return void
	 */
	public function test_low_priv_cannot_read_collection( $role ) {
		$user     = self::factory()->user->create( [ 'role' => $role ] );
		$response = $this->request_as( $user, 'GET', '/wp/v2/prpl_recommendations' );
		$this->assertDenied( $response, "$role collection read" );
	}

	/**
	 * S1: low-privilege users cannot create a task (including slug squatting).
	 *
	 * @dataProvider unauthorized_roles
	 *
	 * @param string $role The role to test.
	 *
	 * @return void
	 */
	public function test_low_priv_cannot_create( $role ) {
		$user     = self::factory()->user->create( [ 'role' => $role ] );
		$response = $this->request_as(
			$user,
			'POST',
			'/wp/v2/prpl_recommendations',
			[
				'title'  => 'squat',
				'slug'   => 'core-blogdescription',
				'status' => 'trash',
			]
		);
		$this->assertDenied( $response, "$role create" );
	}

	/**
	 * S1: low-privilege users cannot delete an existing task.
	 *
	 * @dataProvider unauthorized_roles
	 *
	 * @param string $role The role to test.
	 *
	 * @return void
	 */
	public function test_low_priv_cannot_delete( $role ) {
		$user     = self::factory()->user->create( [ 'role' => $role ] );
		$response = $this->request_as( $user, 'DELETE', '/wp/v2/prpl_recommendations/' . $this->task_id );
		$this->assertDenied( $response, "$role delete" );
	}

	/**
	 * S1: low-privilege users cannot update an existing task.
	 *
	 * @dataProvider unauthorized_roles
	 *
	 * @param string $role The role to test.
	 *
	 * @return void
	 */
	public function test_low_priv_cannot_update( $role ) {
		$user     = self::factory()->user->create( [ 'role' => $role ] );
		$response = $this->request_as(
			$user,
			'POST',
			'/wp/v2/prpl_recommendations/' . $this->task_id,
			[ 'status' => 'trash' ]
		);
		$this->assertDenied( $response, "$role update" );
	}

	/**
	 * Legitimate flow: an Editor (the widget audience) CAN read tasks.
	 *
	 * @return void
	 */
	public function test_editor_can_read() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );

		$single = $this->request_as( $editor, 'GET', '/wp/v2/prpl_recommendations/' . $this->task_id );
		$this->assertSame( 200, $single->get_status(), 'editor single-item read should be allowed' );

		$collection = $this->request_as( $editor, 'GET', '/wp/v2/prpl_recommendations' );
		$this->assertSame( 200, $collection->get_status(), 'editor collection read should be allowed' );
	}

	/**
	 * Legitimate flow: an Editor CAN create and delete their own `user` task,
	 * exactly as the to-do widget does.
	 *
	 * @return void
	 */
	public function test_editor_can_create_and_delete_own_task() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );

		// The tasks widget creates a user-provider task as the logged-in
		// Editor; creation must stay allowed after the fix.
		$create = $this->request_as(
			$editor,
			'POST',
			'/wp/v2/prpl_recommendations',
			[
				'title'  => 'My own to-do',
				'status' => 'publish',
			]
		);
		$this->assertSame( 201, $create->get_status(), 'editor create should be allowed' );
		$new_id = $create->get_data()['id'];

		$delete = $this->request_as( $editor, 'DELETE', '/wp/v2/prpl_recommendations/' . $new_id, [ 'force' => true ] );
		$this->assertSame( 200, $delete->get_status(), 'editor delete of own task should be allowed' );
	}

	/**
	 * Legitimate flow: an Editor CAN assign the provider taxonomy term, which
	 * the tightened `assign_terms` capability must not block.
	 *
	 * @return void
	 */
	public function test_editor_can_assign_provider_term() {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor );

		$post_id = self::factory()->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
			]
		);
		$term    = \wp_insert_term( 'user-flow', 'prpl_recommendations_provider' );
		$this->assertNotWPError( $term, 'term creation should succeed for editor' );

		$result = \wp_set_object_terms( $post_id, [ (int) $term['term_id'] ], 'prpl_recommendations_provider' );
		$this->assertNotWPError( $result, 'editor should be able to assign the provider term' );
		$this->assertNotEmpty( $result );
	}

	/**
	 * Legitimate flow: an admin retains full access.
	 *
	 * @return void
	 */
	public function test_admin_can_read_and_write() {
		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );

		$read = $this->request_as( $admin, 'GET', '/wp/v2/prpl_recommendations/' . $this->task_id );
		$this->assertSame( 200, $read->get_status(), 'admin read should be allowed' );

		$update = $this->request_as(
			$admin,
			'POST',
			'/wp/v2/prpl_recommendations/' . $this->task_id,
			[ 'status' => 'trash' ]
		);
		$this->assertSame( 200, $update->get_status(), 'admin update should be allowed' );
	}

	/**
	 * The CPT's mapped capabilities block non-REST write paths too (XML-RPC,
	 * block editor). Contributors/Authors cannot create; Editors/admins can.
	 * This closes the slug-squat that the REST permission checks alone left
	 * open through wp.newPost (audit S1, review gap 1).
	 *
	 * @return void
	 */
	public function test_cpt_create_capability_is_gated() {
		$create_cap = \get_post_type_object( 'prpl_recommendations' )->cap->create_posts;
		$this->assertSame( 'edit_others_posts', $create_cap, 'create cap must be mapped to edit_others_posts' );

		foreach ( [ 'subscriber', 'contributor', 'author' ] as $role ) {
			$user = self::factory()->user->create( [ 'role' => $role ] );
			\wp_set_current_user( $user );
			$this->assertFalse(
				\current_user_can( $create_cap ),
				"$role must not be able to create recommendations (any write path)"
			);
		}

		foreach ( [ 'editor', 'administrator' ] as $role ) {
			$user = self::factory()->user->create( [ 'role' => $role ] );
			\wp_set_current_user( $user );
			$this->assertTrue(
				\current_user_can( $create_cap ),
				"$role must still be able to create recommendations"
			);
		}
	}

	/**
	 * Internal task injection is unaffected by the mapped capabilities: it uses
	 * raw wp_insert_post(), which does not check caps. Even a Subscriber's
	 * request can inject a task server-side.
	 *
	 * @return void
	 */
	public function test_internal_injection_ignores_capabilities() {
		$subscriber = self::factory()->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber );

		$id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'core-siteicon',
				'post_title'  => 'Set site icon',
				'post_status' => 'publish',
				'provider_id' => 'core-siteicon',
			]
		);

		$this->assertIsInt( $id );
		$this->assertGreaterThan( 0, $id, 'internal add() must work regardless of the current user caps' );
	}
}
