<?php
/**
 * AI Tasks From Server Provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Fetches and manages AI-powered tasks from the SaaS server.
 */
class AI_Tasks_From_Server extends Tasks {

	/**
	 * The ID of the task provider.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'ai-tasks';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_options';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	protected const POPOVER_ID = 'ai-task';

	/**
	 * Priority for AI tasks (higher priority = shown earlier).
	 *
	 * @var int
	 */
	protected $priority = 30;

	/**
	 * Points for completing AI tasks.
	 *
	 * @var int
	 */
	protected $points = 1;

	/**
	 * AI tasks can be dismissed.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * AI tasks can be snoozed.
	 *
	 * @var bool
	 */
	protected $is_snoozable = true;

	/**
	 * AI tasks from server.
	 *
	 * @var array
	 */
	protected $ai_tasks = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Fetch AI tasks from server.
		$this->ai_tasks = \progress_planner()->get_ai_tasks()->get_items();

		// Add AJAX handler for AI task execution.
		\add_action( 'wp_ajax_prpl_execute_ai_task', [ $this, 'handle_ai_task_execution' ] );

		// Add popover for AI tasks.
		\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_popover' ] );
		\add_action( 'progress_planner_admin_dashboard_widget_score_after', [ $this, 'add_popover' ] );

		// Enqueue AI task scripts.
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Check if we should add AI tasks.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Return true if we have AI tasks from the server.
		return ! empty( $this->ai_tasks );
	}

	/**
	 * Get tasks to inject.
	 * Override to inject multiple AI tasks.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if ( empty( $this->ai_tasks ) ) {
			return [];
		}

		$tasks_to_inject = [];

		foreach ( $this->ai_tasks as $ai_task ) {
			$task_id = 'ai-task-' . $ai_task['task_id'];

			// Skip if already completed or injected.
			if ( \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
				continue;
			}

			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_id ) ) {
				continue;
			}

			// Create task data.
			$task_data = [
				'task_id'              => $task_id,
				'provider_id'          => $this->get_provider_id(),
				'post_title'           => $ai_task['title'] ?? 'AI Task',
				'description'          => 'Click "Analyze" to get AI-powered insights for your site.',
				'parent'               => 0,
				'priority'             => $this->get_priority(),
				'points'               => $this->get_points(),
				'date'                 => \gmdate( 'YW' ),
				'url'                  => '',
				'url_target'           => '_self',
				'link_setting'         => [],
				'dismissable'          => $this->is_dismissable(),
				'external_link_url'    => '',
				'popover_id'           => 'prpl-popover-' . static::POPOVER_ID,
				'is_ai_task'           => true,
				'ai_task_server_id'    => $ai_task['task_id'],
				'ai_prompt_template'   => $ai_task['ai_prompt_template'] ?? '',
				'ai_provider'          => $ai_task['ai_provider'] ?? 'chatgpt',
				'ai_max_tokens'        => $ai_task['ai_max_tokens'] ?? 500,
				'branding'             => $ai_task['branding'] ?? '',
			];

			$tasks_to_inject[] = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		}

		return $tasks_to_inject;
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

		// Debug logging.
		\error_log( 'AI Task Execution Debug:' );
		\error_log( '  Task ID: ' . $task_id );
		\error_log( '  Site URL: ' . $site_url );
		\error_log( '  License key exists: ' . ( ! empty( $license_key ) ? 'yes' : 'no' ) );
		\error_log( '  License key length: ' . \strlen( $license_key ) );
		\error_log( '  License key first 10 chars: ' . \substr( $license_key, 0, 10 ) . '...' );
		\error_log( '  License key type: ' . \gettype( $license_key ) );

		// Validate we have the required data.
		if ( empty( $license_key ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'No license key found. Please configure your Progress Planner license key in settings.', 'progress-planner' ) ] );
		}

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
	 * Add the popover for AI tasks.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>" class="prpl-popover prpl-popover-ai-task" popover>
			<prpl-ai-task-popover
				popover-id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>"
				provider-id="<?php echo \esc_attr( static::PROVIDER_ID ); ?>"
			>
				<div class="prpl-popover-header">
					<h3 class="prpl-popover-title"><?php \esc_html_e( 'AI Analysis', 'progress-planner' ); ?></h3>
					<button type="button" class="prpl-popover-close" data-action="closePopover">
						<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				</div>
				<div class="prpl-popover-content">
					<div class="prpl-ai-task-content">
						<div class="prpl-ai-task-instructions">
							<p><?php \esc_html_e( 'Click "Analyze" below to get AI-powered insights about your site. This analysis may take up to 30 seconds.', 'progress-planner' ); ?></p>
						</div>
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
						<button type="button" class="prpl-button prpl-button-primary prpl-ai-task-execute">
							<?php \esc_html_e( 'Analyze', 'progress-planner' ); ?>
						</button>
						<button type="button" class="prpl-button prpl-button-secondary prpl-ai-task-retry" style="display:none;">
							<?php \esc_html_e( 'Try Again', 'progress-planner' ); ?>
						</button>
						<button type="button" class="prpl-button prpl-button-primary prpl-ai-task-complete" data-action="completeTask" style="display:none;">
							<?php \esc_html_e( 'Collect your point!', 'progress-planner' ); ?>
						</button>
					</div>
				</div>
			</prpl-ai-task-popover>
		</div>
		<?php
	}

	/**
	 * Enqueue scripts for AI tasks.
	 *
	 * @param string $hook The current admin page hook.
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		// Don't enqueue the script if the user is not at least an editor.
		if ( ! \current_user_can( 'edit_others_posts' ) ) {
			return;
		}

		// Enqueue the script only on Progress Planner and WP dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $hook && 'index.php' !== $hook ) {
			return;
		}

		// Enqueue the AI task web component (must be loaded before the main script).
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/web-components/prpl-ai-task-popover',
			[
				'file'         => 'web-components/prpl-ai-task-popover.js',
				'dependencies' => [ 'progress-planner/web-components/prpl-interactive-task' ],
			]
		);

		// Enqueue the AI task script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/recommendations/ai-task',
			[
				'file'         => 'recommendations/ai-task.js',
				'dependencies' => [ 'progress-planner/suggested-task', 'progress-planner/web-components/prpl-ai-task-popover' ],
			]
		);

		// Enqueue the AI task CSS.
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/ai-task' );
	}

	/**
	 * Get task actions for AI tasks.
	 *
	 * @param array $data The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		// Get the task ID from meta - REST API strips the prpl_ prefix.
		$task_id = 6149; //$data[0]['task_id'] ?? '';

		// Add the "Analyze" button that opens the popover.
		$actions[] = [
			'priority' => 10,
			'html'     => '<button type="button" class="prpl-suggested-task-button prpl-ai-task-trigger" popovertarget="prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '" data-task-id="' . \esc_attr( $task_id ) . '" data-action="analyze" title="' . \esc_attr__( 'Analyze with AI', 'progress-planner' ) . '"><span class="prpl-tooltip-action-text">' . \esc_html__( 'Analyze', 'progress-planner' ) . '</span></button>',
		];

		return $actions;
	}
}
