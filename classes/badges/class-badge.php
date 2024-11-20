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
	protected $id;

	/**
	 * The icon URL.
	 *
	 * @var string
	 */
	protected $icon_url;

	/**
	 * Get the badge ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Get the badge name.
	 *
	 * @return string
	 */
	abstract public function get_name();

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	abstract public function get_description();

	/**
	 * Progress callback.
	 *
	 * @return array
	 */
	abstract public function progress_callback();

	/**
	 * Get the saved progress.
	 *
	 * @return array
	 */
	protected function get_saved() {
		return \progress_planner()->get_settings()->get( [ 'badges', $this->id ], [] );
	}

	/**
	 * Get the badge progress.
	 *
	 * @return array
	 */
	public function get_progress() {
		return $this->progress_callback();
	}

	/**
	 * Save the progress.
	 *
	 * @param array $progress The progress to save.
	 *
	 * @return void
	 */
	protected function save_progress( $progress ) {
		$progress['date'] = ( new \DateTime() )->format( 'Y-m-d H:i:s' );
		\progress_planner()->get_settings()->set( [ 'badges', $this->id ], $progress );
	}

	/**
	 * Clear the saved progress.
	 *
	 * @return void
	 */
	public function clear_progress() {
		\progress_planner()->get_settings()->set( [ 'badges', $this->id ], [] );
	}

	/**
	 * Print the icon.
	 *
	 * @param bool $complete Whether the badge is complete.
	 *
	 * @return void
	 */
	public function the_icon( $complete = false ) {
		?>
		<prpl-badge
			class="prpl-badge-icon-image <?php echo $complete ? 'complete' : 'incomplete'; ?>"
			badge-id="<?php echo esc_attr( $this->id ); ?>"
		></prpl-badge>
		<?php
	}
}
