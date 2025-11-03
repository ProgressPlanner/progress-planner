<?php
/**
 * Class Badges_Badge_Content_Test
 *
 * @package Progress_Planner\Tests
 * @group badges
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges\Badge_Content;

/**
 * Mock Badge_Content for testing.
 *
 * @group badges
 */
class Mock_Badge_Content extends Badge_Content {
	/**
	 * Badge ID.
	 *
	 * @var string
	 */
	protected $id = 'test-content-badge';

	/**
	 * Get the badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'Test Content Badge';
	}

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	public function get_description() {
		return 'A test content badge for testing purposes';
	}

	/**
	 * Progress callback.
	 *
	 * @param array $args The arguments for the progress callback.
	 * @return array
	 */
	public function progress_callback( $args = [] ) {
		return [
			'current' => 0,
			'goal'    => 10,
		];
	}
}

/**
 * Badges_Badge_Content_Test test case.
 */
class Badges_Badge_Content_Test extends \WP_UnitTestCase {

	/**
	 * Badge_Content instance.
	 *
	 * @var Mock_Badge_Content
	 */
	protected $badge;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badge = new Mock_Badge_Content();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Badge_Content::class, $this->badge );
	}

	/**
	 * Test get_id returns string.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$result = $this->badge->get_id();
		$this->assertEquals( 'test-content-badge', $result );
	}
}
