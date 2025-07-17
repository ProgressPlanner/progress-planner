<?php
/**
 * Class Content_Activity_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Content;
use WP_UnitTestCase;

/**
 * Content activity test case.
 */
class Content_Activity_Test extends \WP_UnitTestCase {

	/**
	 * The content activity instance for testing.
	 *
	 * @var Content
	 */
	private $content_activity;

	/**
	 * Set up test environment.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->content_activity = new Content();
	}

	/**
	 * Test points calculation for non-existent post.
	 *
	 * @return void
	 */
	public function test_get_points_for_nonexistent_post(): void {
		$this->content_activity->data_id = 99999; // Non-existent post ID.
		$this->assertEquals( 0, $this->content_activity->get_points_on_publish_date() );
	}

	/**
	 * Test points decay over time.
	 *
	 * @dataProvider age_decay_provider
	 * @param int   $days_ago       Number of days in the past.
	 * @param float $expected_ratio Expected decay ratio.
	 * @return void
	 */
	public function test_points_decay_over_time( $days_ago, $expected_ratio ): void {
		// Create a test post.
		$post_id = $this->factory()->post->create(
			[
				'post_content' => 'Test content',
				'post_status'  => 'publish',
				'post_date'    => \gmdate( 'Y-m-d H:i:s', \strtotime( "-{$days_ago} days" ) ),
			]
		);

		$content_activity          = new Content();
		$content_activity->data_id = $post_id;
		$content_activity->type    = 'publish';
		$content_activity->date    = new \DateTime( "-{$days_ago} days" );

		$date   = new \DateTime();
		$points = $content_activity->get_points( $date );

		$base_points     = Content::$points_config['publish'];
		$expected_points = $days_ago >= 30 ? 0 : \round( $base_points * $expected_ratio );

		$this->assertEquals( $expected_points, $points );
	}

	/**
	 * Data provider for age decay test.
	 *
	 * @return array[] Array of test cases with days and expected ratios.
	 */
	public function age_decay_provider(): array {
		return [
			'same_day'       => [ 0, 1 ],
			'week_old'       => [ 6, 1 ],
			'two_weeks_old'  => [ 14, 0.53 ], // (1 - 14/30) .
			'almost_expired' => [ 29, 0.03 ], // (1 - 29/30) .
			'expired'        => [ 30, 0 ],
			'very_old'       => [ 45, 0 ],
		];
	}

	/**
	 * Test points caching mechanism.
	 *
	 * @return void
	 */
	public function test_points_caching(): void {
		$post_id = $this->factory()->post->create(
			[
				'post_content' => 'Test content',
				'post_status'  => 'publish',
			]
		);

		$content_activity          = new Content();
		$content_activity->data_id = $post_id;
		$content_activity->type    = 'publish';
		$content_activity->date    = new \DateTime();

		$date = new \DateTime();

		// First call should calculate points.
		$points1 = $content_activity->get_points( $date );

		// Second call should return cached value.
		$points2 = $content_activity->get_points( $date );

		$this->assertEquals( $points1, $points2 );
	}

	/**
	 * Test points calculation for different activity types.
	 *
	 * @return void
	 */
	public function test_different_activity_types(): void {
		$post_id = $this->factory()->post->create(
			[
				'post_content' => 'Test content',
				'post_status'  => 'publish',
			]
		);

		$content_activity          = new Content();
		$content_activity->data_id = $post_id;
		$content_activity->date    = new \DateTime();

		// Test different activity types.
		$types = [
			'publish' => Content::$points_config['publish'],
			'update'  => Content::$points_config['update'],
			'delete'  => Content::$points_config['delete'],
		];

		foreach ( $types as $type => $expected_base_points ) {
			$content_activity->type = $type;
			$points                 = $content_activity->get_points_on_publish_date();
			$this->assertEquals( $expected_base_points, $points );
		}
	}
}
