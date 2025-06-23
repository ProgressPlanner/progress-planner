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
		'Progress_Planner\Activity'                   => [ 'Progress_Planner\Activities\Activity', '1.1.1' ],
		'Progress_Planner\Query'                      => [ 'Progress_Planner\Activities\Query', '1.1.1' ],
		'Progress_Planner\Date'                       => [ 'Progress_Planner\Utils\Date', '1.1.1' ],
		'Progress_Planner\Cache'                      => [ 'Progress_Planner\Utils\Cache', '1.1.1' ],
		'Progress_Planner\Widgets\Activity_Scores'    => [ 'Progress_Planner\Admin\Widgets\Activity_Scores', '1.1.1' ],
		'Progress_Planner\Widgets\Badge_Streak'       => [ 'Progress_Planner\Admin\Widgets\Badge_Streak', '1.1.1' ],
		'Progress_Planner\Widgets\Challenge'          => [ 'Progress_Planner\Admin\Widgets\Challenge', '1.1.1' ],
		'Progress_Planner\Widgets\Latest_Badge'       => [ 'Progress_Planner\Admin\Widgets\Latest_Badge', '1.1.1' ],
		'Progress_Planner\Widgets\Published_Content'  => [ 'Progress_Planner\Admin\Widgets\Published_Content', '1.1.1' ],
		'Progress_Planner\Widgets\Todo'               => [ 'Progress_Planner\Admin\Widgets\Todo', '1.1.1' ],
		'Progress_Planner\Widgets\Whats_New'          => [ 'Progress_Planner\Admin\Widgets\Whats_New', '1.1.1' ],
		'Progress_Planner\Widgets\Widget'             => [ 'Progress_Planner\Admin\Widgets\Widget', '1.1.1' ],
		'Progress_Planner\Rest_API_Stats'             => [ 'Progress_Planner\Rest\Stats', '1.1.1' ],
		'Progress_Planner\Rest_API_Tasks'             => [ 'Progress_Planner\Rest\Tasks', '1.1.1' ],
		'Progress_Planner\Data_Collector\Base_Data_Collector' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector', '1.1.1' ],
		'Progress_Planner\Data_Collector\Data_Collector_Manager' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Data_Collector_Manager', '1.1.1' ],
		'Progress_Planner\Data_Collector\Hello_World' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World', '1.1.1' ],
		'Progress_Planner\Data_Collector\Inactive_Plugins' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Inactive_Plugins', '1.1.1' ],
		'Progress_Planner\Data_Collector\Last_Published_Post' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post', '1.1.1' ],
		'Progress_Planner\Data_Collector\Post_Author' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author', '1.1.1' ],
		'Progress_Planner\Data_Collector\Sample_Page' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page', '1.1.1' ],
		'Progress_Planner\Data_Collector\Uncategorized_Category' => [ 'Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category', '1.1.1' ],
		'Progress_Planner\Chart'                      => [ 'Progress_Planner\UI\Chart', '1.1.1' ],
		'Progress_Planner\Popover'                    => [ 'Progress_Planner\UI\Popover', '1.1.1' ],
		'Progress_Planner\Debug_Tools'                => [ 'Progress_Planner\Utils\Debug_Tools', '1.1.1' ],
		'Progress_Planner\Onboard'                    => [ 'Progress_Planner\Utils\Onboard', '1.1.1' ],
		'Progress_Planner\Playground'                 => [ 'Progress_Planner\Utils\Playground', '1.1.1' ],

		'Progress_Planner\Admin\Widgets\Published_Content' => [ 'Progress_Planner\Admin\Widgets\Content_Activity', '1.3.0' ],

		'Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local' => [ 'Progress_Planner\Suggested_Tasks\Task', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Interface' => [ 'Progress_Planner\Suggested_Tasks\Tasks_Interface', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks_Manager' => [ 'Progress_Planner\Suggested_Tasks\Tasks_Manager', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory' => [ 'Progress_Planner\Suggested_Tasks\Task_Factory', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time' => [ 'Progress_Planner\Suggested_Tasks\Providers\Task', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive' => [ 'Progress_Planner\Suggested_Tasks\Providers\Repetitive', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks' => [ 'Progress_Planner\Suggested_Tasks\Providers\Tasks', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\User' => [ 'Progress_Planner\Suggested_Tasks\Providers\User', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Add_Yoast_Providers' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Add_Yoast_Providers', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Archive_Author' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Archive_Author', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Archive_Date' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Archive_Date', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Archive_Format' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Archive_Format', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Emoji_Scripts' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Emoji_Scripts', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Feed_Authors' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Feed_Authors', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Feed_Global_Comments' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Crawl_Settings_Feed_Global_Comments', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Media_Pages' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Media_Pages', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Organization_Logo' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Organization_Logo', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast\Yoast_Provider' => [ 'Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Yoast_Provider', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Blog_Description' => [ 'Progress_Planner\Suggested_Tasks\Providers\Blog_Description', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Debug_Display' => [ 'Progress_Planner\Suggested_Tasks\Providers\Debug_Display', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Disable_Comments' => [ 'Progress_Planner\Suggested_Tasks\Providers\Disable_Comments', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Hello_World' => [ 'Progress_Planner\Suggested_Tasks\Providers\Hello_World', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Permalink_Structure' => [ 'Progress_Planner\Suggested_Tasks\Providers\Permalink_Structure', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Php_Version' => [ 'Progress_Planner\Suggested_Tasks\Providers\Php_Version', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Remove_Inactive_Plugins' => [ 'Progress_Planner\Suggested_Tasks\Providers\Remove_Inactive_Plugins', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Rename_Uncategorized_Category' => [ 'Progress_Planner\Suggested_Tasks\Providers\Rename_Uncategorized_Category', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Sample_Page' => [ 'Progress_Planner\Suggested_Tasks\Providers\Sample_Page', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Search_Engine_Visibility' => [ 'Progress_Planner\Suggested_Tasks\Providers\Search_Engine_Visibility', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Set_Valuable_Post_Types' => [ 'Progress_Planner\Suggested_Tasks\Providers\Set_Valuable_Post_Types', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Settings_Saved' => [ 'Progress_Planner\Suggested_Tasks\Providers\Settings_Saved', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time\Site_Icon' => [ 'Progress_Planner\Suggested_Tasks\Providers\Site_Icon', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Core_Update' => [ 'Progress_Planner\Suggested_Tasks\Providers\Core_Update', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Create' => [ 'Progress_Planner\Suggested_Tasks\Providers\Repetitive\Create', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Review' => [ 'Progress_Planner\Suggested_Tasks\Providers\Repetitive\Review', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task_Factory' => [ 'Progress_Planner\Suggested_Tasks\Task_Factory', '1.4.0' ],
		'Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task' => [ 'Progress_Planner\Suggested_Tasks\Task', '1.4.0' ],
	];

	/**
	 * Deprecated methods for the Base class.
	 *
	 * @var array
	 */
	const BASE_METHODS = [
		'get_query'                                  => [ 'get_activities__query', '1.1.1' ],
		'get_date'                                   => [ 'get_utils__date', '1.1.1' ],
		'get_widgets__suggested_tasks'               => [ 'get_admin__widgets__suggested_tasks', '1.1.1' ],
		'get_widgets__activity_scores'               => [ 'get_admin__widgets__activity_scores', '1.1.1' ],
		'get_widgets__todo'                          => [ 'get_admin__widgets__todo', '1.1.1' ],
		'get_widgets__challenge'                     => [ 'get_admin__widgets__challenge', '1.1.1' ],
		'get_widgets__latest_badge'                  => [ 'get_admin__widgets__latest_badge', '1.1.1' ],
		'get_widgets__badge_streak'                  => [ 'get_admin__widgets__badge_streak', '1.1.1' ],
		'get_widgets__published_content'             => [ 'get_admin__widgets__published_content', '1.1.1' ],
		'get_widgets__whats_new'                     => [ 'get_admin__widgets__whats_new', '1.1.1' ],
		'get_onboard'                                => [ 'get_utils__onboard', '1.1.1' ],
		'get_cache'                                  => [ 'get_utils__cache', '1.1.1' ],
		'get_rest_api_stats'                         => [ 'get_rest__stats', '1.1.1' ],
		'get_rest_api_tasks'                         => [ 'get_rest__tasks', '1.1.1' ],
		'get_data_collector__data_collector_manager' => [ 'get_suggested_tasks__data_collector__data_collector_manager', '1.1.1' ],
		'get_debug_tools'                            => [ 'get_utils__debug_tools', '1.1.1' ],
		'get_playground'                             => [ 'get_utils__playground', '1.1.1' ],
		'get_chart'                                  => [ 'get_ui__chart', '1.1.1' ],
		'get_popover'                                => [ 'get_ui__popover', '1.1.1' ],

		'get_admin__widgets__published_content'      => [ 'get_admin__widgets__content_activity', '1.3.0' ],
	];
}
