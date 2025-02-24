<?php
/**
 * Add task to delete the Sample Page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add task to delete the Sample Page.
 */
class Sample_Page extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'sample-page';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_pages';

	/**
	 * The sample page.
	 *
	 * @var \WP_Post|null|false
	 */
	protected $sample_page = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->sample_page = $this->get_sample_page();

		if ( is_object( $this->sample_page ) && is_a( $this->sample_page, \WP_Post::class ) ) {
			$this->url = (string) \get_edit_post_link( $this->sample_page->ID );
		}

		$this->title       = \esc_html__( 'Delete "Sample Page"', 'progress-planner' );
		$this->description = sprintf(
			/* translators: %s:<a href="https://prpl.fyi/delete-sample-page" target="_blank">Sample Page</a> link */
			\esc_html__( 'On install, WordPress creates a %s page. This page is not needed and should be deleted.', 'progress-planner' ),
			'<a href="https://prpl.fyi/delete-sample-page" target="_blank">' . \esc_html__( '"Sample Page"', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return ( is_object( $this->sample_page ) && is_a( $this->sample_page, \WP_Post::class ) );
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
