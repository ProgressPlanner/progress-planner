<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

/**
 * Latest_Badge class.
 */
final class Latest_Badge extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'latest-badge';

	/**
	 * The endpoint to get the badge image.
	 *
	 * @var string
	 */
	public $endpoint;

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct();
		$this->endpoint = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/share-badge-image?badge=';
	}
}
