<?php
/**
 * Update class for version 1.9.1.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.9.1.
 *
 * @package Progress_Planner
 */
class Update_191 {

	const VERSION = '1.9.1';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->sanitize_recommendation_titles();
	}

	/**
	 * Strip HTML tags from existing recommendation titles.
	 *
	 * Titles are now sanitized on write, but rows stored before that may still
	 * contain markup. This cleans them up.
	 *
	 * @return void
	 */
	private function sanitize_recommendation_titles() {
		// get() defaults to all relevant statuses (publish, trash, draft, future, pending).
		$recommendations = \progress_planner()->get_suggested_tasks_db()->get();

		foreach ( $recommendations as $recommendation ) {
			$sanitized = \sanitize_text_field( \wp_strip_all_tags( $recommendation->post_title ) );

			// Only update if stripping actually changed the title.
			if ( $sanitized !== $recommendation->post_title ) {
				\progress_planner()->get_suggested_tasks_db()->update_recommendation(
					$recommendation->ID,
					[ 'post_title' => $sanitized ]
				);
			}
		}
	}
}
