<?php
/**
 * Class Badges_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activity;
use Progress_Planner\Badges\Monthly;

/**
 * Badges test case.
 */
class Badges_Test extends \WP_UnitTestCase {

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
	}

	/**
	 * Test the content badges.
	 *
	 * @return void
	 */
	public function test_content_badges() {

		$badges = \progress_planner()->get_badges()->get_badges( 'content' );

		$this->assertCount( 3, $badges );
	}

	/**
	 * Test the maintenance badges.
	 *
	 * @return void
	 */
	public function test_maintenance_badges() {

		$badges = \progress_planner()->get_badges()->get_badges( 'maintenance' );

		$this->assertCount( 3, $badges );
	}

	/**
	 * Test the monthly badges.
	 *
	 * @return void
	 */
	public function test_monthly_badges() {

		$badges = \progress_planner()->get_badges()->get_badges( 'monthly' );

		$this->assertNotEmpty( $badges[ \gmdate( 'Y' ) ] );
	}

	/**
	 * Test the monthly_flat badges.
	 *
	 * @return void
	 */
	public function test_monthly_flat_badges() {

		$badges = \progress_planner()->get_badges()->get_badges( 'monthly_flat' );

		$data['badges'] = [];
		foreach ( $badges as $badge ) {
			$data['badges'][ $badge->get_id() ] = array_merge(
				[
					'id'   => $badge->get_id(),
					'name' => $badge->get_name(),
				],
				$badge->progress_callback()
			);
		}
	}
}
