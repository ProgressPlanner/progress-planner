<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Tasks_Interface;

/**
 * Add tasks for content updates.
 */
abstract class Tasks_Interactive extends Tasks {

	/**
	 * The popover ID for interactive tasks.
	 *
	 * @var string
	 */
	const POPOVER_ID = '';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_popover' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		$task_details               = parent::get_task_details( $task_data );
		$task_details['popover_id'] = 'prpl-popover-' . static::POPOVER_ID;

		return $task_details;
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>" class="prpl-popover prpl-popover-interactive" popover>
			<?php $this->the_popover_content(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
	}

	/**
	 * The popover content.
	 *
	 * @return void
	 */
	protected function the_popover_content() {
		\progress_planner()->the_view(
			[
				'/views/popovers/' . static::POPOVER_ID . '.php',
				'/views/popovers/interactive-task.php',
			],
			[
				'prpl_task_object' => $this,
				'prpl_popover_id'  => static::POPOVER_ID,
				'prpl_provider_id' => $this->get_provider_id(),
			]
		);
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		?>
		<p><?php echo \wp_kses_post( $this->get_description() ); ?></p>
		<?php
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		// Enqueue the script only on Progress Planner and WP dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $hook && 'index.php' !== $hook ) {
			return;
		}

		// Enqueue the web component.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/recommendations/' . $this->get_provider_id(),
			$this->get_enqueue_data()
		);
	}

	/**
	 * Get the enqueue data.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		return [];
	}
}
