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

	/**
	 * Get the color palette.
	 *
	 * @return string
	 */
	public static function get_color_palette(): string {
		$palette = \apply_filters(
			'progress_planner_color_palette',
			[
				'--prpl-color-gray-1'             => '#e1e3e7',
				'--prpl-color-gray-2'             => '#d1d5db',
				'--prpl-color-gray-3'             => '#9ca3af',
				'--prpl-color-gray-4'             => '#6b7280',
				'--prpl-color-gray-5'             => '#4b5563',
				'--prpl-color-gray-6'             => '#374151',

				'--prpl-color-accent-red'         => '#f43f5e',
				'--prpl-color-accent-orange'      => '#faa310',
				'--prpl-color-400-orange'         => '#f9b23c',
				'--prpl-color-accent-purple'      => '#0d6b9e',
				'--prpl-color-accent-green'       => '#14b8a6',

				'--prpl-color-headings'           => '#38296d',
				'--prpl-color-text'               => 'var(--prpl-color-gray-5)',
				'--prpl-color-link'               => '#1e40af',

				'--prpl-color-notification-green' => '#16a34a',
				'--prpl-color-notification-red'   => '#e73136',

				'--prpl-background-orange'        => '#fff9f0',
				'--prpl-background-purple'        => '#f6f5fb',
				'--prpl-background-green'         => '#f2faf9',
				'--prpl-background-red'           => '#fff6f7',
				'--prpl-background-blue'          => '#effbfe',
			]
		);

		$palette_string = '';
		foreach ( $palette as $key => $value ) {
			$palette_string .= $key . ': ' . $value . ';';
		}

		return ":root { $palette_string }";
	}
}
