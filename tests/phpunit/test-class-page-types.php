<?php
/**
 * Class Page_Types_Test
 *
 * @package Progress_Planner\Tests
 * @group pages
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Page_Types;

/**
 * Page_Types_Test test case.
 */
class Page_Types_Test extends \WP_UnitTestCase {

	/**
	 * Page_Types instance.
	 *
	 * @var Page_Types
	 */
	protected $page_types;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->page_types = new Page_Types();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'init', [ $this->page_types, 'create_taxonomy' ] ) );
		$this->assertEquals( 10, \has_action( 'init', [ $this->page_types, 'maybe_add_terms' ] ) );
		$this->assertEquals( 10, \has_action( 'init', [ $this->page_types, 'maybe_update_terms' ] ) );
		$this->assertEquals( 10, \has_action( 'update_option_page_on_front', [ $this->page_types, 'update_option_page_on_front' ] ) );
	}

	/**
	 * Test TAXONOMY_NAME constant.
	 *
	 * @return void
	 */
	public function test_taxonomy_name_constant() {
		$this->assertEquals( 'progress_planner_page_types', Page_Types::TAXONOMY_NAME );
	}

	/**
	 * Test create_taxonomy registers taxonomy.
	 *
	 * @return void
	 */
	public function test_create_taxonomy() {
		$this->page_types->create_taxonomy();
		$this->assertTrue( \taxonomy_exists( Page_Types::TAXONOMY_NAME ) );
	}

	/**
	 * Test maybe_add_terms is callable.
	 *
	 * @return void
	 */
	public function test_maybe_add_terms_callable() {
		$this->assertTrue( \is_callable( [ $this->page_types, 'maybe_add_terms' ] ) );
	}

	/**
	 * Test maybe_update_terms is callable.
	 *
	 * @return void
	 */
	public function test_maybe_update_terms_callable() {
		$this->assertTrue( \is_callable( [ $this->page_types, 'maybe_update_terms' ] ) );
	}
}
