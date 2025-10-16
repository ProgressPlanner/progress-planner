<?php
/**
 * Data collector for search template detection.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Search template data collector.
 */
class Search_Template extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'search_template';

	/**
	 * Calculate the data.
	 *
	 * Returns an array with:
	 * - has_search_template: bool
	 * - is_block_theme: bool
	 * - theme_name: string
	 * - template_source: string (database|filesystem|none)
	 * - template_id: string|false
	 *
	 * @return array
	 */
	protected function calculate_data() {
		$is_block_theme      = \wp_is_block_theme();
		$theme               = \wp_get_theme();
		$has_search_template = false;
		$template_source     = 'none';
		$template_id         = false;

		if ( $is_block_theme ) {
			// Use WordPress Core function to check for search template.
			// This checks both the database (user-created templates) and filesystem.
			$theme_slug       = \get_stylesheet();
			$search_template  = \get_block_template( $theme_slug . '//search', 'wp_template' );

			if ( $search_template ) {
				$has_search_template = true;
				$template_id         = $search_template->id;
				// Determine if template is from database or filesystem.
				// Templates from database have a 'wp_id' property.
				$template_source = ! empty( $search_template->wp_id ) ? 'database' : 'filesystem';
			}
		} else {
			// Check for classic theme search template.
			$search_template = \locate_template( [ 'search.php' ] );
			if ( $search_template ) {
				$has_search_template = true;
				$template_source     = 'filesystem';
				$template_id         = $search_template;
			}
		}

		return [
			'has_search_template' => $has_search_template,
			'is_block_theme'      => $is_block_theme,
			'theme_name'          => $theme->get( 'Name' ),
			'template_source'     => $template_source,
			'template_id'         => $template_id,
		];
	}
}
