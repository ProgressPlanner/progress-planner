<?php
/**
 * The site-score payload an agent reads.
 *
 * Deliberately narrower than the SaaS status endpoint: the active-plugin
 * inventory, site URL and branding ID that endpoint reports are telemetry for
 * progressplanner.com, not something an agent needs to answer a question about
 * site maintenance.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Site_Score class.
 */
class Site_Score {

	/**
	 * Get the site score payload.
	 *
	 * @return array<string, mixed>
	 */
	public function get() {
		return [
			'score'           => (int) \progress_planner()->get_admin__widgets__activity_scores()->get_score(),
			'checklist'       => $this->get_checklist(),
			'pending_updates' => (int) \wp_get_update_data()['counts']['total'],
			'badges'          => $this->get_badges(),
			'latest_badge'    => $this->get_latest_badge(),
			'monthly_scores'  => $this->get_monthly_scores(),
		];
	}

	/**
	 * Get the weekly checklist as named booleans.
	 *
	 * The widget's own results are keyed by translated label, which is not a
	 * stable schema key. The items themselves are in a fixed order, so the
	 * callbacks are invoked positionally and given names that are not.
	 *
	 * @return array<string, bool>
	 */
	public function get_checklist() {
		$items = \progress_planner()->get_admin__widgets__activity_scores()->get_checklist();
		$keys  = [ 'published_content', 'updated_content', 'no_pending_updates' ];

		$checklist = [];
		foreach ( $keys as $index => $key ) {
			$checklist[ $key ] = isset( $items[ $index ]['callback'] ) && \is_callable( $items[ $index ]['callback'] )
				? (bool) $items[ $index ]['callback']()
				: false;
		}

		return $checklist;
	}

	/**
	 * Get the badges and their progress.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_badges() {
		$badges = \array_merge(
			\progress_planner()->get_badges()->get_badges( 'content' ),
			\progress_planner()->get_badges()->get_badges( 'maintenance' )
		);

		$output = [];
		foreach ( $badges as $badge ) {
			$progress = $badge->get_progress();
			$percent  = (int) ( $progress['progress'] ?? 0 );

			$output[] = [
				'id'       => (string) $badge->get_id(),
				'name'     => (string) $badge->get_name(),
				'progress' => $percent,
				'complete' => 100 === $percent,
			];
		}

		return $output;
	}

	/**
	 * Get the most recently completed badge.
	 *
	 * @return array<string, string>|null
	 */
	public function get_latest_badge() {
		$badge = \progress_planner()->get_badges()->get_latest_completed_badge();

		if ( ! $badge ) {
			return null;
		}

		return [
			'id'   => (string) $badge->get_id(),
			'name' => (string) $badge->get_name(),
		];
	}

	/**
	 * Get the normalized monthly score history.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_monthly_scores() {
		$output = [];

		$system_status = new \Progress_Planner\Utils\System_Status();

		foreach ( $system_status->get_monthly_scores() as $item ) {
			$output[] = [
				'month' => (string) $item['label'],
				'score' => (int) \round( (float) $item['score'] ),
			];
		}

		return $output;
	}
}
