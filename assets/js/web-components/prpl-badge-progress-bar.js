/* global customElements, HTMLElement */
/*
 * Badge Progress Bar
 *
 * A web component to display a badge progress bar.
 *
 * Dependencies: progress-planner/l10n, progress-planner/web-components/prpl-badge
 */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-badge-progress-bar',
	class extends HTMLElement {
		constructor( badgeId, points, maxPoints ) {
			// Get parent class properties
			super();
			badgeId = badgeId || this.getAttribute( 'data-badge-id' );
			points = points || this.getAttribute( 'data-points' );
			maxPoints = maxPoints || this.getAttribute( 'data-max-points' );
			const progress = ( points / maxPoints ) * 100;

			this.innerHTML = `
				<div class="prpl-badge-progress-bar-container" style="padding: 1rem 0;">
					<div
						class="prpl-badge-progress-bar"
						style="
							width: 100%;
							height: 1rem;
							background-color: var(--prpl-color-gray-1);
							border-radius: 0.5rem;
							position: relative;"
					>
						<div
							class="prpl-badge-progress-bar-progress"
							style="
								width: ${ progress }%;
								height: 100%;
								background-color: var(--prpl-color-accent-orange);
								border-radius: 0.5rem;"
						></div>
						<prpl-badge
							badge-id="${ badgeId }"
							style="
								display:flex;
								width: 7.5rem;
								height: auto;
								position: absolute;
								left: calc(${ progress }% - 3.75rem);
								top: -2.5rem;"
						></prpl-badge>
					</div>
				</div>
			`;
		}
	}
);

/**
 * Update the previous month badge progress bar.
 *
 * @param {number} pointsDiff The points difference.
 *
 * @return {void}
 */
// eslint-disable-next-line no-unused-vars
const prplUpdatePreviousMonthBadgeProgressBar = ( pointsDiff ) => {
	const progressBars = document.querySelectorAll(
		'.prpl-previous-month-badge-progress-bar-wrapper prpl-badge-progress-bar'
	);

	// Bail early if no badge progress bars are found.
	if ( ! progressBars.length ) {
		return;
	}

	// Get the 1st incomplete badge progress bar.
	const progressBar =
		parseInt( progressBars[ 0 ]?.getAttribute( 'data-points' ) ) >=
		parseInt( progressBars[ 0 ]?.getAttribute( 'data-max-points' ) )
			? progressBars[ 1 ]
			: progressBars[ 0 ];

	// Bail early if no badge progress bar is found.
	if ( ! progressBar ) {
		return;
	}

	// Get the badge progress bar properties.
	const badgeId = progressBar.getAttribute( 'data-badge-id' );
	const badgePoints = progressBar.getAttribute( 'data-points' );
	const badgeMaxPoints = progressBar.getAttribute( 'data-max-points' );
	const badgeProgress = customElements.get( 'prpl-badge-progress-bar' );
	const badgeNewPoints = parseInt( badgePoints ) + pointsDiff;

	// Create a new badge progress bar.
	const newProgressBar = new badgeProgress(
		badgeId,
		badgeNewPoints,
		badgeMaxPoints
	);
	newProgressBar.setAttribute( 'data-badge-id', badgeId );
	newProgressBar.setAttribute( 'data-points', badgeNewPoints );
	newProgressBar.setAttribute( 'data-max-points', badgeMaxPoints );

	// Replace the old badge progress bar with the new one.
	progressBar.replaceWith( newProgressBar );

	// Update the remaining points.
	const remainingPointsEl = document.querySelector(
		`.prpl-previous-month-badge-progress-bar-wrapper[data-badge-id="${ badgeId }"] .prpl-previous-month-badge-progress-bar-remaining`
	);

	if ( remainingPointsEl ) {
		remainingPointsEl.textContent = remainingPointsEl.textContent.replace(
			remainingPointsEl.getAttribute( 'data-remaining' ),
			badgeMaxPoints - badgeNewPoints
		);
		remainingPointsEl.setAttribute(
			'data-remaining',
			badgeMaxPoints - badgeNewPoints
		);
	}

	// Update the previous month badge points number.
	const badgePointsNumberEl = document.querySelector(
		`.prpl-previous-month-badge-progress-bar-wrapper[data-badge-id="${ badgeId }"] .prpl-widget-previous-ravi-points-number`
	);
	if ( badgePointsNumberEl ) {
		badgePointsNumberEl.textContent = badgeNewPoints + 'pt';
	}

	// If the previous month badge is completed, update badge elements.
	if ( badgeNewPoints >= parseInt( badgeMaxPoints ) ) {
		document
			.querySelectorAll(
				`.prpl-badge-row-wrapper-inner .prpl-badge prpl-badge[complete="false"][badge-id="${ badgeId }"]`
			)
			?.forEach( ( badge ) => {
				badge.setAttribute( 'complete', 'true' );
			} );

		// Remove the previous month badge progress bar.
		document
			.querySelector(
				`.prpl-previous-month-badge-progress-bar-wrapper[data-badge-id="${ badgeId }"]`
			)
			?.remove();

		// If there are no more progress bars, remove the previous month badge progress bar wrapper.
		if (
			! document.querySelector(
				'.prpl-previous-month-badge-progress-bar-wrapper'
			)
		) {
			document
				.querySelector(
					'.prpl-previous-month-badge-progress-bars-wrapper'
				)
				?.remove();
		}
	}
};
