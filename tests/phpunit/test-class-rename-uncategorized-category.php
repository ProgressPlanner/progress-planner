<?php
/**
 * Class Rename_Uncategorized_Category_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Rename Uncategorized Category test case.
 */
class Rename_Uncategorized_Category_Test extends Task_Provider_Test_Abstract {

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'rename-uncategorized-category';

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public static function tearDownAfterClass(): void {
		parent::tearDownAfterClass();

		$term = \get_term_by( 'slug', 'better-category-name', 'category' );

		if ( $term ) {
			\wp_update_term(
				$term->term_id,
				'category',
				[
					'name' => 'Uncategorized',
					'slug' => 'uncategorized',
				]
			);
		}
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		$term = \get_term_by( 'slug', 'uncategorized', 'category' );

		\wp_update_term(
			$term->term_id,
			'category',
			[
				'name' => 'Better Category Name',
				'slug' => 'better-category-name',
			]
		);
	}
}
