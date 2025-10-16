<?php
/**
 * Add task to create a search template.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Search_Template as Search_Template_Data_Collector;

/**
 * Add task to create a search template.
 */
class Search_Template extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'search-template';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_theme_options';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Search_Template_Data_Collector::class;

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'search-template';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/search-template';

	/**
	 * The task priority.
	 *
	 * Search templates are important for SEO and user experience.
	 * Using PRIORITY_HIGH (20).
	 *
	 * @var int
	 */
	protected $priority = 20;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		$data = $this->get_data_collector()->collect();

		if ( $data['is_block_theme'] ) {
			// Link to Site Editor for block themes.
			$this->url = \admin_url( 'site-editor.php?canvas=edit' );
		} else {
			// Link to Appearance > Theme File Editor for classic themes.
			$this->url = \admin_url( 'theme-editor.php' );
		}

		return $this->url;
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Add a Search Template', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		$data = $this->get_data_collector()->collect();

		if ( $data['is_block_theme'] ) {
			return \sprintf(
				/* translators: %s: Theme name. */
				\esc_html__(
					'Your site is using the %s block theme but does not have a dedicated search template. A search template provides a better experience for users searching your site.',
					'progress-planner'
				),
				'<strong>' . \esc_html( $data['theme_name'] ) . '</strong>'
			);
		}

		return \sprintf(
			/* translators: %s: Theme name. */
			\esc_html__(
				'Your site is using the %s classic theme but does not have a dedicated search.php template. A search template provides a better experience for users searching your site.',
				'progress-planner'
			),
			'<strong>' . \esc_html( $data['theme_name'] ) . '</strong>'
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$data = $this->get_data_collector()->collect();

		// If the site already has a search template, no need to add the task.
		return ! $data['has_search_template'];
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		$data = $this->get_data_collector()->collect();

		if ( $data['is_block_theme'] ) {
			$this->print_block_theme_instructions( $data );
		} else {
			$this->print_classic_theme_instructions( $data );
		}
	}

	/**
	 * Print instructions for block themes.
	 *
	 * @param array $data The template data.
	 * @return void
	 */
	private function print_block_theme_instructions( $data ) {
		?>
		<p>
			<?php
			\printf(
				/* translators: %s: Theme name. */
				\esc_html__(
					'Your site is using the %s block theme but does not have a dedicated search template. Search results will use the default archive or index template, which may not provide the best user experience for search queries.',
					'progress-planner'
				),
				'<strong>' . \esc_html( $data['theme_name'] ) . '</strong>'
			);
			?>
		</p>
		<p>
			<?php \esc_html_e( 'To create a search template:', 'progress-planner' ); ?>
		</p>
		<ol style="margin-left: 1.5em;">
			<li><?php \esc_html_e( 'Go to Appearance → Editor (Site Editor)', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Click on "Templates" in the sidebar', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Click "Add New Template" and select "Search Results"', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Customize the template with blocks like Query Loop, Search Results heading, etc.', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Save your template', 'progress-planner' ); ?></li>
		</ol>
		<p>
			<strong><?php \esc_html_e( 'Why is this important?', 'progress-planner' ); ?></strong>
			<?php \esc_html_e( 'A dedicated search template allows you to provide a better user experience by customizing how search results are displayed, adding relevant messaging, and improving the overall usability of your site\'s search functionality.', 'progress-planner' ); ?>
		</p>
		<?php
	}

	/**
	 * Print instructions for classic themes.
	 *
	 * @param array $data The template data.
	 * @return void
	 */
	private function print_classic_theme_instructions( $data ) {
		?>
		<p>
			<?php
			\printf(
				/* translators: %s: Theme name. */
				\esc_html__(
					'Your site is using the %s classic theme but does not have a dedicated search.php template. Search results will use the default archive.php or index.php template, which may not provide the best user experience for search queries.',
					'progress-planner'
				),
				'<strong>' . \esc_html( $data['theme_name'] ) . '</strong>'
			);
			?>
		</p>
		<p>
			<?php \esc_html_e( 'To create a search template:', 'progress-planner' ); ?>
		</p>
		<ol style="margin-left: 1.5em;">
			<li><?php \esc_html_e( 'Create a new file named "search.php" in your theme directory', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'You can start by copying archive.php or index.php and modifying it', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Add search-specific elements like search form, "Search results for: [query]" heading', 'progress-planner' ); ?></li>
			<li><?php \esc_html_e( 'Consider showing a "no results" message when the search returns no posts', 'progress-planner' ); ?></li>
		</ol>
		<p>
			<?php
			\printf(
				/* translators: %s: URL to theme editor. */
				\esc_html__(
					'If you are using a child theme, you can create the file through the %s.',
					'progress-planner'
				),
				'<a href="' . \esc_url( \admin_url( 'theme-editor.php' ) ) . '" target="_blank">' . \esc_html__( 'Theme File Editor', 'progress-planner' ) . '</a>'
			);
			?>
		</p>
		<p>
			<strong><?php \esc_html_e( 'Why is this important?', 'progress-planner' ); ?></strong>
			<?php \esc_html_e( 'A dedicated search template allows you to provide a better user experience by customizing how search results are displayed, adding relevant messaging, and improving the overall usability of your site\'s search functionality.', 'progress-planner' ); ?>
		</p>
		<?php
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$data = $this->get_data_collector()->collect();

		if ( $data['is_block_theme'] ) {
			?>
			<a href="<?php echo \esc_url( \admin_url( 'site-editor.php?canvas=edit' ) ); ?>" class="prpl-button prpl-button-primary" target="_blank">
				<?php \esc_html_e( 'Open Site Editor', 'progress-planner' ); ?>
			</a>
			<?php
		} else {
			?>
			<a href="<?php echo \esc_url( \admin_url( 'theme-editor.php' ) ); ?>" class="prpl-button prpl-button-primary" target="_blank">
				<?php \esc_html_e( 'Open Theme Editor', 'progress-planner' ); ?>
			</a>
			<?php
		}
		?>
		<p style="margin-top: 1em; font-size: 0.9em; color: #666;">
			<?php \esc_html_e( 'After creating the search template, click the button below to mark this task as complete.', 'progress-planner' ); ?>
		</p>
		<button type="submit" class="prpl-button prpl-button-secondary">
			<?php \esc_html_e( 'I created the search template', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Get the enqueue data.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		$data = $this->get_data_collector()->collect();

		return [
			'name' => 'searchTemplateData',
			'data' => [
				'isBlockTheme'      => $data['is_block_theme'],
				'themeName'         => $data['theme_name'],
				'hasSearchTemplate' => $data['has_search_template'],
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Learn more', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
