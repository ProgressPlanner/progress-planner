/* global progressPlannerTour, prplL10n */
/*
 * Tour
 *
 * A tour for the Progress Planner.
 *
 * Dependencies: driver, progress-planner/l10n
 */
const prplDriver = window.driver.js.driver;

const prplDriverObj = prplDriver( {
	showProgress: true,
	popoverClass: 'prpl-driverjs-theme',
	progressText: prplL10n( 'progressText' ),
	nextBtnText: prplL10n( 'nextBtnText' ),
	prevBtnText: prplL10n( 'prevBtnText' ),
	doneBtnText: prplL10n( 'doneBtnText' ),
	steps: progressPlannerTour.steps,
	onDestroyStarted: () => {
		// Remove tour_step from URL when tour is destroyed.
		const newUrl = new URL( window.location );
		newUrl.searchParams.delete( 'tour_step' );
		window.history.replaceState( {}, '', newUrl );

		prplDriverObj.destroy();
	},
	onPopoverRender: (
		popover, // eslint-disable-line no-unused-vars
		{ config, state } // eslint-disable-line no-unused-vars
	) => {
		// Update URL with current step.
		const newUrl = new URL( window.location );
		newUrl.searchParams.set( 'tour_step', state.activeIndex );
		window.history.replaceState( {}, '', newUrl );
	},
} );

// eslint-disable-next-line no-unused-vars -- This is called on a few buttons.
function prplStartTour() {
	// Check URL parameters.
	const urlParams = new URLSearchParams( window.location.search );
	const savedStepIndex = urlParams.get( 'tour_step' );

	prplDriverObj.drive(
		null !== savedStepIndex
			? parseInt( savedStepIndex, 10 ) // Start from saved step.
			: 0 // Start from beginning.
	);

	// Remove `show-tour=true` from the URL, without refreshing the page.
	window.history.replaceState(
		{},
		document.title,
		window.location.href
			.replace( '&show-tour=true', '' )
			.replace( 'show-tour=true', '' )
	);
}

// Add event listener for tour button using event delegation.
// This is necessary because the button is rendered by React after this script loads.
document.addEventListener( 'click', ( event ) => {
	if ( event.target.closest( '#prpl-start-tour-icon-button' ) ) {
		prplStartTour();
	}
} );
