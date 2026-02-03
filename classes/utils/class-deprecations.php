<?php
/**
 * Deprecations for the Progress Planner plugin.
 *
 * This file contains the Deprecations class which provides deprecation functionality
 * for the Progress Planner plugin.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Class Deprecations
 *
 * Provides deprecation functionality for the Progress Planner plugin.
 */
class Deprecations {

	/**
	 * Deprecated classes.
	 *
	 * @var array
	 */
	const CLASSES = [
		'Progress_Planner\Activity'                        => [ 'Progress_Planner\Activities\Activity', '1.1.1' ],
		'Progress_Planner\Query'                           => [ 'Progress_Planner\Activities\Query', '1.1.1' ],
		'Progress_Planner\Date'                            => [ 'Progress_Planner\Utils\Date', '1.1.1' ],
		'Progress_Planner\Cache'                           => [ 'Progress_Planner\Utils\Cache', '1.1.1' ],
		'Progress_Planner\Rest_API_Stats'                  => [ 'Progress_Planner\Rest\Stats', '1.1.1' ],
		'Progress_Planner\Rest_API_Tasks'                  => [ 'Progress_Planner\Rest\Tasks', '1.1.1' ],
		'Progress_Planner\Data_Collector\Base_Data_Collector' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector', '1.1.1' ],
		'Progress_Planner\Data_Collector\Data_Collector_Manager' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Data_Collector_Manager', '1.1.1' ],
		'Progress_Planner\Data_Collector\Hello_World'      => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World', '1.1.1' ],
		'Progress_Planner\Data_Collector\Inactive_Plugins' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins', '1.1.1' ],
		'Progress_Planner\Data_Collector\Last_Published_Post' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post', '1.1.1' ],
		'Progress_Planner\Data_Collector\Post_Author'      => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author', '1.1.1' ],
		'Progress_Planner\Data_Collector\Sample_Page'      => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page', '1.1.1' ],
		'Progress_Planner\Data_Collector\Uncategorized_Category' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category', '1.1.1' ],
		'Progress_Planner\Chart'                           => [ 'Progress_Planner\UI\Chart', '1.1.1' ],
		'Progress_Planner\Popover'                         => [ 'Progress_Planner\UI\Popover', '1.1.1' ],
		'Progress_Planner\Debug_Tools'                     => [ 'Progress_Planner\Utils\Debug_Tools', '1.1.1' ],
		'Progress_Planner\Onboard'                         => [ 'Progress_Planner\Utils\Onboard', '1.1.1' ],
		'Progress_Planner\Playground'                      => [ 'Progress_Planner\Utils\Playground', '1.1.1' ],
	];

	/**
	 * Deprecated methods for the Base class.
	 *
	 * @var array
	 */
	const BASE_METHODS = [
		'get_query'                                  => [ 'get_activities__query', '1.1.1' ],
		'get_date'                                   => [ 'get_utils__date', '1.1.1' ],
		'get_onboard'                                => [ 'get_utils__onboard', '1.1.1' ],
		'get_cache'                                  => [ 'get_utils__cache', '1.1.1' ],
		'get_rest_api_stats'                         => [ 'get_rest__stats', '1.1.1' ],
		'get_rest_api_tasks'                         => [ 'get_rest__tasks', '1.1.1' ],
		'get_data_collector__data_collector_manager' => [ 'get_suggested_tasks__data_collector__data_collector_manager', '1.1.1' ],
		'get_debug_tools'                            => [ 'get_utils__debug_tools', '1.1.1' ],
		'get_playground'                             => [ 'get_utils__playground', '1.1.1' ],
		'get_chart'                                  => [ 'get_ui__chart', '1.1.1' ],
		'get_popover'                                => [ 'get_ui__popover', '1.1.1' ],

	];
}
