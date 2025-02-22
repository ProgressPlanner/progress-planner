<?php
/**
 * Class to add the Yoast providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

/**
 * Add tasks for Yoast SEO configuration.
 */
class Add_Yoast_Providers {

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( function_exists( 'YoastSEO' ) ) {
			add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_providers' ], 11, 1 );
		}
	}

	/**
	 * Add the providers.
	 *
	 * @param array $providers The providers.
	 * @return array
	 */
	public function add_providers( $providers ) {
		return array_merge(
			$providers,
			[
				new Archive_Author(),
				new Archive_Date(),
				new Archive_Format(),
				new Crawl_Settings(),
				new Media_Pages(),
				new Organization_Logo(),
			]
		);
	}
}
