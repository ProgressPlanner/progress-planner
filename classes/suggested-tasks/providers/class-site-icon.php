<?php
/**
 * Add tasks for Core siteicon.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core siteicon.
 */
class Site_Icon extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'core-siteicon';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'core-siteicon';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/set-site-icon';

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => '.site-icon-section th',
		];
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set site icon', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$site_icon = \get_option( 'site_icon' );
		return '' === $site_icon || '0' === $site_icon;
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Site Icons are what you see in browser tabs, bookmark bars, and within the WordPress mobile apps. Upload an image to make your site stand out.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		// Enqueue media scripts.
		\wp_enqueue_media();

		$site_icon_id = \get_option( 'site_icon' );
		?>
		<div id="site-icon-preview" style="margin-bottom: 15px; min-height: 150px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ddd; border-radius: 4px; padding: 10px;">
			<?php if ( $site_icon_id ) : ?>
				<?php echo \wp_get_attachment_image( $site_icon_id, 'thumbnail', false, [ 'style' => 'max-width: 150px; height: auto; border-radius: 4px; border: 1px solid #ddd;' ] ); ?>
			<?php else : ?>
				<span style="color: #999;"><?php \esc_html_e( 'No image selected', 'progress-planner' ); ?></span>
			<?php endif; ?>
		</div>
		<button type="button" id="prpl-upload-site-icon-button" class="prpl-button prpl-button-secondary" style="margin-bottom: 15px;">
			<?php \esc_html_e( 'Choose or Upload Image', 'progress-planner' ); ?>
		</button>
		<input type="hidden" name="site_icon" id="prpl-site-icon-id" value="<?php echo \esc_attr( $site_icon_id ); ?>">
		<button type="submit" class="prpl-button prpl-button-primary" id="prpl-set-site-icon-button" <?php echo $site_icon_id ? '' : 'disabled'; ?>>
			<?php \esc_html_e( 'Set site icon', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Get the enqueue data.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		return [
			'name' => 'prplSiteIcon',
			'data' => [
				'mediaTitle'      => \esc_html__( 'Choose Site Icon', 'progress-planner' ),
				'mediaButtonText' => \esc_html__( 'Use as Site Icon', 'progress-planner' ),
			],
		];
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Set site icon', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
