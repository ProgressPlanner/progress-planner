<?php
/**
 * Class Admin_Editor_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Editor;

/**
 * Admin_Editor_Test test case.
 *
 * @group admin
 */
class Admin_Editor_Test extends \WP_UnitTestCase {

	/**
	 * Editor instance.
	 *
	 * @var Editor
	 */
	protected $editor;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->editor = new Editor();
	}

	/**
	 * Test constructor registers hook.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hook() {
		$this->assertEquals( 10, \has_action( 'enqueue_block_editor_assets', [ $this->editor, 'enqueue_editor_script' ] ) );
	}

	/**
	 * Test enqueue_editor_script is callable.
	 *
	 * @return void
	 */
	public function test_enqueue_editor_script_callable() {
		$this->assertTrue( \is_callable( [ $this->editor, 'enqueue_editor_script' ] ) );
	}
}
