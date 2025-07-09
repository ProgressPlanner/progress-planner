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
class Blog_Description extends Tasks {

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
	 * Whether the task is interactive.
	 *
	 * @var bool
	 */
	const IS_INTERACTIVE = true;

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'blog-description';

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
		return \sprintf(
			/* translators: %s:<a href="https://prpl.fyi/set-tagline" target="_blank">tagline</a> link */
			\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
			'<a href="https://prpl.fyi/set-tagline" target="_blank">' . \esc_html__( 'tagline', 'progress-planner' ) . '</a>'
		);
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
		?>
		<p><?php \esc_html_e( 'In a few words, explain what this site is about.', 'progress-planner' ); ?></p>
		<?php
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<label>
			<input
				name="blogdescription"
				type="text"
				id="blogdescription"
				value="<?php echo \esc_attr( \get_bloginfo( 'description' ) ); ?>"
				class="regular-text"
			>
			<p><?php echo \wp_kses_post( $this->get_task_details()['description'] ); ?></p>
		</label>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Save', 'progress-planner' ); ?>
		</button>
		<?php
	}
}
