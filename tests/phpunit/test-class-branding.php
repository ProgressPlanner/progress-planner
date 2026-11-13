<?php
/**
 * Tests for loading a brand from the branding server and applying it.
 *
 * The brand document is mocked with `pre_http_request`, so no test talks to
 * branding.your.online. The branded cases pick a brand with the
 * `pp_branding_id` preview param, which administrators may use.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\UI\Branding;

/**
 * Branding tests.
 */
class Branding_Test extends \WP_UnitTestCase {

	/**
	 * Brand ID used for the branded cases.
	 *
	 * @var int
	 */
	const BRAND_ID = 7401;

	/**
	 * The brand document the mocked server returns.
	 *
	 * @var array<string, mixed>
	 */
	const BRAND = [
		'format'              => 1,
		'css'                 => ':root{--prpl-color-monthly:#46ECD5;--prpl-color-gradient-start:#08DF76;}',
		'logo'                => 'https://example.org/gandi/logo.svg',
		'admin_menu'          => [
			'name'    => 'Gandi',
			'submenu' => 'Recommendations',
		],
		'assistant_name'      => 'Gigi',
		'widgets'             => [ 'monthly-badges', 'todo' ],
		'widget_titles'       => [ 'todo' => 'My tasks' ],
		'links'               => [ 'https://progressplanner.com/about' => 'https://example.org/about' ],
		'recommended_plugins' => [ 'seo' => 'seo-by-rank-math' ],
	];

	/**
	 * Requests the mocked server answered, by URL.
	 *
	 * @var array<string, int>
	 */
	private $requests = [];

	/**
	 * What the mocked server answers: a brand array, a WP_Error, an HTTP status
	 * code, or a raw string body.
	 *
	 * @var mixed
	 */
	private $answer;

	/**
	 * Mock the branding server.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->requests = [];
		$this->answer   = self::BRAND;
		\progress_planner()->get_utils__cache()->delete_all();
		\add_filter( 'pre_http_request', [ $this, 'mock_branding_server' ], 10, 3 );
	}

	/**
	 * Remove the mock, the preview param, the user and the cached responses.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		\remove_filter( 'pre_http_request', [ $this, 'mock_branding_server' ], 10 );
		unset( $_GET['pp_branding_id'], $_GET['_pp_branding_nonce'] );
		\wp_set_current_user( 0 );
		\progress_planner()->get_utils__cache()->delete_all();
		parent::tearDown();
	}

	/**
	 * Answer requests to the branding server; leave every other request alone.
	 *
	 * @param false|array|\WP_Error $preempt Whether to preempt the request.
	 * @param array                 $args    Request arguments.
	 * @param string                $url     Request URL.
	 *
	 * @return false|array|\WP_Error
	 */
	public function mock_branding_server( $preempt, $args, $url ) {
		if ( ! \str_starts_with( $url, \progress_planner()->get_branding_server_url() . '/v1/brands/' ) ) {
			return $preempt;
		}

		$this->requests[ $url ] = ( $this->requests[ $url ] ?? 0 ) + 1;

		if ( $this->answer instanceof \WP_Error ) {
			return $this->answer;
		}
		if ( \is_int( $this->answer ) ) {
			return [
				'response' => [ 'code' => $this->answer ],
				'body'     => '',
			];
		}

		return [
			'response' => [ 'code' => 200 ],
			'body'     => \is_string( $this->answer ) ? $this->answer : \wp_json_encode( $this->answer ),
		];
	}

	/**
	 * Use the test brand for this request, as an administrator.
	 *
	 * @return void
	 */
	private function use_brand(): void {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$_GET['pp_branding_id']     = (string) self::BRAND_ID;
		$_GET['_pp_branding_nonce'] = \wp_create_nonce( 'pp_branding_preview_' . self::BRAND_ID );
	}

	/**
	 * URL of the test brand's document.
	 *
	 * @return string
	 */
	private function brand_url(): string {
		return \progress_planner()->get_branding_server_url() . '/v1/brands/' . self::BRAND_ID . '.json';
	}

	/**
	 * Without a branding ID, the plugin's own defaults apply and the brand
	 * document is never requested.
	 *
	 * @return void
	 */
	public function test_unbranded_site_uses_plugin_defaults() {
		$branding = new Branding();

		$this->assertSame( 0, $branding->get_branding_id() );
		$this->assertSame( [], $branding->get_api_data() );
		$this->assertSame( '', $branding->get_custom_css() );
		$this->assertSame( 'Progress Planner', $branding->get_admin_menu_name() );
		$this->assertSame( 'Progress Planner', $branding->get_admin_submenu_name() );
		$this->assertSame( 'Ravi', $branding->get_ravi_name() );
		$this->assertNull( $branding->get_admin_submenu_position() );
		$this->assertSame( 'wordpress-seo', $branding->get_seo_plugin_recommendation_slug() );
		$this->assertSame( [], $this->requests );
	}

	/**
	 * A branded site reads every setting from its brand document.
	 *
	 * @return void
	 */
	public function test_branded_site_reads_its_brand_document() {
		$this->use_brand();
		$branding = new Branding();

		$this->assertSame( self::BRAND_ID, $branding->get_branding_id() );
		$this->assertSame( self::BRAND['css'], $branding->get_custom_css() );
		$this->assertSame( 'Gandi', $branding->get_admin_menu_name() );
		$this->assertSame( 'Recommendations', $branding->get_admin_submenu_name() );
		$this->assertSame( 'Gigi', $branding->get_ravi_name() );
		$this->assertSame( -1000, $branding->get_admin_submenu_position() );
		$this->assertSame( 'My tasks', $branding->get_widget_title( 'todo', 'To-do' ) );
		$this->assertSame( 'Activity', $branding->get_widget_title( 'activity-scores', 'Activity' ) );
		$this->assertSame( 'https://example.org/about', $branding->get_url( 'https://progressplanner.com/about' ) );
		$this->assertSame( 'https://progressplanner.com/other', $branding->get_url( 'https://progressplanner.com/other' ) );
		$this->assertSame( 'seo-by-rank-math', $branding->get_seo_plugin_recommendation_slug() );

		\ob_start();
		$branding->the_logo();
		$this->assertStringContainsString( 'src="https://example.org/gandi/logo.svg"', (string) \ob_get_clean() );

		// All of the above came from one request: the document is cached.
		$this->assertSame( [ $this->brand_url() => 1 ], $this->requests );
	}

	/**
	 * The brand's CSS is attached once per style handle, after the handle's
	 * own stylesheet, so its --prpl-* values override the plugin defaults.
	 *
	 * @return void
	 */
	public function test_brand_css_is_attached_once_per_handle() {
		$this->use_brand();
		$branding = new Branding();
		$handle   = 'prpl-test-branding-' . \wp_generate_password( 6, false );

		\wp_register_style( $handle, 'https://example.org/admin.css', [], '1' );
		$branding->enqueue_inline_css( $handle );
		$branding->enqueue_inline_css( $handle );

		$inline = \wp_styles()->get_data( $handle, 'after' );
		$this->assertSame( [ self::BRAND['css'] ], $inline );
		$this->assertStringContainsString( '--prpl-color-gradient-start:#08DF76', $inline[0] );
	}

	/**
	 * Only the widgets the brand lists are shown.
	 *
	 * @return void
	 */
	public function test_brand_limits_the_widgets() {
		$this->use_brand();
		$branding = new Branding();

		$widgets = [];
		foreach ( [ 'monthly-badges', 'todo', 'activity-scores' ] as $id ) {
			$widgets[] = new class( $id ) {
				/**
				 * Widget ID.
				 *
				 * @var string
				 */
				private $id;

				/**
				 * Constructor.
				 *
				 * @param string $id Widget ID.
				 */
				public function __construct( $id ) {
					$this->id = $id;
				}

				/**
				 * Get the widget ID.
				 *
				 * @return string
				 */
				public function get_id() {
					return $this->id;
				}
			};
		}

		$shown = \array_map( fn( $widget ) => $widget->get_id(), \array_values( $branding->filter_widgets( $widgets ) ) );
		$this->assertSame( [ 'monthly-badges', 'todo' ], $shown );
	}

	/**
	 * When the brand document can't be used, the site falls back to the
	 * plugin defaults instead of breaking.
	 *
	 * @dataProvider unusable_answers
	 *
	 * @param string $answer_type Which unusable answer the server gives.
	 *
	 * @return void
	 */
	public function test_unusable_brand_document_falls_back_to_defaults( $answer_type ) {
		$answers      = [
			'server down'    => new \WP_Error( 'http_request_failed', 'Connection timed out.' ),
			'HTTP 404'       => 404,
			'invalid JSON'   => '{"format":1,',
			'unknown format' => \array_merge( self::BRAND, [ 'format' => 2 ] ),
		];
		$this->answer = $answers[ $answer_type ];
		$this->use_brand();
		$branding = new Branding();

		$this->assertSame( [], $branding->get_api_data() );
		$this->assertSame( '', $branding->get_custom_css() );
		$this->assertSame( 'Progress Planner', $branding->get_admin_menu_name() );
		$this->assertSame( 'Ravi', $branding->get_ravi_name() );

		$handle = 'prpl-test-branding-' . \wp_generate_password( 6, false );
		\wp_register_style( $handle, 'https://example.org/admin.css', [], '1' );
		$branding->enqueue_inline_css( $handle );
		$this->assertFalse( \wp_styles()->get_data( $handle, 'after' ) );
	}

	/**
	 * Answers the branding client must survive.
	 *
	 * @return array<string, array<string>>
	 */
	public static function unusable_answers() {
		return [
			'server down'    => [ 'server down' ],
			'HTTP 404'       => [ 'HTTP 404' ],
			'invalid JSON'   => [ 'invalid JSON' ],
			'unknown format' => [ 'unknown format' ],
		];
	}
}
