<?php
/**
 * Class to add the AIOSEO providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add tasks for All in One SEO configuration.
 */
class Add_AIOSEO_Providers {

	/**
	 * Providers.
	 *
	 * @var (\Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO\AIOSEO_Provider|\Progress_Planner\Suggested_Tasks\Providers\Tasks)[]
	 */
	protected $providers = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \function_exists( 'aioseo' ) ) {
			\add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_providers' ], 11, 1 );
		}
	}

	/**
	 * Add the providers.
	 *
	 * @param array $providers The providers.
	 * @return array
	 */
	public function add_providers( $providers ) {
		$this->providers = [
			new Archive_Author(),
			new Archive_Date(),
			new Media_Pages(),
			new Crawl_Settings_Feed_Authors(),
			new Crawl_Settings_Feed_Global_Comments(),
			new Organization_Logo(),
		];

		return \array_merge(
			$providers,
			$this->providers
		);
	}
}
