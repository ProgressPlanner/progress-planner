<?php
/**
 * Badge object.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Badges;

/**
 * Badge class.
 */
abstract class Badge {

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected string $id;

	/**
	 * The icon URL.
	 *
	 * @var string
	 */
	protected string $icon_url;

	/**
	 * The background color for the badge.
	 *
	 * @var string
	 */
	protected string $background = 'none';

	/**
	 * Get the badge ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * Get the badge name.
	 *
	 * @return string
	 */
	abstract public function get_name(): string;

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	abstract public function get_description(): string;

	/**
	 * Progress callback.
	 *
	 * @param array $args The arguments for the progress callback.
	 *
	 * @return array
	 */
	abstract public function progress_callback( array $args = [] ): array;

	/**
	 * Get the saved progress.
	 *
	 * @return array
	 */
	protected function get_saved(): array {
		return \progress_planner()->get_settings()->get( [ 'badges', $this->id ], [] );
	}

	/**
	 * Get the badge progress.
	 *
	 * @return array
	 */
	public function get_progress(): array {
		return $this->progress_callback();
	}

	/**
	 * Save the progress.
	 *
	 * @param array $progress The progress to save.
	 *
	 * @return void
	 */
	protected function save_progress( array $progress ): void {
		$progress['date'] = ( new \DateTime() )->format( 'Y-m-d H:i:s' );
		\progress_planner()->get_settings()->set( [ 'badges', $this->id ], $progress );
	}

	/**
	 * Clear the saved progress.
	 *
	 * @return void
	 */
	public function clear_progress(): void {
		\progress_planner()->get_settings()->set( [ 'badges', $this->id ], [] );
	}

	/**
	 * Get the background color for the badge.
	 *
	 * @return string
	 */
	public function get_background(): string {
		return $this->background;
	}
}
