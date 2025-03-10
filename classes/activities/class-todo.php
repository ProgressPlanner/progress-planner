<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Handler for todo activities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Activities;

use Progress_Planner\Activity;

/**
 * Handler for todo activities.
 */
class Todo extends Activity {

	/**
	 * Points configuration for todo activities.
	 *
	 * @var array
	 */
	public static $points_config = [
		'add'     => 1,
		'delete'  => 1,
		'update'  => 3, // Handles marking as done, and updating the content.
		'default' => 1,
	];

	/**
	 * Category of the activity.
	 *
	 * @var string
	 */
	public $category = 'todo';

	/**
	 * The data ID.
	 *
	 * Depending on the activity this is the post-ID, term-ID, comment-ID etc.
	 *
	 * @var string
	 */
	public $data_id = '0';

	/**
	 * Save the activity.
	 *
	 * @return void
	 */
	public function save() {
		$this->date    = new \DateTime();
		$this->user_id = \get_current_user_id();

		\progress_planner()->get_query()->insert_activity( $this );
		\do_action( 'progress_planner_activity_saved', $this );
	}
}
// phpcs:enable Generic.Commenting.Todo
