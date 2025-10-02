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

			// Mark badge as completed, in the a Monthly badges widgets, if we reached the max points.
			if (
				event.detail.badgeId &&
				event.detail.value >= parseInt( event.detail.max )
			) {
				// We have multiple badges, one in widget and the other in the popover.
				document
					.querySelectorAll(
						`.prpl-badge-row-wrapper .prpl-badge prpl-badge[complete="false"][badge-id="${ event.detail.badgeId }"]`
					)
					?.forEach( ( badge ) => {
						badge.setAttribute( 'complete', 'true' );
					} );
			}

			// TODO: Update the points in the remaining points element.
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
					// remainingPointsEl.setAttribute(
					// 	'data-remaining',
					// 	event.detail.maxPoints - event.detail.points
					// );

					// Update the badge points number.
					const badgePointsNumberEl =
						remainingPointsElWrapper.querySelector(
							'.prpl-widget-previous-ravi-points-number'
						);

					if ( badgePointsNumberEl ) {
						badgePointsNumberEl.textContent =
							event.detail.points + 'pt';
					}

					// Update the points in the remaining points element.
					for ( let i = 0; i < this.progressBars.length; i++ ) {
						console.log( i * 10 + event.detail.points );
						this._setBarValue(
							this.progressBars[ i ],
							i * 10 +
								( event.detail.maxPoints - event.detail.points )
						);
					}
				}
			}
		);
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
