/**
 * review-post-notes script.
 *
 * Auto-opens the Notes sidebar in the block editor when a post is opened
 * via the "Review with Notes" task action, so the injected review notes
 * are immediately visible.
 *
 * Dependencies: wp-data, wp-dom-ready, wp-editor
 */

wp.domReady( () => {
	// The "All notes" sidebar registered by WordPress 6.9+.
	const NOTES_SIDEBAR = 'edit-post/collab-history-sidebar';

	const openNotesSidebar = () =>
		wp.data
			.dispatch( 'core/interface' )
			.enableComplementaryArea( 'core', NOTES_SIDEBAR );

	// Wait for the editor to finish initializing, otherwise the sidebar
	// restored from user preferences would override ours.
	if ( wp.data.select( 'core/editor' ).__unstableIsEditorReady() ) {
		openNotesSidebar();
		return;
	}

	const unsubscribe = wp.data.subscribe( () => {
		if ( ! wp.data.select( 'core/editor' ).__unstableIsEditorReady() ) {
			return;
		}
		unsubscribe();
		openNotesSidebar();
	} );
} );
