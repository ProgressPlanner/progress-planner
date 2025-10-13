<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category as Uncategorized_Category_Data_Collector;

/**
 * Add task to rename the Uncategorized category.
 */
class Rename_Uncategorized_Category extends Tasks_Interactive {

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
	protected const PROVIDER_ID = 'rename-uncategorized-category';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'rename-uncategorized-category';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_categories';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Uncategorized_Category_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/rename-uncategorized-category';

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_rename-uncategorized-category', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'term.php?taxonomy=category&tag_ID=' . $this->get_data_collector()->collect() );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Rename Uncategorized category', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 0 !== $this->get_data_collector()->collect();
	}

	/**
	 * Update the Uncategorized category cache.
	 *
	 * @return void
	 */
	public function update_uncategorized_category_cache() {
		$this->get_data_collector()->update_uncategorized_category_cache(); // @phpstan-ignore-line method.notFound
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'The Uncategorized category is used for posts that don\'t have a category. We recommend renaming it to something that fits your site better.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$uncategorized_category_id = $this->get_data_collector()->collect();
		$uncategorized_category    = \get_term( $uncategorized_category_id, 'category' );

		if ( ! $uncategorized_category || is_wp_error( $uncategorized_category ) ) {
			return;
		}
		?>
		<label>
			<p style="margin-bottom: 0.5rem;">
				<?php \esc_html_e( 'New name for the Uncategorized category', 'progress-planner' ); ?>
			</p>
			<input type="text" name="prpl_uncategorized_category_name" id="prpl_uncategorized_category_name" value="" placeholder="<?php echo \esc_attr( $uncategorized_category->name ); ?>" class="regular-text" />
		</label>
		<label style="display: block; margin-top: 1rem;">
			<p style="margin-bottom: 0.5rem;">
				<?php \esc_html_e( 'New slug for the Uncategorized category', 'progress-planner' ); ?>
			</p>
			<input type="text" name="prpl_uncategorized_category_slug" id="prpl_uncategorized_category_slug" value="" placeholder="<?php echo \esc_attr( $uncategorized_category->slug ); ?>" class="regular-text" />
		</label>
		<button type="submit" class="prpl-button prpl-button-primary">
			<?php \esc_html_e( 'Rename the Uncategorized category', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - uncategorized_category_name: (string) The new name for the Uncategorized category.
	 * - uncategorized_category_slug: (string) The new slug for the Uncategorized category.
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

		if ( ! isset( $_POST['uncategorized_category_name'] ) || ! isset( $_POST['uncategorized_category_slug'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing uncategorized category name or slug.', 'progress-planner' ) ] );
		}

		$uncategorized_category_name = trim( \sanitize_text_field( \wp_unslash( $_POST['uncategorized_category_name'] ) ) );
		$uncategorized_category_slug = trim( \sanitize_text_field( \wp_unslash( $_POST['uncategorized_category_slug'] ) ) );

		if ( empty( $uncategorized_category_name ) || empty( $uncategorized_category_slug ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid uncategorized category name or slug.', 'progress-planner' ) ] );
		}

		$default_category_name = \__( 'Uncategorized' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		$default_category_slug = \sanitize_title( \_x( 'Uncategorized', 'Default category slug' ) ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain

		if ( $uncategorized_category_name === $default_category_name || $uncategorized_category_slug === $default_category_slug ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You cannot use the default name or slug for the Uncategorized category.', 'progress-planner' ) ] );
		}

		$uncategorized_category_id = $this->get_data_collector()->collect();

		$term = \get_term_by( 'id', $uncategorized_category_id, 'category' );
		if ( $term ) {
			\wp_update_term(
				$term->term_id,
				'category',
				[
					'name' => $uncategorized_category_name,
					'slug' => $uncategorized_category_slug,
				]
			);

			\wp_send_json_success( [ 'message' => \esc_html__( 'Uncategorized category updated.', 'progress-planner' ) ] );
		}

		\wp_send_json_error( [ 'message' => \esc_html__( 'Uncategorized category not found.', 'progress-planner' ) ] );
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
			'html'     => '<a class="prpl-tooltip-action-text" href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Rename', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
