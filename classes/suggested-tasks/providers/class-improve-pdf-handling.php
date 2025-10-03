<?php
/**
 * Add task for Email sending.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task for Email sending.
 */
class Improve_Pdf_Handling extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;


	/**
	 * The minimum number of PDF files.
	 *
	 * @var int
	 */
	protected const MIN_PDF_FILES = 10;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'improve-pdf-handling';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'configuration';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'improve-pdf-handling';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/improve-pdf-handling';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 1;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		// Enqueue the scripts.
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * We want task to be added always.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Detect if there are more than 10 PDF files.
		$query           = new \WP_Query(
			[
				'post_type'      => 'attachment',
				'post_mime_type' => 'application/pdf',
				'post_status'    => 'publish',
				'posts_per_page' => static::MIN_PDF_FILES + 1, // We want to get at least 11 PDF files to be sure we have enough.
				'fields'         => 'ids',
			]
		);
		$pdf_files_count = $query->found_posts;

		return static::MIN_PDF_FILES < $pdf_files_count;
	}

	/**
	 * Task should be completed only manually by the user.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return false;
	}

	/**
	 * Task should be completed only manually by the user.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {
		return false;
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Improve PDF handling', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return \esc_html__( 'Your site seems to have quite a few PDF files, we can improve the way your site handles them.', 'progress-planner' );
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

		// Don't enqueue the script if the task is already completed.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() ) ) {
			return;
		}

		// Enqueue the web component.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/web-components/prpl-task-' . $this->get_provider_id(),
		);
	}

	/**
	 * The popover content.
	 *
	 * @return void
	 */
	public function the_popover_content() {
		\progress_planner()->the_view(
			'popovers/improve-pdf-handling.php',
			[
				'prpl_popover_id'  => static::POPOVER_ID,
				'prpl_provider_id' => $this->get_provider_id(),
			]
		);
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		// The form is handled in the popovers/email-sending view.
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Improve PDF handling', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
