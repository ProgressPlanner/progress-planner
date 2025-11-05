<?php
/**
 * Test Input_Sanitizer trait.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests\Traits;

use Progress_Planner\Utils\Traits\Input_Sanitizer;

/**
 * Input_Sanitizer test case.
 *
 * @covers \Progress_Planner\Utils\Traits\Input_Sanitizer
 */
class Input_Sanitizer_Test extends \WP_UnitTestCase {

	/**
	 * Mock class that uses the trait.
	 *
	 * @var object
	 */
	protected $mock_class;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Create an anonymous class that uses the trait.
		$this->mock_class = new class() {
			use Input_Sanitizer;

			/**
			 * Public wrapper for get_sanitized_post.
			 *
			 * @param string $key           The POST key.
			 * @param mixed  $default_value The default value.
			 * @return string
			 */
			public function public_get_sanitized_post( $key, $default_value = '' ) {
				return $this->get_sanitized_post( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_get.
			 *
			 * @param string $key           The GET key.
			 * @param mixed  $default_value The default value.
			 * @return string
			 */
			public function public_get_sanitized_get( $key, $default_value = '' ) {
				return $this->get_sanitized_get( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_request.
			 *
			 * @param string $key           The REQUEST key.
			 * @param mixed  $default_value The default value.
			 * @return string
			 */
			public function public_get_sanitized_request( $key, $default_value = '' ) {
				return $this->get_sanitized_request( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_post_int.
			 *
			 * @param string $key           The POST key.
			 * @param int    $default_value The default value.
			 * @return int
			 */
			public function public_get_sanitized_post_int( $key, $default_value = 0 ) {
				return $this->get_sanitized_post_int( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_get_int.
			 *
			 * @param string $key           The GET key.
			 * @param int    $default_value The default value.
			 * @return int
			 */
			public function public_get_sanitized_get_int( $key, $default_value = 0 ) {
				return $this->get_sanitized_get_int( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_post_array.
			 *
			 * @param string $key           The POST key.
			 * @param array  $default_value The default value.
			 * @return array
			 */
			public function public_get_sanitized_post_array( $key, $default_value = [] ) {
				return $this->get_sanitized_post_array( $key, $default_value );
			}

			/**
			 * Public wrapper for get_sanitized_get_array.
			 *
			 * @param string $key           The GET key.
			 * @param array  $default_value The default value.
			 * @return array
			 */
			public function public_get_sanitized_get_array( $key, $default_value = [] ) {
				return $this->get_sanitized_get_array( $key, $default_value );
			}
		};
	}

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Clean up superglobals.
		unset( $_POST['test_key'] );
		unset( $_GET['test_key'] );
		unset( $_REQUEST['test_key'] );

		parent::tear_down();
	}

	/**
	 * Test get_sanitized_post with valid value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_valid() {
		$_POST['test_key'] = 'test value';

		$result = $this->mock_class->public_get_sanitized_post( 'test_key' );

		$this->assertEquals( 'test value', $result );
	}

	/**
	 * Test get_sanitized_post with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_default() {
		$result = $this->mock_class->public_get_sanitized_post( 'nonexistent_key', 'default' );

		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test get_sanitized_post with various input types.
	 *
	 * @dataProvider provider_sanitization_inputs
	 *
	 * @param string $input              The input value.
	 * @param string $expected           The expected sanitized output.
	 * @param string $should_not_contain String that should not appear in output.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_sanitization( $input, $expected, $should_not_contain = '' ) {
		$_POST['test_key'] = $input;

		$result = $this->mock_class->public_get_sanitized_post( 'test_key' );

		$this->assertEquals( $expected, $result );
		if ( $should_not_contain ) {
			$this->assertStringNotContainsString( $should_not_contain, $result );
		}
	}

	/**
	 * Test get_sanitized_get with various input types.
	 *
	 * @dataProvider provider_sanitization_inputs
	 *
	 * @param string $input              The input value.
	 * @param string $expected           The expected sanitized output.
	 * @param string $should_not_contain String that should not appear in output.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_sanitization( $input, $expected, $should_not_contain = '' ) {
		$_GET['test_key'] = $input;

		$result = $this->mock_class->public_get_sanitized_get( 'test_key' );

		$this->assertEquals( $expected, $result );
		if ( $should_not_contain ) {
			$this->assertStringNotContainsString( $should_not_contain, $result );
		}
	}

	/**
	 * Data provider for sanitization inputs.
	 *
	 * @return array
	 */
	public function provider_sanitization_inputs() {
		return [
			'simple_text'   => [ 'test value', 'test value', '' ],
			'xss_script'    => [ '<script>alert("xss")</script>', '', '<script>' ],
			'html_tags'     => [ 'Test <b>bold</b> text', 'Test bold text', '<b>' ],
			'special_chars' => [ 'Test & Value', 'Test & Value', '' ],
			'empty_string'  => [ '', '', '' ],
			'whitespace'    => [ '   test value   ', 'test value', '' ],
			'unicode'       => [ '日本語テスト', '日本語テスト', '' ],
			'newlines'      => [ "test\nvalue", 'test value', "\n" ],
			'tabs'          => [ "test\tvalue", 'test value', "\t" ],
		];
	}

	/**
	 * Test get_sanitized_get with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_default() {
		$result = $this->mock_class->public_get_sanitized_get( 'nonexistent_key', 'default' );

		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test get_sanitized_request with valid value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_request_valid() {
		$_REQUEST['test_key'] = 'test value';

		$result = $this->mock_class->public_get_sanitized_request( 'test_key' );

		$this->assertEquals( 'test value', $result );
	}

	/**
	 * Test get_sanitized_request with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_request_default() {
		$result = $this->mock_class->public_get_sanitized_request( 'nonexistent_key', 'default' );

		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test get_sanitized_post_int with valid integer.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_int_valid() {
		$_POST['test_key'] = '42';

		$result = $this->mock_class->public_get_sanitized_post_int( 'test_key' );

		$this->assertEquals( 42, $result );
		$this->assertIsInt( $result );
	}

	/**
	 * Test get_sanitized_post_int with string.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_int_string() {
		$_POST['test_key'] = 'not a number';

		$result = $this->mock_class->public_get_sanitized_post_int( 'test_key' );

		$this->assertEquals( 0, $result );
		$this->assertIsInt( $result );
	}

	/**
	 * Test get_sanitized_post_int with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_int_default() {
		$result = $this->mock_class->public_get_sanitized_post_int( 'nonexistent_key', 99 );

		$this->assertEquals( 99, $result );
	}

	/**
	 * Test get_sanitized_get_int with valid integer.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_int_valid() {
		$_GET['test_key'] = '42';

		$result = $this->mock_class->public_get_sanitized_get_int( 'test_key' );

		$this->assertEquals( 42, $result );
		$this->assertIsInt( $result );
	}

	/**
	 * Test get_sanitized_get_int with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_int_default() {
		$result = $this->mock_class->public_get_sanitized_get_int( 'nonexistent_key', 99 );

		$this->assertEquals( 99, $result );
	}

	/**
	 * Test get_sanitized_post_array with valid array.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_valid() {
		$_POST['test_key'] = [ 'value1', 'value2', 'value3' ];

		$result = $this->mock_class->public_get_sanitized_post_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertCount( 3, $result );
		$this->assertEquals( [ 'value1', 'value2', 'value3' ], $result );
	}

	/**
	 * Test get_sanitized_post_array with non-array value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_non_array() {
		$_POST['test_key'] = 'not an array';

		$result = $this->mock_class->public_get_sanitized_post_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_sanitized_post_array with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_default() {
		$result = $this->mock_class->public_get_sanitized_post_array( 'nonexistent_key', [ 'default' ] );

		$this->assertEquals( [ 'default' ], $result );
	}

	/**
	 * Test get_sanitized_post_array sanitizes HTML in array values.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_sanitizes() {
		$_POST['test_key'] = [ '<script>xss</script>', 'normal value' ];

		$result = $this->mock_class->public_get_sanitized_post_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertStringNotContainsString( '<script>', $result[0] );
		$this->assertEquals( 'normal value', $result[1] );
	}

	/**
	 * Test get_sanitized_get_array with valid array.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_array_valid() {
		$_GET['test_key'] = [ 'value1', 'value2' ];

		$result = $this->mock_class->public_get_sanitized_get_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( [ 'value1', 'value2' ], $result );
	}

	/**
	 * Test get_sanitized_get_array with default value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_array_default() {
		$result = $this->mock_class->public_get_sanitized_get_array( 'nonexistent_key', [ 'default' ] );

		$this->assertEquals( [ 'default' ], $result );
	}

	/**
	 * Test that methods exist and are protected.
	 *
	 * @return void
	 */
	public function test_methods_exist() {
		$reflection = new \ReflectionClass( $this->mock_class );

		$methods = [
			'get_sanitized_post',
			'get_sanitized_get',
			'get_sanitized_request',
			'get_sanitized_post_int',
			'get_sanitized_get_int',
			'get_sanitized_post_array',
			'get_sanitized_get_array',
		];

		foreach ( $methods as $method_name ) {
			$this->assertTrue( $reflection->hasMethod( $method_name ), "Method $method_name should exist" );
			$method = $reflection->getMethod( $method_name );
			$this->assertTrue( $method->isProtected(), "Method $method_name should be protected" );
		}
	}

	/**
	 * Test default parameters.
	 *
	 * @return void
	 */
	public function test_default_parameters() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Check get_sanitized_post defaults.
		$method = $reflection->getMethod( 'get_sanitized_post' );
		$params = $method->getParameters();
		$this->assertEquals( '', $params[1]->getDefaultValue() );

		// Check get_sanitized_get defaults.
		$method = $reflection->getMethod( 'get_sanitized_get' );
		$params = $method->getParameters();
		$this->assertEquals( '', $params[1]->getDefaultValue() );

		// Check get_sanitized_post_int defaults.
		$method = $reflection->getMethod( 'get_sanitized_post_int' );
		$params = $method->getParameters();
		$this->assertEquals( 0, $params[1]->getDefaultValue() );

		// Check get_sanitized_get_int defaults.
		$method = $reflection->getMethod( 'get_sanitized_get_int' );
		$params = $method->getParameters();
		$this->assertEquals( 0, $params[1]->getDefaultValue() );

		// Check get_sanitized_post_array defaults.
		$method = $reflection->getMethod( 'get_sanitized_post_array' );
		$params = $method->getParameters();
		$this->assertEquals( [], $params[1]->getDefaultValue() );

		// Check get_sanitized_get_array defaults.
		$method = $reflection->getMethod( 'get_sanitized_get_array' );
		$params = $method->getParameters();
		$this->assertEquals( [], $params[1]->getDefaultValue() );
	}

	/**
	 * Test get_sanitized_post with slashes.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_with_slashes() {
		$_POST['test_key'] = \wp_slash( "test's \"value\" with \\ slashes" );

		$result = $this->mock_class->public_get_sanitized_post( 'test_key' );

		// Should unslash the value.
		$this->assertEquals( "test's \"value\" with \\ slashes", $result );
	}

	/**
	 * Test get_sanitized_get with slashes.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_with_slashes() {
		$_GET['test_key'] = \wp_slash( "test's value" );

		$result = $this->mock_class->public_get_sanitized_get( 'test_key' );

		// Should unslash the value.
		$this->assertEquals( "test's value", $result );
	}

	/**
	 * Test get_sanitized_request sanitizes HTML.
	 *
	 * @return void
	 */
	public function test_get_sanitized_request_sanitizes() {
		$_REQUEST['test_key'] = '<script>alert("xss")</script>';

		$result = $this->mock_class->public_get_sanitized_request( 'test_key' );

		$this->assertStringNotContainsString( '<script>', $result );
	}

	/**
	 * Test get_sanitized_post_int with various integer values.
	 *
	 * @dataProvider provider_integer_values
	 *
	 * @param string $input    The input value.
	 * @param int    $expected The expected integer output.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_int_values( $input, $expected ) {
		$_POST['test_key'] = $input;

		$result = $this->mock_class->public_get_sanitized_post_int( 'test_key' );

		$this->assertEquals( $expected, $result );
		$this->assertIsInt( $result );
	}

	/**
	 * Test get_sanitized_get_int with various integer values.
	 *
	 * @dataProvider provider_integer_values
	 *
	 * @param string $input    The input value.
	 * @param int    $expected The expected integer output.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_int_values( $input, $expected ) {
		$_GET['test_key'] = $input;

		$result = $this->mock_class->public_get_sanitized_get_int( 'test_key' );

		$this->assertEquals( $expected, $result );
		$this->assertIsInt( $result );
	}

	/**
	 * Data provider for integer values.
	 *
	 * @return array
	 */
	public function provider_integer_values() {
		return [
			'zero'           => [ '0', 0 ],
			'positive'       => [ '42', 42 ],
			'negative'       => [ '-42', -42 ],
			'large_positive' => [ '999999999', 999999999 ],
			'large_negative' => [ '-999999', -999999 ],
			'float_truncate' => [ '42.5', 42 ],
			'float_round_up' => [ '42.9', 42 ],
			'string'         => [ 'not a number', 0 ],
			'empty'          => [ '', 0 ],
		];
	}


	/**
	 * Test get_sanitized_get_array with non-array value.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_array_non_array() {
		$_GET['test_key'] = 'not an array';

		$result = $this->mock_class->public_get_sanitized_get_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_sanitized_post_array with empty array.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_empty() {
		$_POST['test_key'] = [];

		$result = $this->mock_class->public_get_sanitized_post_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_sanitized_get_array with nested arrays.
	 *
	 * @return void
	 */
	public function test_get_sanitized_get_array_nested() {
		$_GET['test_key'] = [ 'value1', [ 'nested1', 'nested2' ], 'value2' ];

		$result = $this->mock_class->public_get_sanitized_get_array( 'test_key' );

		$this->assertIsArray( $result );
		// Nested array should be flattened to string by array_map.
		$this->assertCount( 3, $result );
	}

	/**
	 * Test get_sanitized_request with unicode.
	 *
	 * @return void
	 */
	public function test_get_sanitized_request_unicode() {
		$_REQUEST['test_key'] = '日本語テスト';

		$result = $this->mock_class->public_get_sanitized_request( 'test_key' );

		$this->assertEquals( '日本語テスト', $result );
	}

	/**
	 * Test get_sanitized_post_array with mixed content.
	 *
	 * @return void
	 */
	public function test_get_sanitized_post_array_mixed() {
		$_POST['test_key'] = [ 'text', '123', '<script>xss</script>', '' ];

		$result = $this->mock_class->public_get_sanitized_post_array( 'test_key' );

		$this->assertIsArray( $result );
		$this->assertCount( 4, $result );
		$this->assertEquals( 'text', $result[0] );
		$this->assertEquals( '123', $result[1] );
		$this->assertStringNotContainsString( '<script>', $result[2] );
		$this->assertEquals( '', $result[3] );
	}
}
