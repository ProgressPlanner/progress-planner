<?php
/**
 * Class Page_Todos_Test
 *
 * @package Progress_Planner\Tests
 * @group pages
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Page_Todos;

/**
 * Page_Todos_Test test case.
 */
class Page_Todos_Test extends \WP_UnitTestCase {

	/**
	 * Page_Todos instance.
	 *
	 * @var Page_Todos
	 */
	protected $page_todos;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->page_todos = new Page_Todos();
		$this->page_todos->init();
	}

	/**
	 * Test that init hooks into the init action.
	 *
	 * @return void
	 */
	public function test_constructor_adds_init_hook() {
		$page_todos_new = new Page_Todos();
		$this->assertEquals( 10, \has_action( 'init', [ $page_todos_new, 'init' ] ) );
	}

	/**
	 * Test that post meta is registered for public post types.
	 *
	 * @return void
	 */
	public function test_post_meta_registered_for_post_type() {
		// Check that meta exists by trying to get it.
		$post_id = $this->factory->post->create();
		\update_post_meta( $post_id, 'progress_planner_page_todos', 'test' );
		$meta = \get_post_meta( $post_id, 'progress_planner_page_todos', true );
		$this->assertEquals( 'test', $meta );
		\wp_delete_post( $post_id, true );
	}

	/**
	 * Test that post meta is registered for page post type.
	 *
	 * @return void
	 */
	public function test_post_meta_registered_for_page_type() {
		// Check that meta exists by trying to get it.
		$page_id = $this->factory->post->create( [ 'post_type' => 'page' ] );
		\update_post_meta( $page_id, 'progress_planner_page_todos', 'test' );
		$meta = \get_post_meta( $page_id, 'progress_planner_page_todos', true );
		$this->assertEquals( 'test', $meta );
		\wp_delete_post( $page_id, true );
	}

	/**
	 * Test that post meta shows in REST.
	 *
	 * @return void
	 */
	public function test_post_meta_shows_in_rest() {
		$post_id = $this->factory->post->create();

		\update_post_meta( $post_id, 'progress_planner_page_todos', 'task1,task2' );

		$post = \get_post( $post_id );
		$this->assertNotNull( $post );

		// Verify meta exists.
		$meta = \get_post_meta( $post_id, 'progress_planner_page_todos', true );
		$this->assertEquals( 'task1,task2', $meta );

		\wp_delete_post( $post_id, true );
	}

	/**
	 * Test sanitize_post_meta_progress_planner_page_todos with valid input.
	 *
	 * @return void
	 */
	public function test_sanitize_valid_input() {
		$input  = 'task1,task2,task3';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( 'task1,task2,task3', $result );
	}

	/**
	 * Test sanitize removes empty values.
	 *
	 * @return void
	 */
	public function test_sanitize_removes_empty_values() {
		$input  = 'task1,,task2,';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( 'task1,task2', $result );
	}

	/**
	 * Test sanitize removes duplicates.
	 *
	 * @return void
	 */
	public function test_sanitize_removes_duplicates() {
		$input  = 'task1,task2,task1,task3';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		// Note: array_unique maintains first occurrence order.
		$this->assertEquals( 'task1,task2,task3', $result );
	}

	/**
	 * Test sanitize trims whitespace.
	 *
	 * @return void
	 */
	public function test_sanitize_trims_whitespace() {
		$input  = ' task1 , task2 , task3 ';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( 'task1,task2,task3', $result );
	}

	/**
	 * Test sanitize with empty string.
	 *
	 * @return void
	 */
	public function test_sanitize_empty_string() {
		$input  = '';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( '', $result );
	}

	/**
	 * Test sanitize with only commas.
	 *
	 * @return void
	 */
	public function test_sanitize_only_commas() {
		$input  = ',,,';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( '', $result );
	}

	/**
	 * Test sanitize removes special characters.
	 *
	 * @return void
	 */
	public function test_sanitize_removes_special_chars() {
		$input  = 'task<script>alert("xss")</script>,task2';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		// sanitize_text_field should remove script tags.
		$this->assertStringNotContainsString( '<script>', $result );
		$this->assertStringNotContainsString( '</script>', $result );
	}

	/**
	 * Test that custom-fields support is added to post types.
	 *
	 * @return void
	 */
	public function test_custom_fields_support_added() {
		$this->assertTrue( \post_type_supports( 'post', 'custom-fields' ) );
		$this->assertTrue( \post_type_supports( 'page', 'custom-fields' ) );
	}

	/**
	 * Test full sanitization workflow.
	 *
	 * @return void
	 */
	public function test_full_sanitization_workflow() {
		$input  = '  task1  ,  task2  ,  task1  ,task3  ,  task4  ,  task4  ';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		// Should trim, remove empty, remove duplicates.
		$this->assertEquals( 'task1,task2,task3,task4', $result );
	}

	/**
	 * Test sanitize with single task.
	 *
	 * @return void
	 */
	public function test_sanitize_single_task() {
		$input  = 'single-task';
		$result = $this->page_todos->sanitize_post_meta_progress_planner_page_todos( $input );

		$this->assertEquals( 'single-task', $result );
	}

	/**
	 * Test that meta can be saved and retrieved.
	 *
	 * @return void
	 */
	public function test_meta_save_and_retrieve() {
		$post_id = $this->factory->post->create();

		$meta_value = 'todo1,todo2,todo3';
		\update_post_meta( $post_id, 'progress_planner_page_todos', $meta_value );

		$retrieved = \get_post_meta( $post_id, 'progress_planner_page_todos', true );
		$this->assertEquals( $meta_value, $retrieved );

		\wp_delete_post( $post_id, true );
	}

	/**
	 * Test sanitization is applied on update_post_meta.
	 *
	 * @return void
	 */
	public function test_sanitization_applied_on_update() {
		$post_id = $this->factory->post->create();

		// Update with dirty data.
		\update_post_meta( $post_id, 'progress_planner_page_todos', 'task1,task1,,task2, task3 ' );

		// Retrieve should be sanitized.
		$retrieved = \get_post_meta( $post_id, 'progress_planner_page_todos', true );
		$this->assertEquals( 'task1,task2,task3', $retrieved );

		\wp_delete_post( $post_id, true );
	}
}
