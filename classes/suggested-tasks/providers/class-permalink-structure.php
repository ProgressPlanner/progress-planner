<?php
/**
 * Add tasks for permalink structure.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Permalink_Structure extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'core-permalink-structure';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'core-permalink-structure';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/change-default-permalink-structure';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_core-permalink-structure', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-permalink.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		$icon_el = 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]';

		// If the task is completed, we want to add icon element only to the selected option (not both).
		if ( $this->is_task_completed() ) {
			$permalink_structure = \get_option( 'permalink_structure' );

			if ( '/%year%/%monthnum%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-month-name"]';
			}

			if ( '/%postname%/' === $permalink_structure || '/index.php/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-post-name"]';
			}
		}

		return [
			'hook'   => 'options-permalink.php',
			'iconEl' => $icon_el,
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set permalink structure', 'progress-planner' );
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$permalink_structure = \get_option( 'permalink_structure' );
		return '/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'By default, WordPress uses URLs with question marks and post IDs. This is not ideal for SEO and user experience. Choose a more readable permalink structure for your site.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$permalink_structure = \get_option( 'permalink_structure' );
		$prefix              = \got_url_rewrite() ? '' : '/index.php';
		$url_base            = \home_url( $prefix );
		$index_php_prefix    = \got_url_rewrite() ? '' : '/index.php';

		// Default structure values from WP core.
		$structures = [
			[
				'id'    => 'day-name',
				'value' => $index_php_prefix . '/%year%/%monthnum%/%day%/%postname%/',
				'label' => \__( 'Day and name', 'progress-planner' ),
				'code'  => $url_base . '/' . \gmdate( 'Y/m/d' ) . '/sample-post/',
			],
			[
				'id'    => 'month-name',
				'value' => $index_php_prefix . '/%year%/%monthnum%/%postname%/',
				'label' => \__( 'Month and name', 'progress-planner' ),
				'code'  => $url_base . '/' . \gmdate( 'Y/m' ) . '/sample-post/',
			],
			[
				'id'    => 'numeric',
				'value' => $index_php_prefix . '/archives/%post_id%',
				'label' => \__( 'Numeric', 'progress-planner' ),
				'code'  => $url_base . '/archives/123',
			],
			[
				'id'    => 'post-name',
				'value' => $index_php_prefix . '/%postname%/',
				'label' => \__( 'Post name', 'progress-planner' ),
				'code'  => $url_base . '/sample-post/',
			],
		];

		$default_structure_values = \wp_list_pluck( $structures, 'value' );
		$is_custom                = ! \in_array( $permalink_structure, $default_structure_values, true );
		?>
		<div class="radios">
			<fieldset class="prpl-structure-selection">
				<?php foreach ( $structures as $structure ) : ?>
					<div class="prpl-radio-wrapper">
						<label class="prpl-custom-radio">
							<input
								id="prpl-permalink-input-<?php echo \esc_attr( $structure['id'] ); ?>"
								name="prpl_permalink_structure"
								type="radio"
								value="<?php echo \esc_attr( $structure['value'] ); ?>"
								<?php \checked( $structure['value'], $permalink_structure ); ?>
							/>
							<span class="prpl-custom-control"></span>
							<div>
								<span><?php echo \esc_html( $structure['label'] ); ?></span>
								<code style="display: block;"><?php echo \esc_html( $structure['code'] ); ?></code>
							</div>
						</label>
					</div>
				<?php endforeach; ?>

				<?php /* Custom permalink structure. */ ?>
				<div class="prpl-radio-wrapper">
					<label class="prpl-custom-radio">
						<input type="radio" name="prpl_permalink_structure" id="prpl_permalink_structure_custom_radio" value="custom" <?php \checked( $is_custom ); ?>/>
						<span class="prpl-custom-control"></span> <span>
							<?php
							\printf(
								/* translators: %s: Screen reader text "enter a custom date format in the following field". */
								\esc_html__( 'Custom: %s', 'progress-planner' ),
								/* translators: Hidden accessibility text. */
								'<span class="screen-reader-text">' . \esc_html__( 'enter a custom permalink structure in the following field', 'progress-planner' ) . '</span>'
							);
							?>
						</span>
					</label>
				</div>
				<label for="prpl_custom_permalink_structure" class="screen-reader-text">
					<?php
					/* translators: Hidden accessibility text. */
					\esc_html_e( 'Custom permalink structure:', 'progress-planner' );
					?>
				</label>
				<div style="display: flex; gap: 0.5rem;">
					<code style="display: flex; align-items: center;"><?php echo \esc_html( $url_base ); ?></code>
					<input type="text" name="prpl_custom_permalink_structure" id="prpl_custom_permalink_structure" value="<?php echo \esc_attr( $permalink_structure ); ?>" class="small-text" />
				</div>
			</fieldset>
		</div>
		<button type="submit" class="prpl-button prpl-button-primary">
			<?php \esc_html_e( 'Set permalink structure', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change core permalink settings.
	 * The $_POST data is expected to be:
	 * - value: (mixed) The value to update the setting to.
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {

		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update settings.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['value'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		$permalink_structure = \sanitize_text_field( \wp_unslash( $_POST['value'] ) );

		if ( empty( $permalink_structure ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid permalink structure.', 'progress-planner' ) ] );
		}

		// Update the permalink structure.
		\update_option( 'permalink_structure', $permalink_structure );

		// Flush rewrite rules to apply the new permalink structure.
		\flush_rewrite_rules();

		\wp_send_json_success( [ 'message' => \esc_html__( 'Permalink structure updated.', 'progress-planner' ) ] );
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Select permalink structure', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
