<?php
/**
 * Tests for Utils\Traits\Input_Sanitizer trait.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Utils\Traits\Input_Sanitizer;

/**
 * Mock class using Input_Sanitizer trait.
 */
class Mock_Input_Sanitizer_Class {
	use Input_Sanitizer;
}

/**
 * Input Sanitizer trait test case.
 */
class Input_Sanitizer_Trait_Test extends \WP_UnitTestCase {

	/**
	 * Mock class instance.
	 *
	 * @var Mock_Input_Sanitizer_Class
	 */
	private $mock_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->mock_instance = new Mock_Input_Sanitizer_Class();
	}

	/**
	 * Test get_sanitized_get returns sanitized value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_returns_sanitized_value() {
		$_GET['test_key'] = '<script>alert("xss")</script>';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'test_key' );
		$this->assertStringNotContainsString( '<script>', $result );
		$this->assertStringNotContainsString( 'alert', $result );
		unset( $_GET['test_key'] );
	}

	/**
	 * Test get_sanitized_get returns default when key not set.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_returns_default() {
		unset( $_GET['nonexistent_key'] );
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'nonexistent_key', 'default_value' );
		$this->assertEquals( 'default_value', $result );
	}

	/**
	 * Test get_sanitized_get sanitizes malicious input.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_sanitizes_malicious_input() {
		$_GET['malicious'] = '<img src=x onerror=alert(1)>';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'malicious' );
		$this->assertStringNotContainsString( '<img', $result );
		$this->assertStringNotContainsString( 'onerror', $result );
		unset( $_GET['malicious'] );
	}

	/**
	 * Test get_sanitized_get handles empty string.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_handles_empty_string() {
		$_GET['empty_key'] = '';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'empty_key', 'default' );
		$this->assertEquals( '', $result );
		unset( $_GET['empty_key'] );
	}

	/**
	 * Test get_sanitized_get handles normal text.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_handles_normal_text() {
		$_GET['normal_key'] = 'normal text value';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'normal_key' );
		$this->assertEquals( 'normal text value', $result );
		unset( $_GET['normal_key'] );
	}

	/**
	 * Test get_sanitized_post returns sanitized value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_returns_sanitized_value() {
		$_POST['test_key'] = '<script>alert("xss")</script>';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_post' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'test_key' );
		$this->assertStringNotContainsString( '<script>', $result );
		$this->assertStringNotContainsString( 'alert', $result );
		unset( $_POST['test_key'] );
	}

	/**
	 * Test get_sanitized_post returns default when key not set.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_returns_default() {
		unset( $_POST['nonexistent_key'] );
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_post' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'nonexistent_key', 'default_value' );
		$this->assertEquals( 'default_value', $result );
	}

	/**
	 * Test get_sanitized_post sanitizes malicious input.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_sanitizes_malicious_input() {
		$_POST['malicious'] = '<iframe src="evil.com"></iframe>';
		$reflection = new \ReflectionClass( $this->mock_instance );
		$method = $reflection->getMethod( 'get_sanitized_post' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->mock_instance, 'malicious' );
		$this->assertStringNotContainsString( '<iframe', $result );
		unset( $_POST['malicious'] );
	}
}

