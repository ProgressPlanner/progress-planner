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
		// Assigning a page-type is an editorial decision, so require the capability
		// to edit others' posts. Authors editing their own posts don't get the sidebar.
		if ( ! \current_user_can( 'edit_others_posts' ) ) {
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
					'lessons'          => \progress_planner()->get_lessons()->get_items(),
					'pageTypes'        => $page_types,
					'defaultPageType'  => $prpl_preselected_page_type,
					'adminMenuIconSvg' => \progress_planner()->get_ui__branding()->get_admin_menu_icon( true ),
				],
			]
		);

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/editor' );
	}
}
