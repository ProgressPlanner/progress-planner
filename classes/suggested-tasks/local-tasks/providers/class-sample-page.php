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
class Sample_Page extends Local_Tasks_Abstract {

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
	 * The sample page.
	 *
	 * @var \WP_Post|null|false
	 */
	protected $sample_page = false;

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		$sample_page = $this->get_sample_page();

		if ( null === $sample_page ) {
			return $task_id;
		}

		return false;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		$sample_page = $this->get_sample_page();

		return [
			'task_id'     => $this->get_provider_id(),
			'title'       => \esc_html__( 'Delete "Sample Page"', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => static::TYPE,
			'points'      => 1,
			'url'         => $this->capability_required() && null !== $sample_page ? \esc_url( \get_edit_post_link( $sample_page->ID ) ) : '', // @phpstan-ignore-line property.nonObject
			'description' => '<p>' . \esc_html__( 'On install, WordPress creates a Sample Page. This page is not needed and should be deleted.', 'progress-planner' ) . '</p>',
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
