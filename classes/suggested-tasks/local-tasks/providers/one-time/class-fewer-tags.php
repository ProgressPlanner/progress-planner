<?php
/**
 * Add tasks for Fewer Tags plugin.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;
use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Tag_Count;
use Progress_Planner\Suggested_Tasks\Data_Collector\Published_Post_Count;

/**
 * Add tasks to check if Fewer Tags plugin is installed.
 */
class Fewer_Tags extends One_Time {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'fewer-tags';

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

	/**
	 * The plugin active state.
	 *
	 * @var bool
	 */
	private $is_plugin_active = null;

	/**
	 * The post tag count data collector.
	 *
	 * @var Post_Tag_Count
	 */
	private $post_tag_count_data_collector;

	/**
	 * The published post count data collector.
	 *
	 * @var Published_Post_Count
	 */
	private $published_post_count_data_collector;

	/**
	 * The plugin path.
	 *
	 * @var string
	 */
	private $plugin_path = 'fewer-tags/fewer-tags.php';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Data collectors.
		$this->post_tag_count_data_collector       = new Post_Tag_Count();
		$this->published_post_count_data_collector = new Published_Post_Count();

		$this->url            = \admin_url( '/plugin-install.php?tab=search&s=fewer+tags' );
		$this->is_dismissable = true;
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Install Fewer Tags and clean up your tags', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			// translators: %1$s is the number of tags, %2$s is the number of published posts.
			\esc_html__( 'We detected that you have %1$s tags and %2$s published posts. Consinder installing the "Fewer Tags" plugin.', 'progress-planner' ),
			$this->post_tag_count_data_collector->collect(),
			$this->published_post_count_data_collector->collect(),
		);
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

		return $this->post_tag_count_data_collector->collect() > $this->published_post_count_data_collector->collect();
	}

	/**
	 * Check if the task is completed.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return $this->is_plugin_active();
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool
	 */
	protected function is_plugin_active() {

		if ( null === $this->is_plugin_active ) {
			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore requireOnce.fileNotFound
			}

			$plugins                = get_plugins();
			$this->is_plugin_active = isset( $plugins[ $this->plugin_path ] ) && is_plugin_active( $this->plugin_path );
		}

		return $this->is_plugin_active;
	}
}
