/*
 * Web Component: prpl-guage-progress-controller
 *
 * A web component that controls the progress of a gauge and its progress bars.
 *
 * Dependencies: progress-planner/web-components/prpl-gauge, progress-planner/web-components/prpl-badge-progress-bar
 */

// eslint-disable-next-line no-unused-vars
class PrplGaugeProgressController {
	constructor( gauge, ...progressBars ) {
		this.gauge = gauge;
		this.progressBars = progressBars; // array, can be empty.

		this.addListeners();
	}

	/**
	 * Add listeners to the gauge and progress bars.
	 */
	addListeners() {
		// Monthy badge gauge updated.
		// Update the gauge and bars side elements (elements there are not part of the component), for example: the points counter.
		document.addEventListener( 'prpl-gauge-update', ( event ) => {
			if (
				'prpl-gauge-ravi' !== event.detail.element.getAttribute( 'id' )
			) {
				return;
			}

			// Update the monthly badge gauge points counter.
			this.updateGaugePointsCounter( event.detail.value );

			// Mark badge as (not)completed, in the a Monthly badges widgets (both on page and in the popover), if we reached the max points.
			this.maybeUpdateBadgeCompletedStatus(
				event.detail.badgeId,
				event.detail.value,
				event.detail.max
			);

			// Update remaining points side elements for all progress bars, for example: "20 more points to go" text.
			this.updateBarsRemainingPoints();
		} );

		// Progress bar for the previous month badge updated.
		// Updates the gauge and bars side elements (elements there are not part of the component), for example: "20 more points to go" text.
		document.addEventListener(
			'prlp-badge-progress-bar-update',
			( event ) => {
				// Update the remaining points.
				const remainingPointsEl = event.detail.element;

				const remainingPointsElWrapper = remainingPointsEl.closest(
					'.prpl-previous-month-badge-progress-bar-wrapper'
				);

				if ( remainingPointsElWrapper ) {
					// Update the progress bars points number.
					const badgePointsNumberEl =
						remainingPointsElWrapper.querySelector(
							'.prpl-widget-previous-ravi-points-number'
						);

					if ( badgePointsNumberEl ) {
						badgePointsNumberEl.textContent =
							event.detail.points + 'pt';
					}

					// Mark badge as (not)completed, in the a Monthly badges widgets (both on page and in the popover), if we reached the max points.
					this.maybeUpdateBadgeCompletedStatus(
						event.detail.badgeId,
						event.detail.points,
						event.detail.maxPoints
					);

					// Update remaining points text for all progress bars, for example: "20 more points to go".
					this.updateBarsRemainingPoints();

					// Maybe remove the completed progress bar.
					this.maybeRemoveCompletedBarFromDom(
						event.detail.badgeId,
						event.detail.points,
						event.detail.maxPoints
					);
				}
			}
		);
	}

	/**
	 * Update the monthly badge gauge points counter.
	 *
	 * @param {number} value The value.
	 */
	updateGaugePointsCounter( value ) {
		// Update the points counter.
		const pointsCounter = document.getElementById(
			'prpl-widget-content-ravi-points-number'
		);

		if ( pointsCounter ) {
			pointsCounter.textContent = parseInt( value ) + 'pt';
		}
	}

	/**
	 * Update the remaining points display for all progress bars based on current gauge and progress bar values.
	 * For example: "11 more points to go" text.
	 */
	updateBarsRemainingPoints() {
		const currentGaugeValue = this.gaugeValue;

		for ( let i = 0; i < this.progressBars.length; i++ ) {
			const bar = this.progressBars[ i ];

			// Calculate remaining points for this bar
			let remainingPoints = 0;
			if ( currentGaugeValue < this.gaugeMax ) {
				// Calculate the threshold for this progress bar
				// First bar starts at gauge max (10), second at gauge max + first bar max (20), etc.
				const barThreshold =
					this.gaugeMax + ( i + 1 ) * this._barMaxPoints( bar );

				// Gauge is not full yet, show points needed to reach this bar
				remainingPoints = barThreshold - currentGaugeValue;
			} else {
				// Gauge is full, show remaining points in this specific bar
				for ( let j = 0; j <= i; j++ ) {
					remainingPoints +=
						this._barMaxPoints( this.progressBars[ j ] ) -
						this._barValue( this.progressBars[ j ] );
				}
			}

			// Ensure remaining points is never negative
			remainingPoints = Math.max( 0, remainingPoints );

			// Update the display
			const parentWrapper = bar.closest(
				'.prpl-previous-month-badge-progress-bar-wrapper'
			);

			if ( parentWrapper ) {
				const numberEl = parentWrapper.querySelector( '.number' );
				if ( numberEl ) {
					numberEl.textContent = remainingPoints;
				}
			}
		}
	}

	/**
	 * Maybe update the badge completed status.
	 * This sets the complete attribute on the badge element and toggles visibility of the ! icon.
	 *
	 * @param {string} badgeId The badge id.
	 * @param {number} value   The value.
	 * @param {number} max     The max.
	 */
	maybeUpdateBadgeCompletedStatus( badgeId, value, max ) {
		if ( ! badgeId ) {
			return;
		}

		// See if the badge is completed or not, this is used as attribute value.
		const badgeCompleted =
			parseInt( value ) >= parseInt( max ) ? 'true' : 'false';

		// If the badge was completed we need to select all badges with the same badge-id which are marked as not completed.
		// And vice versa.
		const badgeSelector = `prpl-badge[complete="${
			'true' === badgeCompleted ? 'false' : 'true'
		}"][badge-id="${ badgeId }"]`;

		// We have multiple badges, one in widget and the other in the popover.
		document
			.querySelectorAll(
				`.prpl-badge-row-wrapper .prpl-badge ${ badgeSelector }`
			)
			?.forEach( ( badge ) => {
				badge.setAttribute( 'complete', badgeCompleted );
			} );
	}

	/**
	 * Maybe remove the completed bar.
	 *
	 * @param {string} badgeId The badge id.
	 * @param {number} value   The value.
	 * @param {number} max     The max.
	 */
	maybeRemoveCompletedBarFromDom( badgeId, value, max ) {
		if ( ! badgeId ) {
		}

		// If the previous month badge is completed, remove the progress bar.
		if ( value >= parseInt( max ) ) {
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
	}

	/**
	 * Get the gauge value.
	 */
	get gaugeValue() {
		return parseInt( this.gauge.value ) || 0;
	}

	/**
	 * Set the gauge value.
	 *
	 * @param {number} v The value.
	 */
	set gaugeValue( v ) {
		this.gauge.value = v;
	}

	/**
	 * Get the gauge max.
	 */
	get gaugeMax() {
		return parseInt( this.gauge.max ) || 10;
	}

	/**
	 * Get the bar value.
	 *
	 * @param {number} bar The bar.
	 * @return {number} The value.
	 */
	_barValue( bar ) {
		return parseInt( bar.points ) || 0;
	}

	/**
	 * Set the bar value.
	 *
	 * @param {number} bar The bar.
	 * @param {number} v   The value.
	 */
	_setBarValue( bar, v ) {
		bar.points = v;
	}

	/**
	 * Get the bar max points.
	 *
	 * @param {number} bar The bar.
	 * @return {number} The max points.
	 */
	_barMaxPoints( bar ) {
		return parseInt( bar.maxPoints ) || 10;
	}

	/**
	 * Increase the gauge and progress bars.
	 * This method is used to sync the gauge and progress bars.
	 *
	 * @param {number} amount The amount.
	 */
	increase( amount = 1 ) {
		let remaining = amount;

		// Fill gauge first
		const gaugeSpace = this.gaugeMax - this.gaugeValue;
		const toGauge = Math.min( remaining, gaugeSpace );
		this.gaugeValue += toGauge;
		remaining -= toGauge;

		// Fill progress bars in order
		for ( const bar of this.progressBars ) {
			if ( remaining <= 0 ) break;
			const barSpace = parseInt( bar.maxPoints ) - this._barValue( bar );

			const toBar = Math.min( remaining, barSpace );

			this._setBarValue( bar, this._barValue( bar ) + toBar );
			remaining -= toBar;
		}
	}

	/**
	 * Decrease the gauge and progress bars.
	 * This method is used to sync the gauge and progress bars.
	 *
	 * @param {number} amount The amount.
	 */
	decrease( amount = 1 ) {
		// Convert negative amount to positive.
		if ( 0 > amount ) {
			amount = -amount;
		}

		let remaining = amount;

		// Decrease progress bars first, in reverse order
		for ( let i = this.progressBars.length - 1; i >= 0; i-- ) {
			if ( remaining <= 0 ) break;
			const bar = this.progressBars[ i ];
			const barVal = this._barValue( bar );
			const fromBar = Math.min( remaining, barVal );
			this._setBarValue( bar, barVal - fromBar );
			remaining -= fromBar;
		}

		// Decrease gauge last
		if ( remaining > 0 ) {
			this.gaugeValue -= remaining;
		}
	}
}
