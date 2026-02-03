<?php
/**
 * Tweaks for the editor.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Editor class.
 */
class Editor {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_script' ] );
	}

	/**
	 * Enqueue the editor script.
	 *
	 * @return void
	 */
	public function enqueue_editor_script() {
		$page_types = \progress_planner()->get_page_types()->get_page_types();

		// Initialize default page type.
		$prpl_preselected_page_type = 0;

		// Check if the page-type is set in the URL (user is coming from the Settings page).
		if ( isset( $_GET['prpl_page_type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$prpl_pt = \sanitize_text_field( \wp_unslash( $_GET['prpl_page_type'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			foreach ( $page_types as $page_type ) {
				if ( $page_type['slug'] === $prpl_pt ) {
					$prpl_preselected_page_type = $page_type['id'];
					break;
				}
			}
		}

		// If no page type was set from URL, get the default.
		if ( ! $prpl_preselected_page_type ) {
			$prpl_preselected_page_type = \progress_planner()->get_page_types()->get_default_page_type( (string) \get_post_type(), (int) \get_the_ID() );
		}

		// Enqueue the l10n script to make prplL10nStrings available.
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'progress-planner/l10n' );

		// Enqueue the built editor script.
		$editor_asset_file = \constant( 'PROGRESS_PLANNER_DIR' ) . '/build/editor.asset.php';
		$editor_asset      = \file_exists( $editor_asset_file )
			? require $editor_asset_file // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
			: [
				'dependencies' => [],
				'version'      => \progress_planner()->get_version(),
			];

		// Ensure dependencies is an array.
		if ( ! \is_array( $editor_asset['dependencies'] ) ) {
			$editor_asset['dependencies'] = [];
		}

		// Add l10n as a dependency if not already present.
		if ( ! \in_array( 'progress-planner/l10n', $editor_asset['dependencies'], true ) ) {
			$editor_asset['dependencies'][] = 'progress-planner/l10n';
		}

		\wp_enqueue_script(
			'progress-planner/editor',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/editor.js',
			$editor_asset['dependencies'],
			$editor_asset['version'],
			true
		);

		// Localize the script.
		\wp_localize_script(
			'progress-planner/editor',
			'progressPlannerEditor',
			[
				'lessons'         => \progress_planner()->get_lessons()->get_items(),
				'pageTypes'       => $page_types,
				'defaultPageType' => $prpl_preselected_page_type,
				'adminMenuIconSvg' => \progress_planner()->get_ui__branding()->get_admin_menu_icon( true ),
			]
		);

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/editor' );
	}
}
