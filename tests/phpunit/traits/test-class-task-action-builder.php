<?php
/**
 * Test Task_Action_Builder trait.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests\Traits;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder;

/**
 * Task_Action_Builder test case.
 *
 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Task_Action_Builder
 */
class Task_Action_Builder_Test extends \WP_UnitTestCase {

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
			use Task_Action_Builder;

			/**
			 * Mock POPOVER_ID constant.
			 */
			const POPOVER_ID = 'test-popover';

			/**
			 * Public wrapper for create_popover_action.
			 *
			 * @param string $label    The text to display for the action link.
			 * @param int    $priority The priority of the action.
			 * @return array
			 */
			public function public_create_popover_action( $label, $priority = 10 ) {
				return $this->create_popover_action( $label, $priority );
			}

			/**
			 * Public wrapper for generate_popover_button_html.
			 *
			 * @param string $label The text to display for the action link.
			 * @return string
			 */
			public function public_generate_popover_button_html( $label ) {
				return $this->generate_popover_button_html( $label );
			}

			/**
			 * Public wrapper for add_popover_action.
			 *
			 * @param array  $actions  The existing actions array.
			 * @param string $label    The text to display for the action link.
			 * @param int    $priority The priority of the action.
			 * @return array
			 */
			public function public_add_popover_action( $actions, $label, $priority = 10 ) {
				return $this->add_popover_action( $actions, $label, $priority );
			}
		};
	}

	/**
	 * Test create_popover_action returns correct structure.
	 *
	 * @return void
	 */
	public function test_create_popover_action_structure() {
		$action = $this->mock_class->public_create_popover_action( 'Test Label' );

		$this->assertIsArray( $action );
		$this->assertArrayHasKey( 'priority', $action );
		$this->assertArrayHasKey( 'html', $action );
	}

	/**
	 * Test create_popover_action with default priority.
	 *
	 * @return void
	 */
	public function test_create_popover_action_default_priority() {
		$action = $this->mock_class->public_create_popover_action( 'Test Label' );

		$this->assertEquals( 10, $action['priority'] );
	}

	/**
	 * Test create_popover_action with custom priority.
	 *
	 * @return void
	 */
	public function test_create_popover_action_custom_priority() {
		$action = $this->mock_class->public_create_popover_action( 'Test Label', 20 );

		$this->assertEquals( 20, $action['priority'] );
	}

	/**
	 * Test generate_popover_button_html output.
	 *
	 * @return void
	 */
	public function test_generate_popover_button_html() {
		$html = $this->mock_class->public_generate_popover_button_html( 'Test Label' );

		$this->assertStringContainsString( 'prpl-tooltip-action-text', $html );
		$this->assertStringContainsString( 'Test Label', $html );
		$this->assertStringContainsString( 'prpl-popover-test-popover', $html );
		$this->assertStringContainsString( 'showPopover()', $html );
		$this->assertStringContainsString( 'role="button"', $html );
	}

	/**
	 * Test generate_popover_button_html escapes HTML.
	 *
	 * @return void
	 */
	public function test_generate_popover_button_html_escapes() {
		$html = $this->mock_class->public_generate_popover_button_html( '<script>alert("xss")</script>' );

		// Should not contain unescaped script tags.
		$this->assertStringNotContainsString( '<script>', $html );
		$this->assertStringContainsString( '&lt;script&gt;', $html );
	}

	/**
	 * Test add_popover_action adds to existing array.
	 *
	 * @return void
	 */
	public function test_add_popover_action_adds_to_array() {
		$actions = [
			[
				'priority' => 5,
				'html'     => '<a href="#">Existing Action</a>',
			],
		];

		$result = $this->mock_class->public_add_popover_action( $actions, 'New Action' );

		$this->assertCount( 2, $result );
		$this->assertEquals( 5, $result[0]['priority'] );
		$this->assertEquals( 10, $result[1]['priority'] );
	}

	/**
	 * Test add_popover_action with empty array.
	 *
	 * @return void
	 */
	public function test_add_popover_action_empty_array() {
		$actions = [];

		$result = $this->mock_class->public_add_popover_action( $actions, 'Test Action' );

		$this->assertCount( 1, $result );
		$this->assertArrayHasKey( 'priority', $result[0] );
		$this->assertArrayHasKey( 'html', $result[0] );
	}

	/**
	 * Test add_popover_action returns array.
	 *
	 * @return void
	 */
	public function test_add_popover_action_returns_array() {
		$result = $this->mock_class->public_add_popover_action( [], 'Test' );

		$this->assertIsArray( $result );
	}

	/**
	 * Test that methods exist and are protected.
	 *
	 * @return void
	 */
	public function test_methods_exist() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Check create_popover_action exists and is protected.
		$this->assertTrue( $reflection->hasMethod( 'create_popover_action' ) );
		$method = $reflection->getMethod( 'create_popover_action' );
		$this->assertTrue( $method->isProtected() );

		// Check generate_popover_button_html exists and is protected.
		$this->assertTrue( $reflection->hasMethod( 'generate_popover_button_html' ) );
		$method = $reflection->getMethod( 'generate_popover_button_html' );
		$this->assertTrue( $method->isProtected() );

		// Check add_popover_action exists and is protected.
		$this->assertTrue( $reflection->hasMethod( 'add_popover_action' ) );
		$method = $reflection->getMethod( 'add_popover_action' );
		$this->assertTrue( $method->isProtected() );
	}

	/**
	 * Test default parameters.
	 *
	 * @return void
	 */
	public function test_default_parameters() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Check create_popover_action defaults.
		$method = $reflection->getMethod( 'create_popover_action' );
		$params = $method->getParameters();
		$this->assertEquals( 10, $params[1]->getDefaultValue() );

		// Check add_popover_action defaults.
		$method = $reflection->getMethod( 'add_popover_action' );
		$params = $method->getParameters();
		$this->assertEquals( 10, $params[2]->getDefaultValue() );
	}

	/**
	 * Test create_popover_action with various priority values.
	 *
	 * @dataProvider provider_priority_values
	 *
	 * @param int $priority The priority value to test.
	 *
	 * @return void
	 */
	public function test_create_popover_action_priority_values( $priority ) {
		$action = $this->mock_class->public_create_popover_action( 'Test Label', $priority );

		$this->assertEquals( $priority, $action['priority'] );
	}

	/**
	 * Data provider for priority values.
	 *
	 * @return array
	 */
	public function provider_priority_values() {
		return [
			'zero'            => [ 0 ],
			'negative'        => [ -5 ],
			'negative_large'  => [ -100 ],
			'positive_small'  => [ 5 ],
			'default'         => [ 10 ],
			'positive_medium' => [ 50 ],
			'positive_large'  => [ 999 ],
		];
	}

	/**
	 * Test generate_popover_button_html with various label types.
	 *
	 * @dataProvider provider_label_types
	 *
	 * @param string $label            The label to test.
	 * @param string $expected_content The expected content in the HTML.
	 *
	 * @return void
	 */
	public function test_generate_popover_button_html_labels( $label, $expected_content ) {
		$html = $this->mock_class->public_generate_popover_button_html( $label );

		$this->assertStringContainsString( $expected_content, $html );
		$this->assertStringContainsString( 'prpl-tooltip-action-text', $html );
		$this->assertStringContainsString( 'showPopover()', $html );
	}

	/**
	 * Data provider for label types.
	 *
	 * @return array
	 */
	public function provider_label_types() {
		return [
			'simple_text'       => [ 'Test Label', 'Test Label' ],
			'special_chars'     => [ 'Test & Label "with" quotes', 'Test &amp; Label &quot;with&quot; quotes' ],
			'unicode'           => [ 'Test 日本語 Label', 'Test 日本語 Label' ],
			'empty'             => [ '', '' ],
			'with_apostrophe'   => [ "Test's Label", 'Test&#039;s Label' ],
			'with_less_than'    => [ 'Test < Label', 'Test &lt; Label' ],
			'with_greater_than' => [ 'Test > Label', 'Test &gt; Label' ],
		];
	}

	/**
	 * Test add_popover_action with custom priority.
	 *
	 * @return void
	 */
	public function test_add_popover_action_custom_priority() {
		$actions = [];

		$result = $this->mock_class->public_add_popover_action( $actions, 'Test Action', 50 );

		$this->assertCount( 1, $result );
		$this->assertEquals( 50, $result[0]['priority'] );
	}

	/**
	 * Test add_popover_action preserves existing array structure.
	 *
	 * @return void
	 */
	public function test_add_popover_action_preserves_structure() {
		$actions = [
			[
				'priority' => 5,
				'html'     => '<a href="#">First</a>',
			],
			[
				'priority' => 15,
				'html'     => '<a href="#">Second</a>',
			],
		];

		$result = $this->mock_class->public_add_popover_action( $actions, 'New Action' );

		$this->assertCount( 3, $result );
		$this->assertEquals( 5, $result[0]['priority'] );
		$this->assertEquals( 15, $result[1]['priority'] );
		$this->assertEquals( 10, $result[2]['priority'] );
		$this->assertStringContainsString( 'First', $result[0]['html'] );
		$this->assertStringContainsString( 'Second', $result[1]['html'] );
	}

	/**
	 * Test that generate_popover_button_html uses static::POPOVER_ID.
	 *
	 * @return void
	 */
	public function test_generate_popover_button_html_uses_popover_id() {
		$html = $this->mock_class->public_generate_popover_button_html( 'Test' );

		// Should use the POPOVER_ID constant from the class.
		$this->assertStringContainsString( 'prpl-popover-test-popover', $html );
	}
}
