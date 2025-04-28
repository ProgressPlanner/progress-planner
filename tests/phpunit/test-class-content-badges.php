<?php
/**
 * Class Content_Badges_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Content badges test case.
 */
class Content_Badges_Test extends \WP_UnitTestCase {


	/**
	 * Current month.
	 *
	 * @var string
	 */
	protected $current_month;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Remove all content activities.
		\progress_planner()->get_activities__query()->delete_category_activities( 'content' );
	}

	/**
	 * Test Wonderful Writer badge 0 percent.
	 *
	 * @return void
	 */
	public function test_content_curator_0_progress() {

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'content-curator' === $badge->get_id() ) {
				$this->assertEquals( 0, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Content Curator badge 50 percent.
	 *
	 * @return void
	 */
	public function test_content_curator_50_progress() {

		// Insert 5 posts.
		for ( $i = 0; $i < 5; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'content-curator' === $badge->get_id() ) {
				$this->assertEquals( 50, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Content Curator badge 100 percent.
	 *
	 * @return void
	 */
	public function test_content_curator_100_progress() {

		// Insert 10 posts.
		for ( $i = 0; $i < 10; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'content-curator' === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Revision Ranger badge 50 percent.
	 *
	 * @return void
	 */
	public function test_revision_ranger_50_progress() {

		// Insert 15 posts.
		for ( $i = 0; $i < 15; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'revision-ranger' === $badge->get_id() ) {
				$this->assertEquals( 50, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Revision Ranger badge 100 percent.
	 *
	 * @return void
	 */
	public function test_revision_ranger_100_progress() {

		// Insert 30 posts.
		for ( $i = 0; $i < 30; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'revision-ranger' === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Revision Ranger badge badge over 100 percent, we should top at 100 percent.
	 *
	 * @return void
	 */
	public function test_revision_ranger_over_100_progress() {

		// Insert 40 posts.
		for ( $i = 0; $i < 40; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'revision-ranger' === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Purposeful Publisher badge 50 percent.
	 *
	 * @return void
	 */
	public function test_purposeful_publisher_50_progress() {

		// Insert 25 posts.
		for ( $i = 0; $i < 25; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'purposeful-publisher' === $badge->get_id() ) {
				$this->assertEquals( 50, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Purposeful Publisher badge 100 percent.
	 *
	 * @return void
	 */
	public function test_purposeful_publisher_100_progress() {

		// Insert 50 posts.
		for ( $i = 0; $i < 50; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'purposeful-publisher' === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Test Purposeful Publisher badge badge over 100 percent, we should top at 100 percent.
	 *
	 * @return void
	 */
	public function test_purposeful_publisher_over_100_progress() {

		// Insert 60 posts.
		for ( $i = 0; $i < 60; $i++ ) {
			$this->insert_post( 'Test post ' . $i );
		}

		$group_badges = \progress_planner()->get_badges()->get_badges( 'content' );

		foreach ( $group_badges as $badge ) {
			if ( 'purposeful-publisher' === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );

				// Delete the badge value so it can be re-calculated.
				$badge->clear_progress();
			}
		}
	}

	/**
	 * Insert a post.
	 *
	 * @param string $post_title The title of the post.
	 *
	 * @return int The ID of the post.
	 */
	protected function insert_post( $post_title ) {
		return \wp_insert_post(
			[
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => 1,
				'post_title'  => $post_title,
			]
		);
	}
}
