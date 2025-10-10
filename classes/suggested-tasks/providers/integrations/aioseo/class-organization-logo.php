<?php
/**
 * Add task for All in One SEO: set your organization/person logo.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

/**
 * Add task for All in One SEO: set your organization/person logo.
 */
class Organization_Logo extends AIOSEO_Provider {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'aioseo-organization-logo';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=aioseo-search-appearance#/' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		// Check if AIOSEO is active to determine person vs organization.
		if ( ! \function_exists( 'aioseo' ) ) {
			return \esc_html__( 'All in One SEO: set your organization logo', 'progress-planner' );
		}

		return \esc_html__( 'All in One SEO: set your organization logo', 'progress-planner' );
	}

	/**
	 * Get external link URL.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		// Check if AIOSEO is active to determine person vs organization.
		if ( ! \function_exists( 'aioseo' ) ) {
			return \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/aioseo-organization-logo' );
		}

		$options   = \aioseo()->options->searchAppearance->global->schema;
		$is_person = isset( $options->siteRepresents ) && 'person' === $options->siteRepresents; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		return $is_person
			? \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/aioseo-person-logo' )
			: \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/aioseo-organization-logo' );
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

		$represents = \aioseo()->options->searchAppearance->global->schema->siteRepresents;

		// Check if logo is already set.
		if ( $represents === 'person' ) {
			return false;
		}

		// Check organization logo.
		return \aioseo()->options->searchAppearance->global->schema->organizationLogo === '';
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
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=aioseo-search-appearance#/' ) . '" target="_self">' . \esc_html__( 'Set logo', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
