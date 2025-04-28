<?php
/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */
class Update_130 {

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->add_set_valuable_post_types_option();
		$this->migrate_badges();
	}

	/**
	 * Add the set valuable post types option.
	 *
	 * @return void
	 */
	private function add_set_valuable_post_types_option() {
		\update_option( 'progress_planner_set_valuable_post_types', true );
	}

	/**
	 * Migrate the content badges.
	 *
	 * @return void
	 */
	private function migrate_badges() {
		$options = \get_option( \Progress_Planner\Settings::OPTION_NAME );

		$badges_renamed = [
			'wonderful-writer' => 'content-curator',
			'bold-blogger'     => 'revision-ranger',
			'awesome-author'   => 'purposeful-publisher',
		];

		if ( ! isset( $options['badges'] ) ) {
			return;
		}

		foreach ( $badges_renamed as $old_badge_name => $new_badge_name ) {
			if ( isset( $options['badges'][ $old_badge_name ] ) ) {
				$options['badges'][ $new_badge_name ] = $options['badges'][ $old_badge_name ];
				unset( $options['badges'][ $old_badge_name ] );
			}
		}

		\update_option( \Progress_Planner\Settings::OPTION_NAME, $options );
	}
}
