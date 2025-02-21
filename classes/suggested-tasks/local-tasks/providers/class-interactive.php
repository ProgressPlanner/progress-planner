<?php
/**
 * Abstract class for a local interactive task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for content updates.
 */
abstract class Interactive extends One_Time {

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	protected $popover_id = 'interactive-task';

	/**
	 * The popover content.
	 *
	 * @var string
	 */
	protected $popover_content = '';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_footer', [ $this, 'add_popover' ] );
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-<?php echo \esc_attr( $this->popover_id ); ?>" class="prpl-popover prpl-popover-interactive" popover>
			<?php echo $this->get_popover_content(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
	}

	/**
	 * Get the popover content.
	 *
	 * @return string
	 */
	public function get_popover_content() {
		return '';
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return true;
	}

	/**
	 * Check if the task is completed.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return false;
	}

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {
		return false;
	}
}
