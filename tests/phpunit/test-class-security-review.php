<?php
/**
 * Regression coverage for the security review follow-up.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Exercise security boundaries through WordPress REST, HTTP and AJAX APIs.
 */
class Security_Review_Test extends \WP_UnitTestCase {

	/**
	 * An administrator for authenticated test requests.
	 *
	 * @var int
	 */
	private $admin;

	/**
	 * An editor for permission tests.
	 *
	 * @var int
	 */
	private $editor;

	/**
	 * Initialize the request environment.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->admin  = \wp_insert_user(
			[
				'user_login' => \wp_generate_uuid4(),
				'user_pass'  => 'fixture',
				'role'       => 'administrator',
			]
		);
		$this->editor = \wp_insert_user(
			[
				'user_login' => \wp_generate_uuid4(),
				'user_pass'  => 'fixture',
				'role'       => 'editor',
			]
		);
		\wp_set_current_user( $this->admin );
		$_SERVER['REMOTE_ADDR'] = '192.0.2.10';
		\delete_transient( 'prpl_api_rate_limit_' . \md5( '192.0.2.10' ) );
		global $wp_rest_server;
		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );
	}

	/**
	 * Reset request state.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		unset( $_GET['pp_branding_id'], $_GET['_pp_branding_nonce'], $_GET['range'], $_GET['frequency'] );
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'], $_SERVER['HTTP_X_FORWARDED_FOR'], $_SERVER['HTTP_X_REAL_IP'], $_SERVER['REMOTE_ADDR'] );
		$_POST    = [];
		$_REQUEST = [];
		\wp_set_current_user( 0 );
		parent::tearDown();
	}

	/**
	 * Forwarded headers cannot reset the rate limit or create extra counters.
	 *
	 * @return void
	 */
	public function test_spoofed_headers_cannot_bypass_rate_limit() {
		\update_option( 'progress_planner_license_key', 'fixture-license' );
		$api = new \Progress_Planner\Rest\Tasks();
		for ( $i = 0; $i < 11; ++$i ) {
			$_SERVER['HTTP_CF_CONNECTING_IP'] = '198.51.100.' . $i;
			$_SERVER['HTTP_X_FORWARDED_FOR']  = '198.51.100.' . $i;
			$_SERVER['HTTP_X_REAL_IP']        = '198.51.100.' . $i;
			$this->assertFalse( $api->validate_token( 'incorrect' ) );
			$this->assertFalse( \get_transient( 'prpl_api_rate_limit_' . \md5( '198.51.100.' . $i ) ) );
		}
		$this->assertSame( 10, (int) \get_transient( 'prpl_api_rate_limit_' . \md5( '192.0.2.10' ) ) );
		$this->assertFalse( $api->validate_token( 'fixture-license' ) );
	}

	/**
	 * Bearer authentication works without credentials in the URL.
	 *
	 * @return void
	 */
	public function test_bearer_authentication() {
		\update_option( 'progress_planner_license_key', 'fixture-license' );
		\wp_set_current_user( 0 );
		foreach ( [ '/tasks', '/get-stats' ] as $endpoint ) {
			$request = new \WP_REST_Request( 'GET', '/progress-planner/v1' . $endpoint );
			$this->assertSame( 401, \rest_do_request( $request )->get_status() );
			$request->set_header( 'Authorization', 'Bearer fixture-license' );
			$this->assertSame( 200, \rest_do_request( $request )->get_status() );
			$request->set_header( 'Authorization', 'Bearer incorrect' );
			$request->set_param( 'token', 'fixture-license' );
			$this->assertSame( 401, \rest_do_request( $request )->get_status() );
		}
	}

	/**
	 * Legacy URL credentials no longer grant access.
	 *
	 * @return void
	 */
	public function test_url_tokens_are_rejected() {
		\update_option( 'progress_planner_license_key', 'fixture-license' );
		\wp_set_current_user( 0 );
		foreach ( [ '/tasks', '/get-stats' ] as $endpoint ) {
			$request = new \WP_REST_Request( 'GET', '/progress-planner/v1' . $endpoint );
			$request->set_param( 'token', 'fixture-license' );
			$this->assertSame( 401, \rest_do_request( $request )->get_status() );
		}
		$request = new \WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/token/fixture-license' );
		$this->assertSame( 404, \rest_do_request( $request )->get_status() );
	}

	/**
	 * Public lesson and challenge requests never transmit a credential.
	 *
	 * @return void
	 */
	public function test_public_content_requests_omit_license_key() {
		\update_option( 'progress_planner_license_key', 'fixture-license' );
		\progress_planner()->get_utils__cache()->delete_all();
		$requests = [];
		$mock     = function ( $response, $args, $url ) use ( &$requests ) {
			$requests[] = [ $url, $args ];
			return [
				'response' => [ 'code' => 200 ],
				'body'     => '[]',
			];
		};
		\add_filter( 'pre_http_request', $mock, 20, 3 );
		try {
			\progress_planner()->get_lessons()->get_remote_api_items();
			\progress_planner()->get_admin__widgets__challenge()->get_challenge();
		} finally {
			\remove_filter( 'pre_http_request', $mock, 20 );
		}
		$this->assertCount( 2, $requests );
		foreach ( $requests as $request ) {
			$this->assertStringNotContainsString( 'license_key', $request[0] );
			$this->assertStringNotContainsString( 'fixture-license', \wp_json_encode( $request ) );
		}
	}

	/**
	 * Onboarding retries authenticate with the current key without forwarding it on redirects.
	 *
	 * @return void
	 */
	public function test_onboarding_retry_authenticates_existing_registration() {
		$key = \bin2hex( \random_bytes( 32 ) );
		\update_option( 'progress_planner_license_key', $key );
		$mock = function ( $response, $args, $url ) use ( $key ) {
			$this->assertStringNotContainsString( $key, $url );
			$this->assertSame( 'Bearer ' . $key, $args['headers']['Authorization'] );
			$this->assertSame( 0, $args['redirection'] );
			return [
				'response' => [ 'code' => 200 ],
				'body'     => \wp_json_encode(
					[
						'status'      => 'ok',
						'license_key' => $key,
					]
				),
			];
		};
		\add_filter( 'pre_http_request', $mock, 20, 3 );
		try {
			$this->assertSame( $key, \progress_planner()->get_utils__onboard()->make_remote_onboarding_request( [ 'nonce' => 'fixture' ] ) );
		} finally {
			\remove_filter( 'pre_http_request', $mock, 20 );
		}
	}

	/**
	 * A non-admin cannot turn a personal task into an admin recommendation.
	 *
	 * @return void
	 */
	public function test_task_identity_is_immutable_for_editors() {
		$id         = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'user-security-fixture',
				'post_title'  => 'Personal',
				'provider_id' => 'user',
			]
		);
		$controller = new \Progress_Planner\Rest\Recommendations_Controller( 'prpl_recommendations' );
		$request    = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations/' . $id );
		$request->set_param( 'id', $id );
		$request->set_param( 'title', 'Updated personal task' );
		\wp_set_current_user( $this->editor );
		$this->assertTrue( $controller->update_item_permissions_check( $request ) );
		$request->set_param( 'slug', 'update-core' );
		$this->assertInstanceOf( \WP_Error::class, $controller->update_item_permissions_check( $request ) );
		$request->set_param( 'slug', \get_post( $id )->post_name );
		$request->set_param( 'prpl_recommendations_provider', [] );
		$this->assertInstanceOf( \WP_Error::class, $controller->update_item_permissions_check( $request ) );
		$term = \wp_insert_term( 'security-unknown-provider', 'prpl_recommendations_provider' );
		\wp_set_object_terms( $id, [ (int) $term['term_id'] ], 'prpl_recommendations_provider' );
		$this->assertInstanceOf( \WP_Error::class, $controller->update_item_permissions_check( $request ) );
	}

	/**
	 * Unknown AJAX actions cannot dispatch arbitrary extension hooks.
	 *
	 * @return void
	 */
	public function test_unknown_task_actions_are_rejected() {
		$id       = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'user-action-fixture',
				'post_title'  => 'Action fixture',
				'provider_id' => 'user',
			]
		);
		$_POST    = [
			'post_id'     => $id,
			'action_type' => 'unexpected',
		];
		$_REQUEST = [ 'nonce' => \wp_create_nonce( 'progress_planner' ) ];
		$before   = \did_action( 'progress_planner_ajax_task_unexpected' );
		$response = $this->ajax_response( [ \progress_planner()->get_suggested_tasks(), 'suggested_task_action' ] );
		$this->assertFalse( $response['success'] );
		$this->assertSame( $before, \did_action( 'progress_planner_ajax_task_unexpected' ) );
	}

	/**
	 * Remote HTML and SVG cannot introduce active content into the editor.
	 *
	 * @return void
	 */
	public function test_remote_markup_is_sanitized() {
		$lessons = new \Progress_Planner\Lessons();
		$data    = $lessons->sanitize_items(
			[
				'intro' => [
					'text'  => '<p onclick="alert(1)">Read <strong>this</strong></p><script>alert(1)</script>',
					'video' => '<iframe src="https://evil.example/" srcdoc="script" onload="alert(1)"></iframe><iframe src="https://player.vimeo.com/video/123"></iframe>',
				],
				'todos' => [ [ 'todo_description' => '<img src=x onerror="alert(1)">' ] ],
			]
		);
		$this->assertStringContainsString( '<strong>this</strong>', $data['intro']['text'] );
		$this->assertStringNotContainsString( '<script', $data['intro']['text'] );
		$this->assertStringNotContainsString( 'onclick', $data['intro']['text'] );
		$this->assertStringNotContainsString( 'onerror', $data['todos'][0]['todo_description'] );
		$this->assertStringNotContainsString( 'evil.example', $data['intro']['video'] );
		$this->assertStringNotContainsString( 'srcdoc', $data['intro']['video'] );
		$this->assertStringContainsString( 'https://player.vimeo.com/video/123', $data['intro']['video'] );
		$svg = \progress_planner()->get_ui__branding()->sanitize_svg( '<svg onload="alert(1)"><script>alert(1)</script><foreignObject><iframe src="https://evil.example"></iframe></foreignObject><path d="M0 0" fill="#fff"/><path fill="url(https://evil.example)"/></svg>' );
		$this->assertStringNotContainsString( '<script', $svg );
		$this->assertStringNotContainsString( 'onload', $svg );
		$this->assertStringNotContainsString( 'foreignObject', $svg );
		$this->assertStringNotContainsString( 'evil.example', $svg );
		$this->assertStringContainsString( 'fill="#fff"', $svg );
		$this->assertStringContainsString( 'xmlns="http://www.w3.org/2000/svg"', $svg );
	}

	/**
	 * Previously cached branding is sanitized and foreign-host fetches are rejected.
	 *
	 * @return void
	 */
	public function test_cached_branding_is_untrusted() {
		$_GET['pp_branding_id']     = '4958';
		$_GET['_pp_branding_nonce'] = \wp_create_nonce( 'pp_branding_preview_4958' );
		$branding                   = \progress_planner()->get_ui__branding();
		$url                        = \progress_planner()->get_branding_server_url() . '/v1/brands/4958.json';
		\progress_planner()->get_utils__cache()->set(
			\md5( $url ),
			\wp_json_encode(
				[
					'format'        => 1,
					'css'           => 'body{color:red}</style><script>alert(1)</script><style>',
					'admin_menu'    => [
						'name'    => '<img src=x onerror="alert(1)">Menu',
						'submenu' => '<script>alert(1)</script>Submenu',
					],
					'widget_titles' => [ 'fixture' => '<b>Safe</b><img src=x onerror="alert(1)">' ],
				]
			),
			MINUTE_IN_SECONDS
		);
		$this->assertSame( 'body{color:red}', $branding->get_custom_css() );
		$this->assertStringContainsString( '<b>Safe</b>', $branding->get_widget_title( 'fixture' ) );
		$this->assertStringNotContainsString( 'onerror', $branding->get_widget_title( 'fixture' ) );
		$this->assertStringNotContainsString( 'onerror', $branding->get_admin_menu_name() );
		$this->assertStringNotContainsString( '<script', $branding->get_admin_submenu_name() );
		\progress_planner()->get_utils__cache()->set( \md5( 'https://evil.example/icon.svg' ), '<svg/>', MINUTE_IN_SECONDS );
		$this->assertFalse( $branding->get_remote_data( 'https://evil.example/icon.svg' ) );
		$this->assertFalse( $branding->get_remote_data( 'http://127.0.0.1/icon.svg' ) );
	}

	/**
	 * Private page to-dos are editable without appearing in public REST responses.
	 *
	 * @return void
	 */
	public function test_page_todos_are_private_and_editable() {
		$id = \wp_insert_post(
			[
				'post_title'  => 'Public fixture',
				'post_status' => 'publish',
				'post_author' => $this->editor,
			]
		);
		\update_post_meta( $id, 'progress_planner_page_todos', 'private-checklist' );
		\wp_set_current_user( 0 );
		$request = new \WP_REST_Request( 'GET', '/wp/v2/posts/' . $id );
		$data    = \rest_do_request( $request )->get_data();
		$this->assertArrayNotHasKey( 'progress_planner_page_todos', $data );
		$this->assertArrayNotHasKey( 'progress_planner_page_todos', $data['meta'] ?? [] );
		$request->set_param( 'context', 'edit' );
		$this->assertSame( 401, \rest_do_request( $request )->get_status() );
		\wp_set_current_user( $this->editor );
		$data = \rest_do_request( $request )->get_data();
		$this->assertSame( 'private-checklist', $data['progress_planner_page_todos'] );
		$request = new \WP_REST_Request( 'POST', '/wp/v2/posts/' . $id );
		$request->set_param( 'progress_planner_page_todos', 'updated,updated' );
		$this->assertSame( 200, \rest_do_request( $request )->get_status() );
		$this->assertSame( 'updated', \get_post_meta( $id, 'progress_planner_page_todos', true ) );
		\register_post_type(
			'security_fixture',
			[
				'public'       => true,
				'show_in_rest' => true,
				'supports'     => [ 'title' ],
			]
		);
		\progress_planner()->get_page_todos()->init();
		$this->assertFalse( \post_type_supports( 'security_fixture', 'custom-fields' ) );
		\unregister_post_type( 'security_fixture' );
	}

	/**
	 * Editors may assign page types but cannot change the vocabulary or read it anonymously.
	 *
	 * @return void
	 */
	public function test_page_type_permissions() {
		$taxonomy = \Progress_Planner\Page_Types::TAXONOMY_NAME;
		$term     = \wp_insert_term( \wp_generate_uuid4(), $taxonomy );
		$base     = '/wp/v2/' . $taxonomy;
		\wp_set_current_user( 0 );
		$this->assertSame( 401, \rest_do_request( new \WP_REST_Request( 'GET', $base ) )->get_status() );
		$this->assertSame( 401, \rest_do_request( new \WP_REST_Request( 'GET', $base . '/' . $term['term_id'] ) )->get_status() );
		\wp_set_current_user( $this->editor );
		$this->assertSame( 200, \rest_do_request( new \WP_REST_Request( 'GET', $base ) )->get_status() );
		$this->assertFalse( \current_user_can( 'edit_term', $term['term_id'] ) );
		$this->assertFalse( \current_user_can( 'delete_term', $term['term_id'] ) );
		$this->assertTrue( \current_user_can( 'assign_term', $term['term_id'] ) );
	}

	/**
	 * AJAX term actions must respect custom taxonomy capabilities.
	 *
	 * @return void
	 */
	public function test_term_actions_respect_custom_taxonomy_permissions() {
		\register_taxonomy(
			'security_terms',
			'post',
			[
				'public'       => true,
				'capabilities' => [
					'edit_terms'   => 'manage_options',
					'delete_terms' => 'manage_options',
				],
			]
		);
		$term = \wp_insert_term( 'Restricted term', 'security_terms' );
		\wp_set_current_user( $this->editor );
		$_POST    = [
			'term_id'     => $term['term_id'],
			'taxonomy'    => 'security_terms',
			'description' => 'Unauthorized',
		];
		$_REQUEST = [ 'nonce' => \wp_create_nonce( 'progress_planner' ) ];
		foreach ( [ 'Remove_Terms_Without_Posts', 'Update_Term_Description' ] as $name ) {
			$class    = '\\Progress_Planner\\Suggested_Tasks\\Providers\\' . $name;
			$provider = new $class();
			\progress_planner()->get_suggested_tasks_db()->add(
				[
					'task_id'         => $provider->get_provider_id() . '-security-fixture',
					'post_title'      => 'Term fixture',
					'provider_id'     => $provider->get_provider_id(),
					'target_term_id'  => $term['term_id'],
					'target_taxonomy' => 'security_terms',
				]
			);
			$response = $this->ajax_response( [ $provider, 'handle_interactive_task_submit' ] );
			$this->assertFalse( $response['success'] );
			$this->assertStringContainsString( 'permission', $response['data']['message'] );
		}
		$this->assertSame( '', \get_term( $term['term_id'], 'security_terms' )->description );
		\wp_set_current_user( $this->admin );
		$_REQUEST = [ 'nonce' => \wp_create_nonce( 'progress_planner' ) ];
		$provider = new \Progress_Planner\Suggested_Tasks\Providers\Update_Term_Description();
		$response = $this->ajax_response( [ $provider, 'handle_interactive_task_submit' ] );
		$this->assertTrue( $response['success'] );
		$this->assertSame( 'Unauthorized', \get_term( $term['term_id'], 'security_terms' )->description );
		$provider = new \Progress_Planner\Suggested_Tasks\Providers\Remove_Terms_Without_Posts();
		$response = $this->ajax_response( [ $provider, 'handle_interactive_task_submit' ] );
		$this->assertTrue( $response['success'] );
		$this->assertNull( \get_term( $term['term_id'], 'security_terms' ) );
		\unregister_taxonomy( 'security_terms' );
	}

	/**
	 * Capture a WordPress AJAX response without terminating the test process.
	 *
	 * @param callable $callback AJAX callback.
	 * @return array
	 */
	private function ajax_response( $callback ) {
		$die = function () {
			return function () {
				throw new \RuntimeException( 'ajax-finished' );
			};
		};
		\add_filter( 'wp_doing_ajax', '__return_true' );
		\add_filter( 'wp_die_ajax_handler', $die );
		\ob_start();
		try {
			$callback();
		} catch ( \RuntimeException $error ) {
			$this->assertSame( 'ajax-finished', $error->getMessage() );
		} finally {
			$output = \ob_get_clean();
			\remove_filter( 'wp_doing_ajax', '__return_true' );
			\remove_filter( 'wp_die_ajax_handler', $die );
		}
		return \json_decode( $output, true );
	}
}
