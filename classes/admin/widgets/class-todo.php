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
		<div id="todo-aria-live-region" aria-live="polite" style="position: absolute; left: -9999px;"></div>

		<ul id="todo-list" class="prpl-todo-list prpl-suggested-tasks-list"></ul>

		<form id="create-todo-item">
			<input type="text" id="new-todo-content" placeholder="<?php \esc_attr_e( 'Add a new task', 'progress-planner' ); ?>" aria-label="<?php \esc_attr_e( 'Add a new task', 'progress-planner' ); ?>" required />
			<button type="submit" title="<?php \esc_attr_e( 'Add', 'progress-planner' ); ?>">
				<span class="dashicons dashicons-plus-alt2"></span>
			</button>
		</form>
		<details id="todo-list-completed-details">
			<summary><?php \esc_html_e( 'Completed tasks', 'progress-planner' ); ?></summary>
			<ul id="todo-list-completed" class="prpl-todo-list prpl-suggested-tasks-list"></ul>
		</details>
		<?php
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/todo',
			[
				'name' => 'progressPlannerTodo',
				'data' => [
					'ajaxUrl' => \admin_url( 'admin-ajax.php' ),
					'nonce'   => \wp_create_nonce( 'progress_planner' ),
					'tasks'   => \progress_planner()->get_todo()->get_items(),
					'categories' => \get_terms( array(
						'taxonomy'   => 'prpl_recommendations_category',
						'hide_empty' => false,
					) ),
					'providers'  => \get_terms( array(
						'taxonomy'   => 'prpl_recommendations_provider',
						'hide_empty' => false,
					) ),
				],
			]
		);
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-web-components-prpl-suggested-task',
			constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/web-components/prpl-suggested-task.css',
			[],
			\progress_planner()->get_file_version( constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/web-components/prpl-suggested-task.css' )
		);

		return [
			'progress-planner-web-components-prpl-suggested-task',
		];
	}
}
// phpcs:enable Generic.Commenting.Todo
