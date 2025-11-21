/**
 * Settings step - Configure About, Contact, and FAQ pages
 * Multi-step process with 3 sub-steps
 */
/* global OnboardingStep, ProgressPlannerOnboardData */

class PrplSettingsStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-settings',
		} );
		this.currentSubStep = 0;
		this.subSteps = [ 'about', 'contact', 'faq' ];
	}

	/**
	 * Mount the settings step
	 * Sets up event listeners for page select and save button
	 * @param {Object} state - Wizard state
	 * @return {Function} Cleanup function
	 */
	onMount( state ) {
		// Initialize state
		if ( ! state.data.settings ) {
			state.data.settings = {
				about: {
					hasPage: true, // true if checkbox is NOT checked (default: unchecked)
					pageId: null,
				},
				contact: {
					hasPage: true,
					pageId: null,
				},
				faq: {
					hasPage: true,
					pageId: null,
				},
			};
		}

		// Always start from first sub-step
		this.currentSubStep = 0;

		// Hide footer initially (will show on last sub-step)
		this.wizard.toggleFooter( false );

		// Render the current sub-step
		this.renderSubStep( state );

		// Return cleanup function
		return () => {
			// Show footer when leaving this step
			this.wizard.toggleFooter( true );
		};
	}

	/**
	 * Render the current sub-step
	 * @param {Object} state - Wizard state
	 */
	renderSubStep( state ) {
		const subStepName = this.subSteps[ this.currentSubStep ];
		const subStepData = state.data.settings[ subStepName ];

		// Update progress indicator
		const progressIndicator = this.popover.querySelector(
			'.prpl-settings-progress'
		);
		if ( progressIndicator ) {
			progressIndicator.textContent = `${ this.currentSubStep + 1 }/3`;
		}

		// Show/hide sub-step containers
		this.subSteps.forEach( ( step, index ) => {
			const container = this.popover.querySelector(
				`.prpl-setting-item[data-page="${ step }"]`
			);
			if ( container ) {
				container.style.display =
					index === this.currentSubStep ? 'flex' : 'none';
			}
		} );

		// Hide "Save setting" button on last sub-step (show Next/Dashboard instead)
		const isLastSubStep = this.currentSubStep === this.subSteps.length - 1;
		const saveButton = this.popover.querySelector(
			`#prpl-save-${ subStepName }-setting`
		);
		if ( saveButton ) {
			saveButton.style.display = isLastSubStep ? 'none' : '';
		}

		// Setup event listeners for current sub-step
		this.setupSubStepListeners( subStepName, subStepData, state );

		// Update Next/Dashboard button state if on last sub-step
		if ( isLastSubStep ) {
			this.wizard.updateNextButton();
		}
	}

	/**
	 * Setup event listeners for a sub-step
	 * @param {string} subStepName - Name of sub-step (about/contact/faq)
	 * @param {Object} subStepData - Data for this sub-step
	 * @param {Object} state       - Wizard state
	 */
	setupSubStepListeners( subStepName, subStepData, state ) {
		// Get select and checkbox
		const pageSelect = this.popover.querySelector(
			`select[name="pages[${ subStepName }][id]"]`
		);
		const noPageCheckbox = this.popover.querySelector(
			`#prpl-no-${ subStepName }-page`
		);

		// Get select wrapper
		const selectWrapper = this.popover.querySelector(
			`.prpl-setting-item[data-page="${ subStepName }"] .prpl-select-page`
		);

		// Get save button
		const saveButton = this.popover.querySelector(
			`#prpl-save-${ subStepName }-setting`
		);

		if ( ! pageSelect || ! noPageCheckbox || ! saveButton ) {
			return;
		}

		// Set initial states from saved data
		if ( subStepData.pageId ) {
			pageSelect.value = subStepData.pageId;
		}

		if ( ! subStepData.hasPage ) {
			noPageCheckbox.checked = true;
			if ( selectWrapper ) {
				selectWrapper.style.display = 'none';
			}
		}

		// Page select handler
		pageSelect.addEventListener( 'change', ( e ) => {
			subStepData.pageId = e.target.value;
			this.updateSaveButtonState( saveButton, subStepData );

			// Update Next/Dashboard button if on last sub-step
			if ( this.currentSubStep === this.subSteps.length - 1 ) {
				this.wizard.updateNextButton();
			}
		} );

		// Checkbox handler
		noPageCheckbox.addEventListener( 'change', ( e ) => {
			subStepData.hasPage = ! e.target.checked;

			// Hide/show select based on checkbox
			if ( e.target.checked ) {
				// Checkbox is checked - hide select
				if ( selectWrapper ) {
					selectWrapper.style.display = 'none';
				}
				pageSelect.value = ''; // Reset selection
				subStepData.pageId = null;
			} else {
				// Checkbox is unchecked - show select
				if ( selectWrapper ) {
					selectWrapper.style.display = 'block';
				}
			}

			this.updateSaveButtonState( saveButton, subStepData );

			// Update Next/Dashboard button if on last sub-step
			if ( this.currentSubStep === this.subSteps.length - 1 ) {
				this.wizard.updateNextButton();
			}
		} );

		// Save button handler - just advances to next sub-step
		saveButton.addEventListener( 'click', () => {
			this.advanceSubStep( state );
		} );

		// Initial button state
		this.updateSaveButtonState( saveButton, subStepData );
	}

	/**
	 * Advance to next sub-step
	 * @param {Object} state - Wizard state
	 */
	advanceSubStep( state ) {
		if ( this.currentSubStep < this.subSteps.length - 1 ) {
			this.currentSubStep++;
			this.renderSubStep( state );

			// Show footer if advancing to last sub-step
			if ( this.currentSubStep === this.subSteps.length - 1 ) {
				this.wizard.toggleFooter( true );
			}
		}
	}

	/**
	 * Update save button state
	 * @param {HTMLElement} button      - Save button element
	 * @param {Object}      subStepData - Sub-step data
	 */
	updateSaveButtonState( button, subStepData ) {
		const canSave = this.canSaveSubStep( subStepData );
		button.disabled = ! canSave;
	}

	/**
	 * Check if sub-step can be saved
	 * @param {Object} subStepData - Sub-step data
	 * @return {boolean} True if can save
	 */
	canSaveSubStep( subStepData ) {
		// If user has the page, they must select one
		if ( subStepData.hasPage && ! subStepData.pageId ) {
			return false;
		}

		// If checkbox is checked (don't have page), can save
		if ( ! subStepData.hasPage ) {
			return true;
		}

		// If page is selected, can save
		return !! subStepData.pageId;
	}

	/**
	 * User can proceed if on last sub-step and it's valid
	 * @param {Object} state - Wizard state
	 * @return {boolean} True if can proceed
	 */
	canProceed( state ) {
		if ( ! state.data.settings ) {
			return false;
		}

		// Can only proceed if on last sub-step
		if ( this.currentSubStep !== this.subSteps.length - 1 ) {
			return false;
		}

		// Check if all sub-steps have valid data
		return this.subSteps.every( ( step ) => {
			const subStepData = state.data.settings[ step ];
			return this.canSaveSubStep( subStepData );
		} );
	}

	/**
	 * Called before advancing to next step
	 * Saves all settings via AJAX
	 * @return {Promise} Resolves when settings are saved
	 */
	async beforeNextStep() {
		const state = this.getState();

		// Show spinner on Next/Dashboard button
		const nextBtn = this.wizard.nextBtn;
		const dashboardBtn = this.wizard.dashboardBtn;
		const activeBtn =
			nextBtn.style.display !== 'none' ? nextBtn : dashboardBtn;

		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>';

		activeBtn.parentElement.insertBefore( spinner, activeBtn );
		activeBtn.disabled = true;

		try {
			// Save all settings via AJAX
			for ( const subStepName of this.subSteps ) {
				const subStepData = state.data.settings[ subStepName ];

				const formData = {
					action: 'prpl_save_page_setting',
					nonce: ProgressPlannerOnboardData.nonceProgressPlanner,
					page_type: subStepName,
					have_page: subStepData.hasPage ? 'yes' : 'no',
					page_id: subStepData.pageId || '',
				};

				const response = await fetch(
					ProgressPlannerOnboardData.adminAjaxUrl,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams( formData ),
						credentials: 'same-origin',
					}
				);

				if ( ! response.ok ) {
					throw new Error( 'Request failed: ' + response.status );
				}

				const result = await response.json();

				if ( ! result.success ) {
					throw new Error(
						result.data?.message || 'Failed to save setting'
					);
				}

				console.log(
					`Successfully saved ${ subStepName } page setting`
				);
			}
		} catch ( error ) {
			console.error( 'Failed to save settings:', error );

			// Display error message
			this.showErrorMessage(
				error.message || 'Failed to save settings. Please try again.'
			);

			// Re-enable button
			activeBtn.disabled = false;

			// Don't proceed to next step
			throw error;
		} finally {
			spinner.remove();
		}
	}

	/**
	 * Show error message to user
	 * @param {string} message Error message to display
	 */
	showErrorMessage( message ) {
		// Remove existing error if any
		this.clearErrorMessage();

		// Create error message element
		const errorDiv = document.createElement( 'div' );
		errorDiv.className = 'prpl-error-message';
		errorDiv.innerHTML = `
			<div class="prpl-error-box">
				<span class="dashicons dashicons-warning"></span>
				<div>
					<h3>Error saving setting</h3>
					<p>${ this.escapeHtml( message ) }</p>
				</div>
			</div>
		`;

		// Insert error message before the footer
		const footer = this.wizard.popover.querySelector( '.tour-footer' );
		if ( footer ) {
			footer.parentElement.insertBefore( errorDiv, footer );
		}
	}

	/**
	 * Clear error message
	 */
	clearErrorMessage() {
		const existingError = this.wizard.popover.querySelector(
			'.prpl-error-message'
		);
		if ( existingError ) {
			existingError.remove();
		}
	}

	/**
	 * Escape HTML to prevent XSS
	 * @param {string} text Text to escape
	 * @return {string} Escaped text
	 */
	escapeHtml( text ) {
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}
}

window.PrplSettingsStep = new PrplSettingsStep();
