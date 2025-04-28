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
	 * Providers.
	 *
	 * @var array
	 */
	protected $providers = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( function_exists( 'YoastSEO' ) ) {
			\add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_providers' ], 11, 1 );

			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		}
	}

	/**
	 * Enqueue the assets.
	 *
	 * @param string $hook The hook.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'seo_page_wpseo_page_settings' !== $hook ) {
			return;
		}

		$focus_tasks = [];

		foreach ( $this->providers as $provider ) {

			// Add Ravi icon if the task is pending or is completed.
			if ( $provider->is_task_relevant() || \progress_planner()->get_suggested_tasks()->was_task_completed( $provider->get_task_id() ) ) {
				$focus_task = $provider->get_focus_tasks();

				if ( $focus_task ) {
					$focus_tasks = array_merge( $focus_tasks, $focus_task );
				}
			}
		}

		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'yoast-focus-element',
			[
				'name' => 'progressPlannerYoastFocusElement',
				'data' => [
					'tasks'    => $focus_tasks,
					'base_url' => constant( 'PROGRESS_PLANNER_URL' ),
				],
			]
		);

		// Enqueue the style.
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/focus-element' );
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
			new Archive_Format(),
			new Crawl_Settings_Feed_Global_Comments(),
			new Crawl_Settings_Feed_Authors(),
			new Crawl_Settings_Emoji_Scripts(),
			new Media_Pages(),
			new Organization_Logo(),
			new Fix_Orphaned_Content(),
		];
		return array_merge(
			$providers,
			$this->providers
		);
	}
}
