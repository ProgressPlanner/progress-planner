<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Reduce_Autoloaded_Options extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'reduce-autoloaded-options';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'reduce-autoloaded-options';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The number of autoloaded options.
	 *
	 * @var int
	 */
	private $autoloaded_options_count = null;

	/**
	 * The plugin active state.
	 *
	 * @var bool
	 */
	private $is_plugin_active = null;

	/**
	 * Threshold for the number of autoloaded options.
	 *
	 * @var int
	 */
	private $autoloaded_options_threshold = 500;

	/**
	 * The task priority.
	 *
	 * Tasks are ordered from lowest to highest priority value (0 = highest priority, 100 = lowest priority).
	 * Use the PRIORITY_* constants defined in this class for consistency.
	 *
	 * @var int
	 */
	protected $priority = 50;

	/**
	 * The plugin path.
	 *
	 * @var string
	 */
	private $plugin_path = 'aaa-option-optimizer/aaa-option-optimizer.php';

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		$this->url = \admin_url( '/plugin-install.php?tab=search&s=aaa+option+optimizer' );

		/**
		 * Filter the autoloaded options threshold.
		 *
		 * @param int $threshold The threshold.
		 *
		 * @return int
		 */
		$this->autoloaded_options_threshold = (int) \apply_filters( 'progress_planner_reduce_autoloaded_options_threshold', $this->autoloaded_options_threshold );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Reduce number of autoloaded options', 'progress-planner' );
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If the plugin is  active, we don't need to add the task.
		if ( $this->is_plugin_active() ) {
			return false;
		}

		return $this->get_autoloaded_options_count() > $this->autoloaded_options_threshold;
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return $this->is_plugin_active() || $this->get_autoloaded_options_count() <= $this->autoloaded_options_threshold;
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool
	 */
	protected function is_plugin_active() {

		if ( null === $this->is_plugin_active ) {
			if ( ! \function_exists( 'get_plugins' ) ) {
				// @phpstan-ignore-next-line requireOnce.fileNotFound
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$plugins                = \get_plugins();
			$this->is_plugin_active = isset( $plugins[ $this->plugin_path ] ) && \is_plugin_active( $this->plugin_path );
		}

		return $this->is_plugin_active;
	}

	/**
	 * Get the number of autoloaded options.
	 *
	 * @return int
	 */
	protected function get_autoloaded_options_count() {
		global $wpdb;

		if ( null === $this->autoloaded_options_count ) {
			$autoload_values = \wp_autoload_values_to_autoload();
			$placeholders    = \implode( ',', \array_fill( 0, \count( $autoload_values ), '%s' ) );

			// phpcs:disable WordPress.DB
			$this->autoloaded_options_count = $wpdb->get_var(
				$wpdb->prepare( "SELECT COUNT(*) FROM `{$wpdb->options}` WHERE autoload IN ( $placeholders )", $autoload_values ) // @phpstan-ignore-line property.nonObject
			);

		}

		return $this->autoloaded_options_count;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\printf(
			// translators: %d is the number of autoloaded options.
			\esc_html__( 'There are %d autoloaded options. If you don\'t need them, consider reducing them by installing the "AAA Option Optimizer" plugin.', 'progress-planner' ),
			(int) $this->get_autoloaded_options_count(),
		);
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<?php if ( ! \is_multisite() && \current_user_can( 'install_plugins' ) ) : ?>
			<prpl-install-plugin
				data-plugin-name="AAA Option Optimizer"
				data-plugin-slug="aaa-option-optimizer"
				data-action="<?php echo \Progress_Planner\Utils\Plugin_Utils::is_plugin_installed( 'aaa-option-optimizer' ) ? 'activate' : 'install'; ?>"
				data-provider-id="<?php echo \esc_attr( self::PROVIDER_ID ); ?>"
			></prpl-install-plugin>
		<?php endif; ?>
		<?php
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Reduce', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
