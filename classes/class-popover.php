<?php
/**
 * Popover base class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Popover base class.
 */
class Popover {

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Get a popover instance.
	 *
	 * @param string $id The popover ID.
	 *
	 * @return self
	 */
	public function the_popover( $id ) {
		$popover     = new self();
		$popover->id = $id;
		return $popover;
	}

	/**
	 * Render the triggering button.
	 *
	 * @param string $icon    The dashicon to use.
	 * @param string $content The content to use.
	 * @return void
	 */
	public function render_button( $icon, $content ) {
		\progress_planner()->the_view(
			'popovers/parts/icon.php',
			[
				'prpl_popover_id'              => $this->id,
				'prpl_popover_trigger_icon'    => $icon,
				'prpl_popover_trigger_content' => $content,
			]
		);
	}

	/**
	 * Render the widget content.
	 *
	 * @return void
	 */
	public function render() {
		\progress_planner()->the_view(
			'popovers/popover.php',
			[
				'prpl_popover_id' => $this->id,
			]
		);
	}
}
