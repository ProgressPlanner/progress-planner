<?php
/**
 * Handle user badges.
 *
 * Simplified class that only handles WordPress hooks for progress clearing.
 * Badge logic and calculations are now handled in React.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Badges class.
 */
class Badges {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'progress_planner_suggested_task_completed', [ $this, 'clear_monthly_progress' ] );
		\add_action( 'progress_planner_activity_content_publish_saved', [ $this, 'clear_content_progress' ] );
	}

	/**
	 * Clear the progress of monthly badges when a task is completed.
	 *
	 * This clears saved progress so React can recalculate from activities.
	 *
	 * @param string $activity_id The activity ID.
	 *
	 * @return void
	 */
	public function clear_monthly_progress( $activity_id ) {
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
				'data_id'  => (string) $activity_id,
			]
		);

		if ( empty( $activities ) ) {
			return;
		}

		// Generate monthly badge ID from activity date.
		$activity_date = $activities[0]->date;
		$year          = $activity_date->format( 'Y' );
		$month         = $activity_date->format( 'n' );
		$badge_id      = "monthly-{$year}-m{$month}";

		// Clear saved progress for this monthly badge.
		$settings = \progress_planner()->get_settings();
		$badges   = $settings->get( 'badges', [] );

		// Only clear if badge is not complete (preserve completion date).
		if ( isset( $badges[ $badge_id ] ) && 100 > (int) ( $badges[ $badge_id ]['progress'] ?? 0 ) ) {
			unset( $badges[ $badge_id ] );
			$settings->set( 'badges', $badges );
		}
	}

	/**
	 * Clear the progress of content badges when content is published.
	 *
	 * This clears saved progress so React can recalculate from activities.
	 *
	 * @return void
	 */
	public function clear_content_progress() {
		$settings = \progress_planner()->get_settings();
		$badges   = $settings->get( 'badges', [] );

		$content_badge_ids = [
			'content-curator',
			'revision-ranger',
			'purposeful-publisher',
		];

		$updated = false;
		foreach ( $content_badge_ids as $badge_id ) {
			// Only clear if badge is not complete (preserve completion date).
			if ( isset( $badges[ $badge_id ] ) && 100 > (int) ( $badges[ $badge_id ]['progress'] ?? 0 ) ) {
				unset( $badges[ $badge_id ] );
				$updated = true;
			}
		}

		if ( $updated ) {
			$settings->set( 'badges', $badges );
		}
	}

	/**
	 * Get the latest completed badge across all badge types.
	 *
	 * Reads from saved badge stats to find the most recently completed badge.
	 *
	 * @return array|null Badge data with id and date, or null if none completed.
	 */
	public function get_latest_completed_badge() {
		$settings = \progress_planner()->get_settings()->get( 'badges', [] );

		$latest_date  = null;
		$latest_badge = null;

		foreach ( $settings as $badge_id => $badge_data ) {
			// Skip if not complete or no completion date.
			if ( ! isset( $badge_data['progress'] ) || 100 > (int) $badge_data['progress'] ) {
				continue;
			}
			if ( ! isset( $badge_data['date'] ) ) {
				continue;
			}

			// Compare completion dates.
			$badge_date = \DateTime::createFromFormat( 'Y-m-d H:i:s', $badge_data['date'] );
			if ( ! $badge_date ) {
				continue;
			}

			if ( null === $latest_date || $badge_date->format( 'U' ) >= $latest_date->format( 'U' ) ) {
				$latest_date  = $badge_date;
				$latest_badge = [
					'id'   => $badge_id,
					'date' => $badge_data['date'],
				];
			}
		}

		return $latest_badge;
	}
}
