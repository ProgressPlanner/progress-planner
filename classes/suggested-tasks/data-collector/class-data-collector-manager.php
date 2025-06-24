<?php
/**
 * Data collector manager.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World;
use Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page;
use Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins;
use Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category;
use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;
use Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post;
use Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Description;
use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Tag_Count;
use Progress_Planner\Suggested_Tasks\Data_Collector\Published_Post_Count;
use Progress_Planner\Suggested_Tasks\Data_Collector\Yoast_Orphaned_Content;

/**
 * Base data collector.
 */
class Data_Collector_Manager {

	/**
	 * The data collectors.
	 *
	 * @var array<Base_Data_Collector>
	 */
	protected $data_collectors = [];

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->data_collectors = [
			new Hello_World(),
			new Sample_Page(),
			new Inactive_Plugins(),
			new Uncategorized_Category(),
			new Post_Author(),
			new Last_Published_Post(),
			new Archive_Format(),
			new Terms_Without_Posts(),
			new Terms_Without_Description(),
			new Post_Tag_Count(),
			new Published_Post_Count(),
		];

		// Add the plugin integration.
		\add_action( 'plugins_loaded', [ $this, 'add_plugin_integration' ] );

		// At all all CPTs and taxonomies are initialized, init the data collectors.
		\add_action( 'init', [ $this, 'init' ], 99 ); // Wait for the post types to be initialized.

		// Add the update action.
		\add_action( 'admin_init', [ $this, 'update_data_collectors_cache' ] );
	}

	/**
	 * Add the data collectors for the plugins we integrate with.
	 *
	 * @return void
	 */
	public function add_plugin_integration() {
		// Yoast SEO integration.
		if ( \function_exists( 'YoastSEO' ) ) {
			$this->data_collectors[] = new Yoast_Orphaned_Content();
		}
	}

	/**
	 * Initialize the task providers.
	 *
	 * @return void
	 */
	public function init() {
		/**
		 * Filter the data collectors.
		 *
		 * @param array $data_collectors The data collectors.
		 */
		$this->data_collectors = \apply_filters( 'progress_planner_data_collectors', $this->data_collectors );

		// Initialize (add hooks) the data collectors.
		foreach ( $this->data_collectors as $data_collector ) {
			$data_collector->init();
		}
	}

	/**
	 * Update the data collectors cache once per day.
	 *
	 * @return void
	 */
	public function update_data_collectors_cache() {
		if ( \progress_planner()->get_utils__cache()->get( 'update_data_collectors_cache' ) ) {
			return;
		}

		foreach ( $this->data_collectors as $data_collector ) {
			$data_collector->update_cache();
		}

		\progress_planner()->get_utils__cache()->set( 'update_data_collectors_cache', true, DAY_IN_SECONDS );
	}
}
