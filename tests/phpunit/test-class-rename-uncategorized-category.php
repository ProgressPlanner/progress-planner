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
class Rename_Uncategorized_Category_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

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

			// Reset cached class property.
			$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'rename-uncategorized-category' );
			$task_provider->set_uncategorized_category( $term->term_id );
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

		// Reset cached class property.
		$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'rename-uncategorized-category' );
		$task_provider->update_uncategorized_category_cache();
	}
}
