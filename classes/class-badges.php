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
	 * Maintenance badges.
	 *
	 * @var array<\Progress_Planner\Badges\Badge>
	 */
	private $maintenance = [];

	/**
	 * Monthly badges.
	 *
	 * @var array<\Progress_Planner\Badges\Badge>
	 */
	private $monthly = [];

	/**
	 * Monthly badges flat.
	 *
	 * @var array<\Progress_Planner\Badges\Badge>
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
		$this->maintenance = [
			\progress_planner()->get_badges__maintenance__progress_padawan(),
			\progress_planner()->get_badges__maintenance__maintenance_maniac(),
			\progress_planner()->get_badges__maintenance__super_site_specialist(),
		];

		// Init monthly badges.
		$this->monthly = Monthly::get_instances();
		foreach ( $this->monthly as $monthly_year_badges ) {
			$this->monthly_flat = array_merge( $this->monthly_flat, $monthly_year_badges );
		}

		\add_action( 'progress_planner_suggested_task_completed', [ $this, 'clear_monthly_progress' ] );
	}

	/**
	 * Get the badges for a context.
	 *
	 * @param string $context The badges context (maintenance|monthly).
	 *
	 * @return array<\Progress_Planner\Badges\Badge>
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
		foreach ( [ 'maintenance', 'monthly_flat' ] as $context ) {
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

		$activities = \progress_planner()->get_query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
				'data_id'  => (string) $activity_id,
			],
			'ACTIVITIES'
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
	 * Get the latest completed badge.
	 *
	 * @return \Progress_Planner\Badges\Badge|null
	 */
	public function get_latest_completed_badge() {
		if ( $this->latest_completed_badge ) {
			return $this->latest_completed_badge;
		}

		// Get the settings for badges.
		$settings = \progress_planner()->get_settings()->get( 'badges', [] );

		$latest_date = null;

		foreach ( [ 'maintenance', 'monthly_flat' ] as $context ) {
			foreach ( $this->$context as $badge ) {
				// Skip if the badge has no date.
				if ( ! isset( $settings[ $badge->get_id() ]['date'] ) ) {
					continue;
				}

				$badge_progress = $badge->get_progress();

				// Continue if the badge is not completed.
				if ( 100 > (int) $badge_progress['progress'] ) {
					continue;
				}

				// Set the first badge as the latest.
				if ( null === $latest_date ) {
					$this->latest_completed_badge = $badge;
					if ( isset( $settings[ $badge->get_id() ]['date'] ) ) {
						$latest_date = $settings[ $badge->get_id() ]['date'];
					}
					continue;
				}

				// Compare dates.
				if ( \DateTime::createFromFormat( 'Y-m-d H:i:s', $settings[ $badge->get_id() ]['date'] )->format( 'U' ) >= \DateTime::createFromFormat( 'Y-m-d H:i:s', $latest_date )->format( 'U' ) ) {
					$latest_date                  = $settings[ $badge->get_id() ]['date'];
					$this->latest_completed_badge = $badge;
				}
			}
		}

		return $this->latest_completed_badge;
	}
}
