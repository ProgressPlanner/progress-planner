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

		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'yoast-focus-element',
			[
				'name' => 'progressPlannerYoastFocusElement',
				'data' => [
					'tasks'    => [
						[
							'element' => 'button[data-id="input-wpseo-remove_feed_global_comments"]', // Global comment feeds.
							'checked' => 'true',
						],
						[
							'element' => 'button[data-id="input-wpseo-remove_feed_authors"]', // Post author feeds.
							'checked' => 'true',
						],
						[
							'element' => 'button[data-id="input-wpseo-remove_emoji_scripts"]', // Emoji scripts.
							'checked' => 'true',
						],
						[
							'element' => 'button[data-id="input-wpseo_titles-disable-author"]', // Author archive.
							'checked' => 'false',
						],
						[
							'element' => 'button[data-id="input-wpseo_titles-disable-post_format"]', // Post format archive.
							'checked' => 'false',
						],
						[
							'element' => 'button[data-id="input-wpseo_titles-disable-date"]', // Date archive.
							'checked' => 'false',
						],
						[
							'element' => 'button[data-id="input-wpseo_titles-disable-attachment"]', // Media pages.
							'checked' => 'false',
						],
					],
					'base_url' => constant( 'PROGRESS_PLANNER_URL' ),
				],
			]
		);
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
				new Crawl_Settings_Feed_Global_Comments(),
				new Crawl_Settings_Feed_Authors(),
				new Crawl_Settings_Emoji_Scripts(),
				new Media_Pages(),
				new Organization_Logo(),
			]
		);
	}
}
