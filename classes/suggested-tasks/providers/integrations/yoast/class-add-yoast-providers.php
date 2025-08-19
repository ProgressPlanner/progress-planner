<?php
/**
 * Class to add the Yoast providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add tasks for Yoast SEO configuration.
 */
class Add_Yoast_Providers {

	/**
	 * Providers.
	 *
	 * @var (\Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Yoast_Provider|\Progress_Planner\Suggested_Tasks\Providers\Tasks)[]
	 */
	protected $providers = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \function_exists( 'YoastSEO' ) ) {
			\add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_providers' ], 11, 1 );
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );

			\add_filter( 'progress_planner_exclude_public_taxonomies', [ $this, 'exclude_not_indexable_taxonomies' ] );
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
			// Add Ravi icon if the task is published or is completed.
			if ( $provider->is_task_relevant() || \progress_planner()->get_suggested_tasks()->was_task_completed( $provider->get_task_id() ) ) {
				if ( \method_exists( $provider, 'get_focus_tasks' ) ) {
					$focus_task = $provider->get_focus_tasks();

					if ( $focus_task ) {
						$focus_tasks = \array_merge( $focus_tasks, $focus_task );
					}
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
					'base_url' => \constant( 'PROGRESS_PLANNER_URL' ),
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

		// Yoast SEO Premium.
		if ( \defined( 'WPSEO_PREMIUM_VERSION' ) ) {
			$this->providers[] = new Cornerstone_Workout();
			$this->providers[] = new Orphaned_Content_Workout();
		}

		return \array_merge(
			$providers,
			$this->providers
		);
	}

	/**
	 * Exclude taxonomies which are marked as not indexable in Yoast SEO.
	 *
	 * @param array $exclude_taxonomies The taxonomies.
	 * @return array
	 */
	public function exclude_not_indexable_taxonomies( $exclude_taxonomies ) {
		foreach ( \YoastSEO()->helpers->taxonomy->get_public_taxonomies() as $taxonomy ) {
			if ( ! \in_array( $taxonomy, $exclude_taxonomies, true ) && false === \YoastSEO()->helpers->taxonomy->is_indexable( $taxonomy ) ) {
				$exclude_taxonomies[] = $taxonomy;
			}
		}

		return $exclude_taxonomies;
	}
}
