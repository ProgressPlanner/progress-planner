<?php
/**
 * AI Task Provider - Base class for AI-powered tasks from SaaS server.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Base class for AI-powered tasks that execute via the SaaS server.
 */
abstract class AI_Task extends Tasks_Interactive {

	/**
	 * The popover ID for AI tasks.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'ai-task';

	/**
	 * AI task data from server.
	 *
	 * @var array
	 */
	protected $ai_task_data = [];

	/**
	 * Constructor.
	 *
	 * @param array $ai_task_data Optional. Task data from SaaS server.
	 *
	 * @return void
	 */
	public function __construct( $ai_task_data = [] ) {
		parent::__construct();
		$this->ai_task_data = $ai_task_data;
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return $this->ai_task_data['title'] ?? '';
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return $this->ai_task_data['description'] ?? 'Click "Analyze" to get AI-powered insights.';
	}

	/**
	 * Check if this should be added as a task.
	 * AI tasks from server should always be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// AI tasks are managed by the SaaS server, so we always show them if they exist.
		return ! empty( $this->ai_task_data );
	}

	/**
	 * Get the task ID.
	 *
	 * @param array $task_data Optional data to include in the task ID.
	 * @return string
	 */
	public function get_task_id( $task_data = [] ) {
		$server_task_id = $this->ai_task_data['task_id'] ?? 0;
		return 'ai-task-' . $server_task_id;
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		$details = parent::get_task_details( $task_data );

		// Add AI-specific metadata.
		$details['is_ai_task']         = true;
		$details['ai_task_id']         = $this->ai_task_data['task_id'] ?? 0;
		$details['ai_prompt_template'] = $this->ai_task_data['ai_prompt_template'] ?? '';
		$details['ai_provider']        = $this->ai_task_data['ai_provider'] ?? 'chatgpt';
		$details['ai_max_tokens']      = $this->ai_task_data['ai_max_tokens'] ?? 500;
		$details['branding']           = $this->ai_task_data['branding'] ?? '';

		return $details;
	}

	/**
	 * Handle AI task execution via AJAX.
	 *
	 * @return void
	 */
	public function handle_ai_task_execution() {
		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to execute AI tasks.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing task ID.', 'progress-planner' ) ] );
		}

		$task_id = (int) \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );

		// Check if we have a cached response.
		$cached_response = \progress_planner()->get_ai_tasks()->get_cached_response( $task_id );
		if ( false !== $cached_response ) {
			\wp_send_json_success(
				[
					'success'     => true,
					'task_id'     => $task_id,
					'ai_response' => $cached_response,
					'cached'      => true,
				]
			);
		}

		// Execute the AI task via the SaaS server.
		$site_url    = \get_site_url();
		$license_key = \get_option( 'progress_planner_license_key' );

		$result = \progress_planner()->get_ai_tasks()->execute_ai_task( $task_id, $site_url, $license_key );

		if ( \is_wp_error( $result ) ) {
			\wp_send_json_error(
				[
					'message' => $result->get_error_message(),
					'code'    => $result->get_error_code(),
				]
			);
		}

		// Cache the response.
		if ( isset( $result['ai_response'] ) ) {
			\progress_planner()->get_ai_tasks()->cache_response( $task_id, $result['ai_response'] );
		}

		\wp_send_json_success( $result );
	}

	/**
	 * Get the list of allowed options that can be updated via interactive tasks.
	 *
	 * @return array List of allowed option names.
	 */
	protected function get_allowed_interactive_options() {
		// AI tasks don't update options via the standard interactive form.
		return [];
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$task_id = $this->ai_task_data['task_id'] ?? 0;
		?>
		<div class="prpl-ai-task-content">
			<div class="prpl-ai-task-loading" style="display:none;">
				<div class="prpl-spinner"></div>
				<p><?php \esc_html_e( 'Analyzing your site with AI... This may take up to 30 seconds.', 'progress-planner' ); ?></p>
			</div>
			<div class="prpl-ai-task-result" style="display:none;">
				<div class="prpl-ai-task-response"></div>
			</div>
			<div class="prpl-ai-task-error" style="display:none;">
				<p class="prpl-error-message"></p>
			</div>
		</div>
		<div class="prpl-steps-nav-wrapper">
			<button type="button" class="prpl-button prpl-button-primary prpl-ai-task-execute" data-task-id="<?php echo \esc_attr( $task_id ); ?>">
				<?php \esc_html_e( 'Analyze', 'progress-planner' ); ?>
			</button>
			<button type="button" class="prpl-button prpl-ai-task-retry" data-task-id="<?php echo \esc_attr( $task_id ); ?>" style="display:none;">
				<?php \esc_html_e( 'Try Again', 'progress-planner' ); ?>
			</button>
		</div>
		<?php
	}

	/**
	 * Get the enqueue data for the AI task script.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		return [
			'file'         => 'recommendations/ai-task.js',
			'dependencies' => [ 'progress-planner/suggested-task' ],
		];
	}

	/**
	 * Add task actions for AI tasks.
	 *
	 * @param array $data The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		// Add the "Analyze" button that opens the popover.
		$actions[] = [
			'priority' => 10,
			'html'     => '<button type="button" class="prpl-suggested-task-button prpl-button-primary" popovertarget="prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '" data-task-id="' . \esc_attr( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $data['slug'] ) ) . '" data-action="analyze" title="' . \esc_attr__( 'Analyze with AI', 'progress-planner' ) . '"><span class="prpl-tooltip-action-text">' . \esc_html__( 'Analyze', 'progress-planner' ) . '</span></button>',
		];

		return $actions;
	}
}
