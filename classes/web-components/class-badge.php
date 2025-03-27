<?php
/**
 * Badge web component class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Web_Components;

/**
 * Badge web component class.
 */
class Badge extends Web_Component {

	/**
	 * The name of the web component.
	 *
	 * @var string
	 */
	protected $name = 'prpl-badge';

	/**
	 * Localize the script.
	 *
	 * @return void
	 */
	protected function localize_script() {
		\wp_localize_script(
			$this->script_handle,
			'progressPlannerBadge',
			[
				'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
				'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
			]
		);
	}
}
