<?php // phpcs:disable Generic.Commenting.Todo
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * ToDo class.
 */
final class ToDo extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'todo';

	/**
	 * The widget width.
	 *
	 * @var int
	 */
	protected $width = 2;

	/**
	 * Print the widget content.
	 *
	 * @return void
	 */
	public function print_content() {
		echo '<p>' . \esc_html__( 'Write down all the website maintenance tasks you want to get done!', 'progress-planner' ) . '</p>';
		$this->the_todo_list();
	}

	/**
	 * The TODO list.
	 *
	 * @return void
	 */
	public function the_todo_list() {
		?>
		<p id="prpl-todo-list-loading"><?php \esc_html_e( 'Loading items...', 'progress-planner' ); ?></p>
		<div id="todo-aria-live-region" aria-live="polite" style="position: absolute; left: -9999px;"></div>

		<ul id="todo-list" class="prpl-todo-list prpl-suggested-tasks-list"></ul>

		<form id="create-todo-item">
			<input type="text" id="new-todo-content" placeholder="<?php \esc_attr_e( 'Add a new task', 'progress-planner' ); ?>" aria-label="<?php \esc_attr_e( 'Add a new task', 'progress-planner' ); ?>" required />
			<button type="submit" title="<?php \esc_attr_e( 'Add', 'progress-planner' ); ?>">
				<span class="dashicons dashicons-plus-alt2"></span>
			</button>
		</form>
		<details id="todo-list-completed-details">
			<summary><?php \esc_html_e( 'Completed tasks', 'progress-planner' ); ?>
				<span class="prpl-todo-list-completed-summary-icon">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</span>
			</summary>
			<div id="todo-list-completed-delete-all-wrapper">
				<button id="todo-list-completed-delete-all" onclick="prplTodoWidget.deleteAllCompletedTasks()">
					<span style="display: inline-block; width: 18px; height: 18px;">
						<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9ca3af" d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"></path></svg>
					</span>
					<?php \esc_html_e( 'Delete all completed tasks', 'progress-planner' ); ?>
				</button>
			</div>
			<ul id="todo-list-completed" class="prpl-todo-list prpl-suggested-tasks-list"></ul>
		</details>
		<?php
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-suggested-task',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/suggested-task.css',
			[],
			\progress_planner()->get_file_version( \constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/suggested-task.css' )
		);

		return [
			'progress-planner-suggested-task',
		];
	}
}
// phpcs:enable Generic.Commenting.Todo
