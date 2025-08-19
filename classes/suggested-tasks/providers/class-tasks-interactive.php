<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

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
		\add_action( 'progress_planner_admin_dashboard_widget_score_after', [ $this, 'add_popover' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		\add_action( 'wp_ajax_prpl_interactive_task_submit', [ $this, 'handle_interactive_task_submit' ] );
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
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - setting: (string) The setting to update.
	 * - value: (mixed) The value to update the setting to.
	 * - setting_path: (array) The path to the setting to update.
	 *                         Use an empty array if the setting is not nested.
	 *                         If the value is nested, use an array of keys.
	 *                         Example: [ 'a', 'b', 'c' ] will update the value of $option['a']['b']['c'].
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_submit() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['setting'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['value'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['setting_path'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting path.', 'progress-planner' ) ] );
		}

		$setting      = \sanitize_text_field( \wp_unslash( $_POST['setting'] ) );
		$value        = \sanitize_text_field( \wp_unslash( $_POST['value'] ) );
		$setting_path = \json_decode( \sanitize_text_field( \wp_unslash( $_POST['setting_path'] ) ), true );

		if ( ! empty( $setting_path ) ) {
			$setting_value = \get_option( $setting );
			\_wp_array_set( $setting_value, $setting_path, $value );
			$updated = \update_option( $setting, $setting_value );
			if ( ! $updated ) {
				\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
			}
			\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
		}

		$updated = \update_option( $setting, $value );
		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
		}
		\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
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
				'prpl_task_object'       => $this,
				'prpl_popover_id'        => static::POPOVER_ID,
				'prpl_external_link_url' => $this->get_external_link_url(),
				'prpl_provider_id'       => $this->get_provider_id(),
			]
		);
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>' . \wp_kses_post( $this->get_description() ) . '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	abstract public function print_popover_form_contents();

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
