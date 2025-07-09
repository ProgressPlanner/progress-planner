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
abstract class Tasks implements Tasks_Interface {

	/**
	 * The category of the task.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'configuration';

	/**
	 * The ID of the task provider.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = '';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_options';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = \Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector::class;

	/**
	 * Whether the task is interactive.
	 *
	 * @var bool
	 */
	const IS_INTERACTIVE = false;

	/**
	 * The popover ID for interactive tasks.
	 *
	 * @var string
	 */
	const POPOVER_ID = '';

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = false;

	/**
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 1;

	/**
	 * The task parent.
	 *
	 * @var int
	 */
	protected $parent = 0;

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 50;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = false;

	/**
	 * Whether the task is snoozable.
	 *
	 * @var bool
	 */
	protected $is_snoozable = true;

	/**
	 * The task URL.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * The task URL target.
	 *
	 * @var string
	 */
	protected $url_target = '_self';

	/**
	 * The task link setting.
	 *
	 * @var array
	 */
	protected $link_setting;

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector|null
	 */
	protected $data_collector = null;

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		if ( static::IS_INTERACTIVE ) {
			\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_popover' ] );
		}

		// Enqueue the scripts.
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return '';
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return '';
	}

	/**
	 * Get the task points.
	 *
	 * @return int
	 */
	public function get_points() {
		return $this->points;
	}

	/**
	 * Get the task parent.
	 *
	 * @return int
	 */
	public function get_parent() {
		return $this->parent;
	}

	/**
	 * Get the task priority.
	 *
	 * @return int
	 */
	public function get_priority() {
		return (int) $this->priority;
	}

	/**
	 * Get whether the task is dismissable.
	 *
	 * @return bool
	 */
	public function is_dismissable() {
		return $this->is_dismissable;
	}

	/**
	 * Get whether the task is snoozable.
	 *
	 * @return bool
	 */
	public function is_snoozable() {
		return $this->is_snoozable;
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return $this->url ? \esc_url( $this->url ) : '';
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url_target() {
		return $this->url_target ? $this->url_target : '_self';
	}

	/**
	 * Get the task link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return $this->link_setting;
	}

	/**
	 * Alias for get_provider_category(), to provide backwards compatibility.
	 *
	 * @return string
	 */
	public function get_provider_type() {
		\_deprecated_function( 'Progress_Planner\Suggested_Tasks\Providers\Tasks::get_provider_type()', '1.1.1', 'get_provider_category' );
		return $this->get_provider_category();
	}

	/**
	 * Get the provider category.
	 *
	 * @return string
	 */
	public function get_provider_category() {
		return static::CATEGORY;
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return static::PROVIDER_ID;
	}

	/**
	 * Get the task ID.
	 *
	 * @param array $task_data Optional data to include in the task ID.
	 * @return string
	 */
	public function get_task_id( $task_data = [] ) {
		$parts = [ $this->get_provider_id() ];

		// Order is important here, new parameters should be added at the end.
		$parts[] = $task_data['target_post_id'] ?? false;
		$parts[] = $task_data['target_term_id'] ?? false;
		$parts[] = $task_data['target_taxonomy'] ?? false;
		// If the task is repetitive, add the date as the last part.
		$parts[] = $this->is_repetitive() ? \gmdate( 'YW' ) : false;

		// Remove empty parts.
		$parts = \array_filter( $parts );

		return \implode( '-', $parts );
	}

	/**
	 * Get the data collector.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector
	 */
	public function get_data_collector() {
		if ( ! $this->data_collector ) {
			$class_name           = static::DATA_COLLECTOR_CLASS;
			$this->data_collector = new $class_name(); // @phpstan-ignore-line assign.propertyType
		}

		return $this->data_collector; // @phpstan-ignore-line return.type
	}

	/**
	 * Get the title with data.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_title_with_data( $task_data = [] ) {
		return $this->get_title();
	}

	/**
	 * Get the description with data.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description_with_data( $task_data = [] ) {
		return $this->get_description();
	}

	/**
	 * Get the URL with data.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_url_with_data( $task_data = [] ) {
		return $this->get_url();
	}

	/**
	 * Check if the user has the capability to perform the task.
	 *
	 * @return bool
	 */
	public function capability_required() {
		return static::CAPABILITY
			? \current_user_can( static::CAPABILITY )
			: true;
	}

	/**
	 * Check if the task is a repetitive task.
	 *
	 * @return bool
	 */
	public function is_repetitive() {
		return $this->is_repetitive;
	}

	/**
	 * Check if the task is an onboarding task.
	 *
	 * @return bool
	 */
	public function is_onboarding_task() {
		return static::IS_ONBOARDING_TASK;
	}

	/**
	 * Check if a task category is snoozed.
	 *
	 * @return bool
	 */
	public function is_task_snoozed() {
		foreach ( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'future' ] ) as $task ) {
			$task        = \progress_planner()->get_suggested_tasks_db()->get_post( $task->task_id );
			$provider_id = $task ? $task->get_provider_id() : '';

			if ( $provider_id === $this->get_provider_id() ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		return true;
	}

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|false The task data or false if the task is not completed.
	 */
	public function evaluate_task( $task_id ) {
		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

		if ( ! $task ) {
			return false;
		}

		if ( ! $this->is_repetitive() ) {
			// Collaborator tasks have custom task_ids, so strpos check does not work for them.
			if ( ! $task->task_id || ( 0 !== \strpos( $task->task_id, $this->get_task_id() ) && 'collaborator' !== $this->get_provider_id() ) ) {
				return false;
			}
			return $this->is_task_completed( $task->task_id ) ? $task : false;
		}

		if (
			$task->provider &&
			$task->provider->slug === $this->get_provider_id() &&
			\DateTime::createFromFormat( 'Y-m-d H:i:s', $task->post_date ) &&
			\gmdate( 'YW' ) === \gmdate( 'YW', \DateTime::createFromFormat( 'Y-m-d H:i:s', $task->post_date )->getTimestamp() ) && // @phpstan-ignore-line
			$this->is_task_completed( $task->task_id )
		) {
			// Allow adding more data, for example in case of 'create-post' tasks we are adding the post_id.
			$task_data = $this->modify_evaluated_task_data( $task->get_data() );
			$task->update( $task_data );

			return $task;
		}

		return false;
	}

	/**
	 * Check if the task condition is satisfied.
	 *
	 * @return bool true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 */
	abstract protected function should_add_task();

	/**
	 * Alias for should_add_task(), for better readability when using in the evaluate_task() method.
	 *
	 * @param string $task_id Optional task ID to check completion for.
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		// If no specific task ID provided, use the default behavior.
		return empty( $task_id )
			? ! $this->should_add_task()
			: $this->is_specific_task_completed( $task_id );
	}

	/**
	 * Check if a specific task is completed.
	 * Child classes can override this method to handle specific task IDs.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		return ! $this->should_add_task();
	}

	/**
	 * Backwards-compatible method to check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	protected function check_task_condition() {
		return ! $this->should_add_task();
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if (
			true === $this->is_task_snoozed() ||
			! $this->should_add_task() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() )
		) {
			return [];
		}

		$task_data = $this->modify_injection_task_data( $this->get_task_details() );

		// Skip the task if it was already injected.
		return \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] )
			? []
			: [ \progress_planner()->get_suggested_tasks_db()->add( $task_data ) ];
	}

	/**
	 * Modify task data before injecting it.
	 * Child classes can override this method to add extra data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_injection_task_data( $task_data ) {
		return $task_data;
	}

	/**
	 * Modify task data after task was evaluated.
	 * Child classes can override this method to add extra data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_evaluated_task_data( $task_data ) {
		return $task_data;
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		return [
			'task_id'      => $this->get_task_id( $task_data ),
			'provider_id'  => $this->get_provider_id(),
			'post_title'   => $this->get_title_with_data( $task_data ),
			'description'  => $this->get_description_with_data( $task_data ),
			'parent'       => $this->get_parent(),
			'priority'     => $this->get_priority(),
			'category'     => $this->get_provider_category(),
			'points'       => $this->get_points(),
			'date'         => \gmdate( 'YW' ),
			'url'          => $this->get_url_with_data( $task_data ),
			'url_target'   => $this->get_url_target(),
			'link_setting' => $this->get_link_setting(),
			'dismissable'  => $this->is_dismissable(),
			'snoozable'    => $this->is_snoozable(),
			'popover_id'   => static::IS_INTERACTIVE ? 'prpl-popover-' . static::POPOVER_ID : '',
		];
	}

	/**
	 * Transform data collector data into task data format.
	 *
	 * @param array $data The data from data collector.
	 * @return array The transformed data with original data merged.
	 */
	protected function transform_collector_data( array $data ): array {
		$transform_keys = [
			'term_id'    => 'target_term_id',
			'taxonomy'   => 'target_taxonomy',
			'name'       => 'target_term_name',
			'post_id'    => 'target_post_id',
			'post_title' => 'target_post_title',
		];

		foreach ( $transform_keys as $key => $value ) {
			if ( isset( $data[ $key ] ) ) {
				$data[ $value ] = $data[ $key ];
			}
		}

		return $data;
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
	public function the_popover_content() {
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
	 * @return void
	 */
	public function enqueue_scripts() {

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
