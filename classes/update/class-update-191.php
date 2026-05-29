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
		$db = \progress_planner()->get_suggested_tasks_db();

		// get() defaults to all relevant statuses (publish, trash, draft, future, pending).
		$recommendations = $db->get();

		foreach ( $recommendations as $recommendation ) {
			$sanitized = \sanitize_text_field( \wp_strip_all_tags( $recommendation->post_title ) );

			// Nothing to do if stripping didn't change the title.
			if ( $sanitized === $recommendation->post_title ) {
				continue;
			}

			// A title that was pure markup strips to an empty string. The plugin
			// never stores title-less recommendations (Suggested_Tasks_DB::add()
			// rejects them), so such a row is junk - delete it. This also avoids
			// WordPress's empty-content guard, which would otherwise reject an
			// update that leaves the title empty and leave the markup in place.
			if ( '' === $sanitized ) {
				$db->delete_recommendation( (int) $recommendation->ID );
				continue;
			}

			$db->update_recommendation( $recommendation->ID, [ 'post_title' => $sanitized ] );
		}
	}
}
