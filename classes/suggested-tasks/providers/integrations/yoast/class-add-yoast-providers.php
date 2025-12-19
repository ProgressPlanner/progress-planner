<?php
/**
 * Class to add the Yoast providers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add tasks for Yoast SEO configuration.
 *
 * Note: Yoast task providers have been migrated to React.
 * This class now only handles:
 * - Focus element highlighting on Yoast settings page
 * - Taxonomy indexability filtering
 * - Interactive task allowed options
 */
class Add_Yoast_Providers {

	/**
	 * Focus tasks configuration.
	 *
	 * Static configuration for focus element highlighting on Yoast settings page.
	 * Each entry maps a provider ID to its focus tasks and relevance check.
	 *
	 * @var array<string, array{focus_tasks: array, relevance_check: string|null, relevance_threshold: int}>
	 */
	private const FOCUS_TASKS_CONFIG = [
		'yoast-author-archive'                    => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo_titles-disable-author"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'false',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => 'post_author_count',
			'relevance_threshold' => 1,
		],
		'yoast-date-archive'                      => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo_titles-disable-date"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'false',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => 'permalink_has_date',
			'relevance_threshold' => 0, // 0 means permalink should NOT have date.
		],
		'yoast-format-archive'                    => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo_titles-disable-post_format"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'false',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => 'archive_format_count',
			'relevance_threshold' => 3,
		],
		'yoast-crawl-settings-emoji-scripts'      => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo-remove_emoji_scripts"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'true',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => null, // Always relevant.
			'relevance_threshold' => 0,
		],
		'yoast-crawl-settings-feed-authors'       => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo-remove_feed_authors"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'true',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => 'post_author_count',
			'relevance_threshold' => 1,
		],
		'yoast-crawl-settings-feed-global-comments' => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo-remove_feed_global_comments"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'true',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => null, // Always relevant.
			'relevance_threshold' => 0,
		],
		'yoast-media-pages'                       => [
			'focus_tasks'        => [
				[
					'iconElement'  => '.yst-toggle-field__header',
					'valueElement' => [
						'elementSelector' => 'button[data-id="input-wpseo_titles-disable-attachment"]',
						'attributeName'   => 'aria-checked',
						'attributeValue'  => 'false',
						'operator'        => '=',
					],
				],
			],
			'relevance_check'    => null, // Always relevant.
			'relevance_threshold' => 0,
		],
		'yoast-organization-logo'                 => [
			'focus_tasks'        => [
				[
					'iconElement'  => 'legend.yst-label',
					'valueElement' => [
						'elementSelector' => 'input[name="wpseo_titles.company_logo"]',
						'attributeName'   => 'value',
						'attributeValue'  => '',
						'operator'        => '!=',
					],
				],
				[
					'iconElement'  => 'legend.yst-label',
					'valueElement' => [
						'elementSelector' => 'input[name="wpseo_titles.person_logo"]',
						'attributeName'   => 'value',
						'attributeValue'  => '',
						'operator'        => '!=',
					],
				],
			],
			'relevance_check'    => null, // Always relevant (complex check handled by React).
			'relevance_threshold' => 0,
		],
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \function_exists( 'YoastSEO' ) ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );

			\add_filter( 'progress_planner_exclude_public_taxonomies', [ $this, 'exclude_not_indexable_taxonomies' ] );

			\add_filter( 'progress_planner_interactive_task_allowed_options', [ $this, 'add_interactive_task_allowed_options' ] );
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

		foreach ( self::FOCUS_TASKS_CONFIG as $provider_id => $config ) {
			// Check if task is relevant or was completed.
			if ( $this->is_task_relevant( $provider_id, $config ) || $this->was_task_completed( $provider_id ) ) {
				$focus_tasks = \array_merge( $focus_tasks, $config['focus_tasks'] );
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
	 * Check if a task is relevant based on its configuration.
	 *
	 * @param string $provider_id The provider ID.
	 * @param array  $config      The focus tasks configuration.
	 *
	 * @return bool
	 */
	private function is_task_relevant( string $provider_id, array $config ): bool {
		// If no relevance check, always relevant.
		if ( null === $config['relevance_check'] ) {
			return true;
		}

		$collector_id = $config['relevance_check'];
		$threshold    = $config['relevance_threshold'];

		// Get data from collector.
		$data = $this->get_collector_data( $collector_id );

		// Special case for permalink_has_date - relevant when permalink does NOT have date.
		if ( 'permalink_has_date' === $collector_id ) {
			return false === $data;
		}

		// For numeric thresholds, check if data is at or below threshold.
		return $data <= $threshold;
	}

	/**
	 * Get data from a data collector.
	 *
	 * @param string $collector_id The collector ID.
	 *
	 * @return mixed The collected data.
	 */
	private function get_collector_data( string $collector_id ) {
		$collector_map = [
			'post_author_count'    => \Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author::class,
			'archive_format_count' => \Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format::class,
			'permalink_has_date'   => \Progress_Planner\Suggested_Tasks\Data_Collector\Permalink_Has_Date::class,
		];

		if ( ! isset( $collector_map[ $collector_id ] ) ) {
			return null;
		}

		$collector_class = $collector_map[ $collector_id ];
		$collector       = new $collector_class();

		return $collector->collect();
	}

	/**
	 * Check if a task was completed.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return bool
	 */
	private function was_task_completed( string $provider_id ): bool {
		return \progress_planner()->get_suggested_tasks()->was_task_completed( $provider_id );
	}

	/**
	 * Exclude taxonomies which are marked as not indexable in Yoast SEO.
	 *
	 * @param array $exclude_taxonomies The taxonomies.
	 * @return array
	 */
	public function exclude_not_indexable_taxonomies( $exclude_taxonomies ) {
		foreach ( \YoastSEO()->helpers->taxonomy->get_public_taxonomies() as $taxonomy ) { // @phpstan-ignore-line property.nonObject
			if ( ! \in_array( $taxonomy, $exclude_taxonomies, true )
				&& false === \YoastSEO()->helpers->taxonomy->is_indexable( $taxonomy ) // @phpstan-ignore-line property.nonObject
			) {
				$exclude_taxonomies[] = $taxonomy;
			}
		}

		return $exclude_taxonomies;
	}

	/**
	 * Add the interactive task allowed options.
	 *
	 * @param array $allowed_options The allowed options.
	 * @return array
	 */
	public function add_interactive_task_allowed_options( $allowed_options ) {
		$allowed_options[] = 'wpseo';
		$allowed_options[] = 'wpseo_titles';
		return $allowed_options;
	}
}
