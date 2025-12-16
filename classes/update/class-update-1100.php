<?php
/**
 * Update class for version 1.10.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.10.0.
 *
 * @package Progress_Planner
 */
class Update_1100 {

	const VERSION = '1.10.0';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Delete the prpl_redirect_on_login user meta for all users.
		// The settings page has been removed, so users can no longer change this setting.
		$this->delete_redirect_on_login_user_meta();
	}

	/**
	 * Delete the prpl_redirect_on_login user meta for all users.
	 *
	 * The settings page that allowed users to set their login destination
	 * has been removed. This migration deletes the user meta to prevent
	 * users from being redirected to Progress Planner after login.
	 *
	 * @return void
	 */
	private function delete_redirect_on_login_user_meta() {
		global $wpdb;

		// Delete the user meta for all users directly from the database.
		// This is more efficient than looping through all users.
		$wpdb->delete( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->usermeta, // @phpstan-ignore-line property.nonObject
			[ 'meta_key' => 'prpl_redirect_on_login' ], // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			[ '%s' ]
		);
	}
}
