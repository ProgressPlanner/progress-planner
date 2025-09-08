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
		// Bail early when we're on the site-editor.php page.
		$request = \filter_input( INPUT_SERVER, 'REQUEST_URI' );
		if ( ! $request && isset( $_SERVER['REQUEST_URI'] ) ) {
			$request = \sanitize_text_field( \wp_unslash( $_SERVER['REQUEST_URI'] ) );
		}
		if ( $request && \str_contains( $request, 'site-editor.php' ) ) {
			return;
		}

		$page_types = \progress_planner()->get_page_types()->get_page_types();

		// Check if the page-type is set in the URL (user is coming from the Settings page).
		if ( isset( $_GET['prpl_page_type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$prpl_pt = \sanitize_text_field( \wp_unslash( $_GET['prpl_page_type'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

			foreach ( $page_types as $page_type ) {
				if ( $page_type['slug'] === $prpl_pt ) {
					$prpl_preselected_page_type = $page_type['id'];
					break;
				}
			}
		} else {
			// Get the default page-type.
			$prpl_preselected_page_type = \progress_planner()->get_page_types()->get_default_page_type( (string) \get_post_type(), (int) \get_the_ID() );
		}

		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'editor',
			[
				'name' => 'progressPlannerEditor',
				'data' => [
					'lessons'         => \progress_planner()->get_lessons()->get_items(),
					'pageTypes'       => $page_types,
					'defaultPageType' => $prpl_preselected_page_type,
				],
			]
		);

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/editor' );
	}
}
