<?php
/**
 * Add tasks for Core blogdescription.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for Core blogdescription.
 */
class Blog_Description extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'core-blogdescription';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'core-blogdescription';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/set-tagline';

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set tagline', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Set the tagline to make your website look more professional.', 'progress-planner' );
	}

	/**
	 * Get the task-action text.
	 *
	 * @return string
	 */
	protected function get_task_action_text() {
		return \esc_html__( 'Set tagline', 'progress-planner' );
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
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => 'th:has(+td #tagline-description)',
		];
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return '' === \get_bloginfo( 'description' );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'In a few words, explain what this site is about. This information is used in your website\'s schema and RSS feeds, and can be displayed on your site. The tagline typically is your site\'s mission statement.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<label>
			<p><?php echo \wp_kses_post( $this->get_task_details()['description'] ); ?></p>
			<input
				name="blogdescription"
				type="text"
				id="blogdescription"
				value="<?php echo \esc_attr( \get_bloginfo( 'description' ) ); ?>"
				class="regular-text"
				placeholder="<?php \esc_html_e( 'A catchy phrase to describe your website', 'progress-planner' ); ?>"
			>
		</label>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;" disabled>
			<?php \esc_html_e( 'Save', 'progress-planner' ); ?>
		</button>
		<?php
	}
}
