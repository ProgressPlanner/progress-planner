<?php
/**
 * Web component class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Web component class.
 */
class Web_Component {

	/**
	 * The name of the web component.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * The script handle.
	 *
	 * @var string
	 */
	protected $script_handle;

	/**
	 * The style handle.
	 *
	 * @var string
	 */
	protected $style_handle;

	/**
	 * Constructor.
	 *
	 * @param string $name The name of the web component.
	 */
	public function __construct( $name ) {
		$this->name          = $name;
		$this->script_handle = 'progress-planner/web-components/' . $this->name;
		$this->style_handle  = 'progress-planner/web-components/' . $this->name;

		$this->enqueue_script();
		$this->localize_script();
		$this->enqueue_style();
	}

	/**
	 * Enqueue the script.
	 *
	 * @return void
	 */
	protected function enqueue_script() {
		\progress_planner()->get_admin__enqueue()->enqueue_script( $this->script_handle );
	}

	/**
	 * Enqueue the style.
	 *
	 * @return void
	 */
	protected function enqueue_style() {
		\progress_planner()->get_admin__enqueue()->enqueue_style( $this->style_handle );
	}

	/**
	 * Localize the script.
	 *
	 * @return void
	 */
	protected function localize_script() {
		switch ( $this->name ) {
			case 'prpl-badge':
				\wp_localize_script(
					$this->script_handle,
					'progressPlannerBadge',
					[
						'remoteServerRootUrl' => \progress_planner()->get_remote_server_root_url(),
						'placeholderImageUrl' => \progress_planner()->get_placeholder_svg(),
					]
				);
				break;

			case 'prpl-suggested-task':
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
				break;
		}
	}
}
