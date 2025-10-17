<?php
/**
 * Add task for Yoast SEO: disable the media pages.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: disable the media pages.
 */
class Media_Pages extends Yoast_Interactive_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-media-pages';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'yoast-media-pages';


	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/yoast-media-pages';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/media-pages' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Yoast SEO: disable the media pages', 'progress-planner' );
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			[
				'iconElement'  => '.yst-toggle-field__header',
				'valueElement' => [
					'elementSelector' => 'button[data-id="input-wpseo_titles-disable-attachment"]',
					'attributeName'   => 'aria-checked',
					'attributeValue'  => 'false',
					'operator'        => '=',
				],
			],
		];
	}

	/**
	 * Determine if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// If the media pages are already disabled, we don't need to add the task.
		return \YoastSEO()->helpers->options->get( 'disable-attachment' ) !== true; // @phpstan-ignore-line property.nonObject
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Yoast SEO can disable the media / attachment pages, which are the pages that show the media files. You really don\'t need them, except when you are displaying photos or art on your site through them.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<button type="submit" class="prpl-button prpl-button-primary">
			<?php \esc_html_e( 'Disable', 'progress-planner' ); ?>
		</button>
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
			'html'     => '<a class="prpl-tooltip-action-text" href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Disable', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
