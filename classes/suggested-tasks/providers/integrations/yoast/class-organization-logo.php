<?php
/**
 * Add task for Yoast SEO: set your organization logo.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

/**
 * Add task for Yoast SEO: set your organization logo.
 */
class Organization_Logo extends Yoast_Interactive_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-organization-logo';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'yoast-organization-logo';

	/**
	 * Yoast SEO instance.
	 *
	 * @var \YoastSEO
	 */
	protected $yoast_seo;

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct();
		$this->yoast_seo = \YoastSEO();
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' // @phpstan-ignore-line property.nonObject
			? \esc_html__( 'Yoast SEO: set your organization logo', 'progress-planner' )
			: \esc_html__( 'Yoast SEO: set your person logo', 'progress-planner' );
	}

	/**
	 * Get external link URL.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		return $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' // @phpstan-ignore-line property.nonObject
			? \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-person-logo' )
			: \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-organization-logo' );
	}

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [
			[
				'iconElement'  => 'legend.yst-label',
				'valueElement' => [
					'elementSelector' => 'input[name="wpseo_titles.company_logo"]',
					'attributeName'   => 'value',
					'attributeValue'  => '',
					'operator'        => '!=',
				],
			],
			[
				'iconElement'  => 'legend.yst-label',
				'valueElement' => [
					'elementSelector' => 'input[name="wpseo_titles.person_logo"]',
					'attributeName'   => 'value',
					'attributeValue'  => '',
					'operator'        => '!=',
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

		// Check if the site logo is set, Yoast SEO uses it as a fallback.
		$site_logo_id = \get_option( 'site_logo' );
		if ( ! $site_logo_id ) {
			$site_logo_id = \get_theme_mod( 'custom_logo', false );
		}

		// If the site logo is set, we don't need to add the task.
		if ( (int) $site_logo_id ) {
			return false;
		}

		// If the site is for a person, and the person logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'company' // @phpstan-ignore-line property.nonObject
			&& $this->yoast_seo->helpers->options->get( 'company_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		// If the site is for a person, and the organization logo is already set, we don't need to add the task.
		if ( $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) === 'person' // @phpstan-ignore-line property.nonObject
			&& $this->yoast_seo->helpers->options->get( 'person_logo' ) // @phpstan-ignore-line property.nonObject
		) {
			return false;
		}

		return true;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		$this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person'  // @phpstan-ignore-line property.nonObject
			? \printf(
				/* translators: %s: "Read more" link. */
				\esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your organization logo in the Yoast SEO settings. %s.', 'progress-planner' ),
				'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-person-logo' ) ) . '" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Organization Logo', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
			) : \printf(
				/* translators: %s: "Read more" link. */
				\esc_html__( 'To make Yoast SEO output the correct Schema, you need to set your person logo in the Yoast SEO settings. %s.', 'progress-planner' ),
				'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/yoast-organization-logo' ) ) . '" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the Yoast SEO Person Logo', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
			);
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		// Enqueue media scripts.
		\wp_enqueue_media();

		$organization_logo_id = $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' ? $this->yoast_seo->helpers->options->get( 'company_logo' ) : $this->yoast_seo->helpers->options->get( 'person_logo' ); // @phpstan-ignore-line property.nonObject
		?>
		<div id="organization-logo-preview" style="margin-bottom: 15px; min-height: 150px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ddd; border-radius: 4px; padding: 10px;">
			<?php if ( $organization_logo_id ) : ?>
				<?php echo \wp_get_attachment_image( $organization_logo_id, 'thumbnail', false, [ 'style' => 'max-width: 150px; height: auto; border-radius: 4px; border: 1px solid #ddd;' ] ); ?>
			<?php else : ?>
				<span style="color: #999;"><?php \esc_html_e( 'No image selected', 'progress-planner' ); ?></span>
			<?php endif; ?>
		</div>
		<button type="button" id="prpl-upload-organization-logo-button" class="prpl-button prpl-button-secondary" style="margin-bottom: 15px;">
			<?php \esc_html_e( 'Choose or Upload Image', 'progress-planner' ); ?>
		</button>
		<input type="hidden" name="prpl_yoast_organization_logo_id" id="prpl-yoast-organization-logo-id" value="<?php echo \esc_attr( $organization_logo_id ); ?>">
		<button type="submit" class="prpl-button prpl-button-primary" id="prpl-set-organization-logo-button" <?php echo $organization_logo_id ? '' : 'disabled'; ?>>
			<?php \esc_html_e( 'Set logo', 'progress-planner' ); ?>
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
			'name' => 'prplYoastOrganizationLogo',
			'data' => [
				'mediaTitle'      => $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' ? \esc_html__( 'Choose Organization Logo', 'progress-planner' ) : \esc_html__( 'Choose Person Logo', 'progress-planner' ),  // @phpstan-ignore-line property.nonObject
				'mediaButtonText' => $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' ? \esc_html__( 'Use as Organization Logo', 'progress-planner' ) : \esc_html__( 'Use as Person Logo', 'progress-planner' ),  // @phpstan-ignore-line property.nonObject
				'companyOrPerson' => $this->yoast_seo->helpers->options->get( 'company_or_person', 'company' ) !== 'person' ? 'company' : 'person',  // @phpstan-ignore-line property.nonObject
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
			'html'     => '<a class="prpl-tooltip-action-text" href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Set logo', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
