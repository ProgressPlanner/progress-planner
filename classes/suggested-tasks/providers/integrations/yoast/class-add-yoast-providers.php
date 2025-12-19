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
 * - Taxonomy indexability filtering
 * - Interactive task allowed options
 */
class Add_Yoast_Providers {

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \function_exists( 'YoastSEO' ) ) {
			\add_filter( 'progress_planner_exclude_public_taxonomies', [ $this, 'exclude_not_indexable_taxonomies' ] );

			\add_filter( 'progress_planner_interactive_task_allowed_options', [ $this, 'add_interactive_task_allowed_options' ] );
		}
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
