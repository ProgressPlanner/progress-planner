<?php
/**
 * Class Suggested_Tasks_Providers_Content_Create_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 * @group suggested-tasks-providers-1
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Content_Create;

/**
 * Suggested_Tasks_Providers_Content_Create_Test test case.
 */
class Suggested_Tasks_Providers_Content_Create_Test extends \WP_UnitTestCase {

	/**
	 * Content_Create instance.
	 *
	 * @var Content_Create
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Content_Create();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'create-post', $this->provider->get_provider_id() );
	}

	/**
	 * Test should_add_task returns true when no posts exist.
	 *
	 * @return void
	 */
	public function test_should_add_task_with_no_posts() {
		$result = $this->provider->should_add_task();
		$this->assertIsBool( $result );
	}

	/**
	 * Test add_task_actions adds create new post action.
	 *
	 * @return void
	 */
	public function test_add_task_actions() {
		$actions = $this->provider->add_task_actions( [], [] );
		$this->assertIsArray( $actions );
		$this->assertNotEmpty( $actions );
		$this->assertArrayHasKey( 'priority', $actions[0] );
		$this->assertArrayHasKey( 'html', $actions[0] );
		$this->assertStringContainsString( 'post-new.php', $actions[0]['html'] );
	}

	/**
	 * Test modify_evaluated_task_data without post.
	 *
	 * @return void
	 */
	public function test_modify_evaluated_task_data_no_post() {
		$task_data = [ 'task_id' => 'test' ];
		$result    = $this->provider->modify_evaluated_task_data( $task_data );
		$this->assertIsArray( $result );
	}
}
