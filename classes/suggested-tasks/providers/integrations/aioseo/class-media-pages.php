<?php
/**
 * Add task for All in One SEO: redirect media/attachment pages.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: redirect media/attachment pages.
 */
class Media_Pages extends AIOSEO_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-media-pages';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/aioseo-media-pages';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/media' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'All in One SEO: redirect media/attachment pages to attachment', 'progress-planner' );
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Check if AIOSEO is active.
		if ( ! \function_exists( 'aioseo' ) ) {
			return false;
		}

		// Check if redirect attachment URLs is already set to 'attachment'.
		// The setting is stored in searchAppearance -> postTypes -> attachment -> redirectAttachmentUrls.
		$redirect_value = \aioseo()->options->searchAppearance->postTypes->attachment->redirectAttachmentUrls;

		// The task is complete if redirectAttachmentUrls is set to 'attachment'.
		// Possible values: 'disabled', 'attachment', or 'attachmentParent'.
		// We recommend 'attachment' as it redirects to the attachment file itself.
		if ( 'attachment' === $redirect_value ) {
			return false;
		}

		return true;
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=aioseo-search-appearance#/media' ) . '" target="_self">' . \esc_html__( 'Configure redirect', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
