<?php
/**
 * Unit tests for Popover UI class.
 *
 * @package Progress_Planner\Tests
 * @group ui
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\UI\Popover;

/**
 * UI_Popover test case.
 *
 * Tests the Popover UI class that manages popover
 * instances and rendering.
 *
 * @group ui
 */
class UI_Popover_Test extends WP_UnitTestCase {

	/**
	 * Popover instance.
	 *
	 * @var Popover
	 */
	private $popover;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->popover = new Popover();
	}

	/**
	 * Test instance can be created.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Popover::class, $this->popover, 'Should create Popover instance' );
	}

	/**
	 * Test the_popover returns Popover instance.
	 *
	 * @return void
	 */
	public function test_the_popover_returns_instance() {
		$popover = $this->popover->the_popover( 'test-popover' );
		$this->assertInstanceOf( Popover::class, $popover, 'the_popover should return Popover instance' );
	}

	/**
	 * Test the_popover sets ID.
	 *
	 * @return void
	 */
	public function test_the_popover_sets_id() {
		$popover_id = 'my-custom-popover';
		$popover    = $this->popover->the_popover( $popover_id );

		$this->assertEquals( $popover_id, $popover->id, 'Popover ID should be set correctly' );
	}

	/**
	 * Test ID property is public.
	 *
	 * @return void
	 */
	public function test_id_property_is_public() {
		$reflection = new \ReflectionClass( Popover::class );
		$property   = $reflection->getProperty( 'id' );

		$this->assertTrue( $property->isPublic(), 'ID property should be public' );
	}

	/**
	 * Test render_button method exists and is callable.
	 *
	 * @return void
	 */
	public function test_render_button_method_exists() {
		$this->assertTrue( \method_exists( $this->popover, 'render_button' ), 'render_button method should exist' );
		$this->assertTrue( \is_callable( [ $this->popover, 'render_button' ] ), 'render_button should be callable' );
	}

	/**
	 * Test render method exists and is callable.
	 *
	 * @return void
	 */
	public function test_render_method_exists() {
		$this->assertTrue( \method_exists( $this->popover, 'render' ), 'render method should exist' );
		$this->assertTrue( \is_callable( [ $this->popover, 'render' ] ), 'render should be callable' );
	}

	/**
	 * Test multiple popover instances can be created.
	 *
	 * @return void
	 */
	public function test_multiple_popover_instances() {
		$popover1 = $this->popover->the_popover( 'popover-1' );
		$popover2 = $this->popover->the_popover( 'popover-2' );

		$this->assertInstanceOf( Popover::class, $popover1, 'First popover should be instance' );
		$this->assertInstanceOf( Popover::class, $popover2, 'Second popover should be instance' );
		$this->assertEquals( 'popover-1', $popover1->id, 'First popover ID should be correct' );
		$this->assertEquals( 'popover-2', $popover2->id, 'Second popover ID should be correct' );
	}

	/**
	 * Test popover ID can be any string.
	 *
	 * @return void
	 */
	public function test_popover_id_accepts_any_string() {
		$test_ids = [
			'simple',
			'with-dashes',
			'with_underscores',
			'with123numbers',
			'CamelCase',
		];

		foreach ( $test_ids as $test_id ) {
			$popover = $this->popover->the_popover( $test_id );
			$this->assertEquals( $test_id, $popover->id, "Popover should accept ID: $test_id" );
		}
	}

	/**
	 * Test popover instance is new each time.
	 *
	 * @return void
	 */
	public function test_the_popover_creates_new_instance() {
		$popover1 = $this->popover->the_popover( 'test' );
		$popover2 = $this->popover->the_popover( 'test' );

		// Should be different instances even with same ID.
		$this->assertNotSame( $popover1, $popover2, 'Each call should create new instance' );
		$this->assertEquals( $popover1->id, $popover2->id, 'But IDs should match' );
	}

	/**
	 * Test render_button requires two parameters.
	 *
	 * @return void
	 */
	public function test_render_button_parameters() {
		$reflection = new \ReflectionClass( Popover::class );
		$method     = $reflection->getMethod( 'render_button' );

		$parameters = $method->getParameters();
		$this->assertCount( 2, $parameters, 'render_button should have 2 parameters' );
		$this->assertEquals( 'icon', $parameters[0]->getName(), 'First parameter should be icon' );
		$this->assertEquals( 'content', $parameters[1]->getName(), 'Second parameter should be content' );
	}

	/**
	 * Test render method has no required parameters.
	 *
	 * @return void
	 */
	public function test_render_has_no_parameters() {
		$reflection = new \ReflectionClass( Popover::class );
		$method     = $reflection->getMethod( 'render' );

		$parameters = $method->getParameters();
		$this->assertCount( 0, $parameters, 'render should have no parameters' );
	}
}
