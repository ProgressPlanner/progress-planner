<?php
/**
 * Class for branding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\UI;

/**
 * Class for branding.
 */
final class Branding {

	/**
	 * Print the logo.
	 *
	 * @return void
	 */
	public static function the_logo(): void {
		if ( \has_action( 'progress_planner_branding_logo' ) ) {
			/**
			 * Short-circuit the logo rendering.
			 */
			\do_action( 'progress_planner_branding_logo' );
			return;
		}

		\progress_planner()->the_asset(
			\progress_planner()->is_pro_site()
				? 'images/logo_progress_planner_pro.svg'
				: 'images/logo_progress_planner.svg'
		);
	}
}
