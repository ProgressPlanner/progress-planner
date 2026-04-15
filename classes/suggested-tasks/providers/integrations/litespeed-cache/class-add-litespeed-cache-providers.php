<?php
/**
 * Class to add the LiteSpeed Cache providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache;

/**
 * Add tasks for LiteSpeed Cache configuration.
 */
class Add_Litespeed_Cache_Providers {

	/**
	 * Providers.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache\Litespeed_Cache_Interactive_Provider[]
	 */
	protected $providers = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \defined( 'LSCWP_V' ) ) {
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
			new Page_Cache(),
			new Browser_Cache(),
			new Css_Minification(),
			new Js_Minification(),
			new Image_Lazy_Load(),
			new Guest_Mode(),
		];

		return \array_merge(
			$providers,
			$this->providers
		);
	}
}
