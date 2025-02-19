<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Sample_Page extends Local_OneTime_Tasks_Abstract {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'sample-page';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'edit_pages';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected $is_onboarding_task = true;

	/**
	 * The sample page.
	 *
	 * @var \WP_Post|null|false
	 */
	protected $sample_page = false;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return null !== $this->get_sample_page();
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			$task_id = $this->get_provider_id();
		}

		$sample_page = $this->get_sample_page();

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Delete "Sample Page"', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() && null !== $sample_page ? \esc_url( \get_edit_post_link( $sample_page->ID ) ) : '', // @phpstan-ignore-line property.nonObject
			'description' => '<p>' . sprintf(
				/* translators: %s:<a href="https://prpl.fyi/delete-sample-page" target="_blank">Sample Page</a> link */
				\esc_html__( 'On install, WordPress creates a %s page. This page is not needed and should be deleted.', 'progress-planner' ),
				'<a href="https://prpl.fyi/delete-sample-page" target="_blank">' . \esc_html__( '"Sample Page"', 'progress-planner' ) . '</a>'
			) . '</p>',
		];
	}

	/**
	 * Get the sample page.
	 *
	 * @return \WP_Post|null
	 */
	protected function get_sample_page() {

		if ( false !== $this->sample_page ) {
			return $this->sample_page;
		}

		$sample_page = get_page_by_path( __( 'sample-page' ) ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		if ( null === $sample_page ) {
			$query = new \WP_Query(
				[
					'post_type'      => 'page',
					'title'          => __( 'Sample Page' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				]
			);

			$sample_page = ! empty( $query->post ) ? $query->post : null;
		}

		$this->sample_page = $sample_page;

		return $sample_page;
	}
}
