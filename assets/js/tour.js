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
		// Monthly badges popover is no longer used (badges are in React widget).
		// Tour step 5 is kept for backward compatibility but popover is optional.
		const monthlyBadgesPopover = document.getElementById(
			'prpl-popover-monthly-badges'
		);
		if ( state.activeIndex === 5 && monthlyBadgesPopover ) {
			prplTourShowPopover( monthlyBadgesPopover );
		}

		// Update URL with current step.
		const newUrl = new URL( window.location );
		newUrl.searchParams.set( 'tour_step', state.activeIndex );
		window.history.replaceState( {}, '', newUrl );
	},
} );

function prplTourShowPopover( popover ) {
	popover.showPopover();
	prplMakePopoverBackdropTransparent( popover );
}

function prplTourHidePopover( popover ) {
	popover.hidePopover();
	document.getElementById( popover.id + '-backdrop-transparency' ).remove();
}

// Function to make the backdrop of a popover transparent.
function prplMakePopoverBackdropTransparent( popover ) {
	if ( popover ) {
		const style = document.createElement( 'style' );
		style.id = popover.id + '-backdrop-transparency';
		style.innerHTML = `
					#${ popover.id }::backdrop {
							background-color: transparent !important;
					}
			`;
		document.head.appendChild( style );
	}
}

// eslint-disable-next-line no-unused-vars -- This is called on a few buttons.
function prplStartTour() {
	// Monthly badges popover is no longer used (badges are in React widget).
	// Tour steps are kept for backward compatibility but popover is optional.
	const monthlyBadgesPopover = document.getElementById(
		'prpl-popover-monthly-badges'
	);
	const progressPlannerTourSteps = progressPlannerTour.steps;

	progressPlannerTourSteps[ 4 ].popover.onNextClick = function () {
		if ( monthlyBadgesPopover ) {
			prplTourShowPopover( monthlyBadgesPopover );
		}
		prplDriverObj.moveNext();
	};
	progressPlannerTourSteps[ 5 ].popover.onNextClick = function () {
		if ( monthlyBadgesPopover ) {
			prplTourHidePopover( monthlyBadgesPopover );
		}
		prplDriverObj.moveNext();
	};

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

// Add event listener for tour button.
document
	.getElementById( 'prpl-start-tour-icon-button' )
	?.addEventListener( 'click', prplStartTour );
