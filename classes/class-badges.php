<?php
/**
 * Handle user badges.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Badges\Monthly;

/**
 * Badges class.
 */
class Badges {

	/**
	 * Content badges.
	 *
	 * @var \Progress_Planner\Badges\Badge[]
	 */
	private $content = [];

	/**
	 * Maintenance badges.
	 *
	 * @var \Progress_Planner\Badges\Badge[]
	 */
	private $maintenance = [];

	/**
	 * Monthly badges.
	 *
	 * @var \Progress_Planner\Badges\Badge[]
	 */
	private $monthly = [];

	/**
	 * Monthly badges flat.
	 *
	 * @var \Progress_Planner\Badges\Badge[]
	 */
	private $monthly_flat = [];

	/**
	 * Latest completed badge.
	 *
	 * @var \Progress_Planner\Badges\Badge|null
	 */
	private $latest_completed_badge;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->content = [
			\progress_planner()->get_badges__content__content_curator(),
			\progress_planner()->get_badges__content__revision_ranger(),
			\progress_planner()->get_badges__content__purposeful_publisher(),
		];

		$this->maintenance = [
			\progress_planner()->get_badges__maintenance__progress_padawan(),
			\progress_planner()->get_badges__maintenance__maintenance_maniac(),
			\progress_planner()->get_badges__maintenance__super_site_specialist(),
		];

		// Init monthly badges.
		$this->monthly = Monthly::get_instances();
		foreach ( $this->monthly as $monthly_year_badges ) {
			$this->monthly_flat = \array_merge( $this->monthly_flat, $monthly_year_badges );
		}

		\add_action( 'progress_planner_suggested_task_completed', [ $this, 'clear_monthly_progress' ] );
		\add_action( 'progress_planner_activity_content_publish_saved', [ $this, 'clear_content_progress' ] );
	}

	/**
	 * Get the badges for a context.
	 *
	 * @param string $context The badges context (content|maintenance|monthly).
	 *
	 * @return \Progress_Planner\Badges\Badge[]
	 */
	public function get_badges( $context ) {
		return isset( $this->$context ) ? $this->$context : [];
	}

	/**
	 * Get a single badge.
	 *
	 * @param string $badge_id The badge ID.
	 *
	 * @return \Progress_Planner\Badges\Badge|null
	 */
	public function get_badge( $badge_id ) {
		foreach ( [ 'content', 'maintenance', 'monthly_flat' ] as $context ) {
			foreach ( $this->$context as $badge ) {
				if ( $badge->get_id() === $badge_id ) {
					return $badge;
				}
			}
		}
		return null;
	}

	/**
	 * Clear the progress of all monthly badges.
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

		// Clear monthly saved progress.
		$badge_id      = Monthly::get_badge_id_from_date( $activities[0]->date );
		$monthly_badge = $this->get_badge( $badge_id );

		if ( $monthly_badge ) {
			// Clear the progress.
			$monthly_badge->clear_progress();

			// Save the progress.
			$monthly_badge->get_progress();
		}
	}

	/**
	 * Clear the progress of all badges.
	 *
	 * @return void
	 */
	public function clear_content_progress() {
		// Clear content saved progress.
		foreach ( $this->content as $badge ) {
			// If the badge is already complete, skip it.
			if ( 100 <= $badge->progress_callback()['progress'] ) {
				continue;
			}

			// Delete the badge value so it can be re-calculated.
			$badge->clear_progress();
		}
	}

	/**
	 * Get the latest completed badge across all badge types.
	 *
	 * Badge selection algorithm:
	 * 1. Iterates through all badge contexts (content, maintenance, monthly_flat)
	 * 2. For each badge, checks if it's 100% complete
	 * 3. Compares completion dates stored in settings to find the most recent
	 * 4. Returns the badge with the most recent completion date
	 *
	 * The completion date is stored in settings when a badge reaches 100% progress:
	 * - Format: 'Y-m-d H:i:s' (e.g., '2025-10-31 14:30:00')
	 * - Compared as Unix timestamps for accurate chronological ordering
	 * - Later completion dates take precedence (>= comparison ensures newer badges win)
	 *
	 * This is used to:
	 * - Trigger celebrations for newly completed badges
	 * - Track user progress momentum
	 *
	 * @return \Progress_Planner\Badges\Badge|null The most recently completed badge, or null if none completed.
	 */
	public function get_latest_completed_badge() {
		if ( $this->latest_completed_badge ) {
			return $this->latest_completed_badge;
		}

		// Get the settings for badges (stores completion dates).
		$settings = \progress_planner()->get_settings()->get( 'badges', [] );

		$latest_date = null;

		// Loop through all badge contexts to find the most recently completed badge.
		foreach ( [ 'content', 'maintenance', 'monthly_flat' ] as $context ) {
			foreach ( $this->$context as $badge ) {
				// Skip badges that don't have a completion date recorded.
				if ( ! isset( $settings[ $badge->get_id() ]['date'] ) ) {
					continue;
				}

				$badge_progress = $badge->get_progress();

				// Skip badges that aren't 100% complete.
				if ( 100 > (int) $badge_progress['progress'] ) {
					continue;
				}

				// Initialize with the first completed badge found.
				if ( null === $latest_date ) {
					$this->latest_completed_badge = $badge;
					if ( isset( $settings[ $badge->get_id() ]['date'] ) ) {
						$latest_date = $settings[ $badge->get_id() ]['date'];
					}
					continue;
				}

				// Compare completion dates as Unix timestamps to find the most recent.
				// Using >= ensures that if multiple badges complete simultaneously, the last one processed wins.
				if ( \DateTime::createFromFormat( 'Y-m-d H:i:s', $settings[ $badge->get_id() ]['date'] )->format( 'U' ) >= \DateTime::createFromFormat( 'Y-m-d H:i:s', $latest_date )->format( 'U' ) ) {
					$latest_date                  = $settings[ $badge->get_id() ]['date'];
					$this->latest_completed_badge = $badge;
				}
			}
		}

		return $this->latest_completed_badge;
	}
}
