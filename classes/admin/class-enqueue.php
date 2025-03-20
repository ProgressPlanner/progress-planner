<?php
/**
 * Assets class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Enqueue class.
 */
class Enqueue {

	/**
	 * Have the scripts been registered?
	 *
	 * @var boolean
	 */
	protected static $scripts_registered = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( ! self::$scripts_registered ) {
			\progress_planner()->get_admin__scripts()->register_scripts();
			self::$scripts_registered = true;
		}
	}

	/**
	 * Enqueue script.
	 *
	 * @param string $handle The handle of the script to enqueue.
	 *
	 * @return void
	 */
	public function enqueue_script( $handle ) {
		$this->localize_script( $handle );
		\wp_enqueue_script( $handle );
	}

	/**
	 * Localize script.
	 *
	 * @param string $handle The handle of the script to localize.
	 *
	 * @return void
	 */
	public function localize_script( $handle ) {
	}
}
