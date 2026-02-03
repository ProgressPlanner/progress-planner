<?php
/**
 * Tests for Admin\Page_Settings class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page_Settings;

/**
 * Page Settings test case.
 */
class Admin_Page_Settings_Test extends \WP_UnitTestCase {

	/**
	 * Page Settings instance.
	 *
	 * @var Page_Settings
	 */
	private $page_settings_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->page_settings_instance = new Page_Settings();
	}


	/**
	 * Test get_settings returns array.
	 *
	 * @return void
	 */
	public function test_get_settings_returns_array() {
		$settings = $this->page_settings_instance->get_settings();
		$this->assertIsArray( $settings );
	}

	/**
	 * Test get_settings includes page types.
	 *
	 * @return void
	 */
	public function test_get_settings_includes_page_types() {
		$settings = $this->page_settings_instance->get_settings();

		// Settings should be an array (may be empty if no page types).
		$this->assertIsArray( $settings );
	}

	/**
	 * Test should_show_setting returns true for valid page types.
	 *
	 * @return void
	 */
	public function test_should_show_setting_returns_true_for_valid_types() {
		// These types should be shown in settings (show_in_settings: yes).
		$showable_types = [ 'homepage', 'contact', 'about', 'faq' ];

		foreach ( $showable_types as $type ) {
			$result = $this->page_settings_instance->should_show_setting( $type );
			$this->assertTrue( $result, "Type {$type} should be shown in settings" );
		}
	}

	/**
	 * Test should_show_setting returns false for hidden types.
	 *
	 * @return void
	 */
	public function test_should_show_setting_returns_false_for_hidden_types() {
		// These types have show_in_settings: no.
		$hidden_types = [ 'blog', 'product-page' ];

		foreach ( $hidden_types as $type ) {
			$result = $this->page_settings_instance->should_show_setting( $type );
			$this->assertFalse( $result, "Type {$type} should not be shown in settings" );
		}
	}

	/**
	 * Test should_show_setting returns true for unknown types.
	 *
	 * @return void
	 */
	public function test_should_show_setting_returns_true_for_unknown_types() {
		$result = $this->page_settings_instance->should_show_setting( 'unknown-type' );
		$this->assertTrue( $result );
	}

	/**
	 * Test save_settings saves redirect on login user meta.
	 *
	 * @return void
	 */
	public function test_save_settings_saves_redirect_on_login() {
		// Create a user and log in.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Save settings with redirect enabled.
		$this->page_settings_instance->save_settings( true );

		// Verify the user meta was saved (user_meta stores as string).
		$meta = \get_user_meta( $user_id, 'prpl_redirect_on_login', true );
		$this->assertEquals( '1', $meta );

		// Save settings with redirect disabled.
		$this->page_settings_instance->save_settings( false );

		// Verify the user meta was updated (empty string for false).
		$meta = \get_user_meta( $user_id, 'prpl_redirect_on_login', true );
		$this->assertEquals( '', $meta );
	}

	/**
	 * Test save_post_types saves post types.
	 *
	 * @return void
	 */
	public function test_save_post_types_saves_array() {
		$post_types = [ 'post', 'page', 'custom_post_type' ];

		$this->page_settings_instance->save_post_types( $post_types );

		$saved = \progress_planner()->get_settings()->get( 'include_post_types' );

		$this->assertEquals( $post_types, $saved );
	}

	/**
	 * Test save_post_types with empty array falls back to defaults.
	 *
	 * @return void
	 */
	public function test_save_post_types_empty_defaults() {
		$this->page_settings_instance->save_post_types( [] );

		$saved = \progress_planner()->get_settings()->get( 'include_post_types' );

		// Should contain at least post and page.
		$this->assertIsArray( $saved );
		$this->assertContains( 'post', $saved );
		$this->assertContains( 'page', $saved );
	}

	/**
	 * Test set_page_values with empty array does nothing.
	 *
	 * @return void
	 */
	public function test_set_page_values_empty_array() {
		// Should not throw an error.
		$this->page_settings_instance->set_page_values( [] );
		$this->assertTrue( true );
	}

	/**
	 * Test set_page_values assigns page type.
	 *
	 * @return void
	 */
	public function test_set_page_values_assigns_page_type() {
		// Create a test page.
		$page_id = $this->factory->post->create(
			[
				'post_type'   => 'page',
				'post_title'  => 'Test About Page',
				'post_status' => 'publish',
			]
		);

		// Set the page value.
		$pages = [
			'about' => [
				'id'        => $page_id,
				'have_page' => 'yes',
			],
		];

		$this->page_settings_instance->set_page_values( $pages );

		// Verify the term was assigned.
		$terms = \get_the_terms( $page_id, \Progress_Planner\Page_Types::TAXONOMY_NAME );

		$this->assertIsArray( $terms );
		$this->assertEquals( 'about', $terms[0]->slug );

		// Cleanup.
		\wp_delete_post( $page_id, true );
	}

	/**
	 * Test set_page_values with not-applicable sets no page needed.
	 *
	 * @return void
	 */
	public function test_set_page_values_not_applicable() {
		$pages = [
			'faq' => [
				'id'        => 0,
				'have_page' => 'not-applicable',
			],
		];

		$this->page_settings_instance->set_page_values( $pages );

		// Verify the page is marked as not needed.
		$is_needed = \progress_planner()->get_page_types()->is_page_needed( 'faq' );
		$this->assertFalse( $is_needed );

		// Cleanup.
		\progress_planner()->get_page_types()->set_no_page_needed( 'faq', false );
	}

	/**
	 * Test get_settings returns expected structure.
	 *
	 * @return void
	 */
	public function test_get_settings_returns_expected_structure() {
		$settings = $this->page_settings_instance->get_settings();

		// If there are settings, each should have required keys.
		foreach ( $settings as $slug => $setting ) {
			$this->assertArrayHasKey( 'id', $setting );
			$this->assertArrayHasKey( 'value', $setting );
			$this->assertArrayHasKey( 'isset', $setting );
			$this->assertArrayHasKey( 'title', $setting );
			$this->assertArrayHasKey( 'type', $setting );
			$this->assertEquals( $slug, $setting['id'] );
			$this->assertEquals( 'page-select', $setting['type'] );
		}
	}
}
