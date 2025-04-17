<?php
/**
 * Uninstall the plugin.
 *
 * Deletes the custom database tables, and the plugin options.
 *
 * @package Progress_Planner
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

require_once __DIR__ . '/classes/class-settings.php';
require_once __DIR__ . '/classes/activities/class-query.php';

/**
 * Delete the plugin options.
 *
 * Keeps the badges and activation date.
 *
 * @return void
 */
function progress_planner_cleanup_options() {
	$value = get_option( \Progress_Planner\Settings::OPTION_NAME, [] );
	$keep  = [ 'badges', 'activation_date' ];
	foreach ( array_keys( $value ) as $key ) { // @phpstan-ignore-line argument.type
		if ( ! in_array( $key, $keep, true ) ) {
			unset( $value[ $key ] ); // @phpstan-ignore-line offsetAccess.nonOffsetAccessible
		}
	}
	update_option( \Progress_Planner\Settings::OPTION_NAME, $value );
}
progress_planner_cleanup_options();

// Delete the custom database tables.
global $wpdb;
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query(
	$wpdb->prepare(
		// phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnsupportedIdentifierPlaceholder, WordPress.DB.DirectDatabaseQuery.SchemaChange
		'DROP TABLE IF EXISTS %i',
		$wpdb->prefix . \Progress_Planner\Activities\Query::TABLE_NAME
	)
);
