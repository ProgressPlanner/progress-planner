<?php
/**
 * Data collector manager.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Data_Collector;

use Progress_Planner\Data_Collector\Hello_World;
use Progress_Planner\Data_Collector\Sample_Page;
use Progress_Planner\Data_Collector\Inactive_Plugins;
use Progress_Planner\Data_Collector\Uncategorized_Category;
use Progress_Planner\Data_Collector\Post_Author;
use Progress_Planner\Data_Collector\Create_Post;

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
			new Create_Post(),
		];

		// Initialize (add hooks) the data collectors.
		foreach ( $this->data_collectors as $data_collector ) {
			$data_collector->init();
		}

		// Add the update action.
		\add_action( 'admin_init', [ $this, 'update_data_collectors_cache' ] );
	}

	/**
	 * Update the data collectors cache once per day.
	 *
	 * @return void
	 */
	public function update_data_collectors_cache() {

		$update_recently_performed = \progress_planner()->get_cache()->get( 'update_data_collectors_cache' );

		if ( $update_recently_performed ) {
			return;
		}

		foreach ( $this->data_collectors as $data_collector ) {
			$data_collector->update_cache();
		}

		\progress_planner()->get_cache()->set( 'update_data_collectors_cache', true, DAY_IN_SECONDS );
	}
}
