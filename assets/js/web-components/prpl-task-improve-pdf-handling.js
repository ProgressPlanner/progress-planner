/* global customElements, PrplInteractiveTask */
/*
 * Web Component: prpl-email-test-popup
 *
 * A web component that displays a gauge.
 *
 * Dependencies: progress-planner/web-components/prpl-interactive-task, progress-planner/web-components/prpl-install-plugin
 */
/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-improve-pdf-handling-popup',
	class extends PrplInteractiveTask {
		// eslint-disable-next-line no-useless-constructor
		constructor() {
			// Get parent class properties
			super();

			// First step.
			this.firstStep = this.querySelector(
				'#prpl-improve-pdf-handling-first-step'
			);
		}

		/**
		 * Runs when the popover is added to the DOM.
		 */
		popoverAddedToDOM() {
			super.popoverAddedToDOM();
		}

		/**
		 * Hide all steps.
		 */
		hideAllSteps() {
			this.querySelectorAll( '.prpl-task-step' ).forEach( ( step ) => {
				step.style.display = 'none';
			} );
		}

		/**
		 * Show the form (first step).
		 */
		showFirstStep() {
			this.hideAllSteps();

			this.firstStep.style.display = 'flex';
		}

		/**
		 * Show the PDF XML Sitemap step.
		 */
		showPdfXmlSitemapStep() {
			this.hideAllSteps();

			this.querySelector(
				'#prpl-improve-pdf-handling-pdf-xml-sitemap-step'
			).style.display = 'flex';
		}

		/**
		 * Show final success message.
		 */
		showSuccess() {
			this.hideAllSteps();

			this.querySelector(
				'#prpl-improve-pdf-handling-success-step'
			).style.display = 'flex';
		}

		/**
		 * Popover closing, reset the layout, values, etc.
		 */
		popoverClosing() {
			// Hide all steps and show the first step.
			this.showFirstStep();
		}
	}
);
