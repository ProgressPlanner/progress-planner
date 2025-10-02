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

		// Gauge max points.
		this.totalMaxPoints = parseInt( this.gauge.getAttribute( 'data-max' ) );

		// Add progress bars max points.
		this.totalMaxPoints += this.progressBars.reduce(
			( acc, bar ) =>
				acc + parseInt( bar.getAttribute( 'data-max-points' ) ),
			0
		);

		console.log( this.totalMaxPoints );

		this.addListeners();
	}

	addListeners() {
		// Update the main gauge points counter.
		document.addEventListener( 'prpl-gauge-update', ( event ) => {
			if (
				'prpl-gauge-ravi' !== event.detail.element.getAttribute( 'id' )
			) {
				return;
			}

			// Update the points counter.
			const oldCounter = document.getElementById(
				'prpl-widget-content-ravi-points-number'
			);

			if ( oldCounter ) {
				oldCounter.textContent = parseInt( event.detail.value ) + 'pt';
			}

			// Mark badge as (not)completed, in the a Monthly badges widgets, if we reached the max points.
			this.maybeUpdateBadgeCompletedStatus(
				event.detail.badgeId,
				event.detail.value,
				event.detail.max
			);

			// Update remaining points for all progress bars
			this.updateRemainingPoints();
		} );

		// Update the progress bars points counters.
		document.addEventListener(
			'prlp-badge-progress-bar-update',
			( event ) => {
				if ( 'prpl-badge-progress-bar' !== event.detail.elementId ) {
					// return;
				}

				console.log( event.detail );

				// Update the remaining points.
				const remainingPointsEl = event.detail.element;

				const remainingPointsElWrapper = remainingPointsEl.closest(
					'.prpl-previous-month-badge-progress-bar-wrapper'
				);

				if ( remainingPointsElWrapper ) {
					// Update the badge points number.
					const badgePointsNumberEl =
						remainingPointsElWrapper.querySelector(
							'.prpl-widget-previous-ravi-points-number'
						);

					if ( badgePointsNumberEl ) {
						badgePointsNumberEl.textContent =
							event.detail.points + 'pt';
					}

					// Mark badge as (not)completed, in the a Monthly badges widgets, if we reached the max points.
					this.maybeUpdateBadgeCompletedStatus(
						event.detail.badgeId,
						event.detail.points,
						event.detail.maxPoints
					);

					// Update remaining points for all progress bars
					this.updateRemainingPoints();
				}
			}
		);
	}

	/**
	 * Update the remaining points display for all progress bars
	 * based on current gauge and progress bar values
	 */
	updateRemainingPoints() {
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
					console.log( this._barMaxPoints( this.progressBars[ j ] ) );
					console.log( this._barValue( this.progressBars[ j ] ) );
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

	maybeUpdateBadgeCompletedStatus( badgeId, value, max ) {
		if ( ! badgeId ) {
			return;
		}

		// See if the badge is completed or not, this is used as attribute value.
		const badgeCompleted = value >= parseInt( max ) ? 'true' : 'false';

		// If the badge was completed we need to select all badges with the same badge-id which are marked as not completed.
		// And vice versa.
		const badgeSelector = `prpl-badge[complete="${
			badgeCompleted ? 'false' : 'true'
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

	get gaugeValue() {
		return parseFloat( this.gauge.getAttribute( 'data-value' ) ) || 0;
	}
	set gaugeValue( v ) {
		v = Math.max( 0, Math.min( v, this.gaugeMax ) );
		this.gauge.setAttribute( 'data-value', v );
	}

	get gaugeMax() {
		return parseFloat( this.gauge.getAttribute( 'data-max' ) ) || 10;
	}

	_barValue( bar ) {
		return parseFloat( bar.getAttribute( 'data-points' ) ) || 0;
	}
	_setBarValue( bar, v ) {
		const max = parseFloat( bar.getAttribute( 'data-max-points' ) ) || 10;
		v = Math.max( 0, Math.min( v, max ) );
		bar.setAttribute( 'data-points', v );
	}

	_barMaxPoints( bar ) {
		return parseFloat( bar.getAttribute( 'data-max-points' ) ) || 10;
	}

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
			const barSpace =
				parseFloat( bar.getAttribute( 'data-max-points' ) ) -
				this._barValue( bar );

			const toBar = Math.min( remaining, barSpace );

			this._setBarValue( bar, this._barValue( bar ) + toBar );
			remaining -= toBar;
		}
	}

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
