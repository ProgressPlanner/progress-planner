<?php
/**
 * Suggested task web component class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Web_Components;

/**
 * Suggested task web component class.
 */
class Suggested_Task extends Web_Component {

	/**
	 * The name of the web component.
	 *
	 * @var string
	 */
	protected $name = 'prpl-suggested-task';

	/**
	 * Localize the web component.
	 *
	 * @return void
	 */
	public function localize_script() {
		\wp_localize_script(
			$this->script_handle,
			'prplSuggestedTask',
			[
				'nonce'  => \wp_create_nonce( 'progress_planner' ),
				'assets' => [
					'infoIcon'   => PROGRESS_PLANNER_URL . '/assets/images/icon_info.svg',
					'snoozeIcon' => PROGRESS_PLANNER_URL . '/assets/images/icon_snooze.svg',
				],
			]
		);
	}
}
