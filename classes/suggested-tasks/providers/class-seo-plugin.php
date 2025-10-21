<?php
/**
 * Add task to install and activate an SEO plugin.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\SEO_Plugin as SEO_Plugin_Data_Collector;

/**
 * Add task to install and activate an SEO plugin.
 */
class SEO_Plugin extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'seo-plugin';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'seo-plugin';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = SEO_Plugin_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/install-seo-plugin';

	/**
	 * The priority of the task.
	 *
	 * @var int
	 */
	protected $priority = self::PRIORITY_HIGH;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'plugins.php' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Install an SEO plugin', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Only add the task if no SEO plugin is detected.
		return ! $this->get_data_collector()->collect();
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		// Task is completed if an SEO plugin is detected.
		return $this->get_data_collector()->collect();
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		$seo_plugin_recommendation_slug = \progress_planner()->get_ui__branding()->get_seo_plugin_recommendation_slug();
		$seo_plugin_recommendation_name = $this->get_plugin_name_by_slug( $seo_plugin_recommendation_slug );
		if ( ! $seo_plugin_recommendation_name ) {
			return;
		}
		?>
		<p>
			<?php \esc_html_e( 'Search Engine Optimization (SEO) is essential for improving your website\'s visibility in search engines like Google. An SEO plugin helps you optimize your content, manage meta tags, generate sitemaps, and follow best practices to rank higher in search results.', 'progress-planner' ); ?>
		</p>
		<p>
			<?php
			printf(
				/* translators: %s is the plugin name */
				\esc_html__( 'We recommend installing %s, one of the most popular and comprehensive SEO plugins for WordPress.', 'progress-planner' ),
				sprintf(
					'<a href="https://w.org/plugins/%1$s/" target="_blank">%2$s</a>',
					\esc_attr( $seo_plugin_recommendation_slug ),
					\esc_html( $seo_plugin_recommendation_name )
				)
			);
			?>
		</p>
		<?php
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
				data-plugin-name="Yoast SEO"
				data-plugin-slug="wordpress-seo"
				data-action="<?php echo \progress_planner()->get_plugin_installer()->is_plugin_installed( 'wordpress-seo' ) ? 'activate' : 'install'; ?>"
				data-provider-id="<?php echo \esc_attr( self::PROVIDER_ID ); ?>"
			></prpl-install-plugin>
		<?php else : ?>
			<p>
				<?php
				if ( \is_multisite() ) {
					\esc_html_e( 'Plugin installation is disabled on this multisite installation.', 'progress-planner' );
				} else {
					\esc_html_e( 'You do not have permission to install plugins.', 'progress-planner' );
				}
				?>
			</p>
			<p>
				<a href="<?php echo \esc_url( \admin_url( 'plugins.php' ) ); ?>" class="prpl-button prpl-button-primary">
					<?php \esc_html_e( 'Go to Plugins', 'progress-planner' ); ?>
				</a>
			</p>
		<?php endif; ?>
		<?php
	}

	/**
	 * Get plugin name from the data collector by slug.
	 *
	 * @param string $slug The plugin slug.
	 *
	 * @return string|null Plugin name or null if not found.
	 */
	public function get_plugin_name_by_slug( $slug ) {
		$data_collector = $this->get_data_collector();
		if ( ! $data_collector instanceof SEO_Plugin_Data_Collector ) {
			return null;
		}

		$seo_plugins = $data_collector->get_seo_plugins();
		if ( ! isset( $seo_plugins[ $slug ]['name'] ) ) {
			return null;
		}

		return $seo_plugins[ $slug ]['name'];
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Install plugin', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
