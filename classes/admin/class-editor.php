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
		if ( false !== \strpos( (string) $request, '/site-editor.php' ) ) {
			return;
		}

		$page_types = \progress_planner()->get_page_types()->get_page_types();

		// Check if the page-type is set in the URL (user is coming from the Settings page).
		if ( isset( $_GET['prpl_page_type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$prpl_pt = sanitize_text_field( wp_unslash( $_GET['prpl_page_type'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

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

		\wp_enqueue_script(
			'progress-planner/editor',
			\plugins_url( '/assets/js/editor.js', PROGRESS_PLANNER_FILE ),
			[ 'wp-plugins', 'wp-edit-post', 'wp-element' ],
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/editor.js' ),
			true
		);

		\wp_localize_script(
			'progress-planner/editor',
			'progressPlannerEditor',
			[
				'lessons'         => \progress_planner()->get_lessons()->get_items(),
				'pageTypes'       => $page_types,
				'defaultPageType' => $prpl_preselected_page_type,
				'i18n'            => [
					'pageType'                     => \esc_html__( 'Page type', 'progress-planner' ),
					'progressPlannerSidebar'       => \esc_html__( 'Progress Planner Sidebar', 'progress-planner' ),
					'progressPlanner'              => \esc_html__( 'Progress Planner', 'progress-planner' ),
					'watchVideo'                   => \esc_html__( 'Watch video', 'progress-planner' ),
					'video'                        => \esc_html__( 'Video', 'progress-planner' ),
					'checklistProgressDescription' => sprintf(
						/* translators: %s: the checkmark icon. */
						\esc_html__( 'Check off all required elements %s in the element checks below', 'progress-planner' ),
						'<span style="background-color:#14b8a6;padding:0.35em;margin:0 0.25em;border-radius:50%;display:inline-block;"></span>'
					),
				],
			]
		);
		\wp_enqueue_style(
			'progress-planner-editor',
			\plugins_url( '/assets/css/editor.css', PROGRESS_PLANNER_FILE ),
			[],
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/editor.css' )
		);
	}
}
