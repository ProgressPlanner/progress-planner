/**
 * Settings step - Configure About, Contact, FAQ pages, Post Types, and Login Destination
 * Multi-step process with 5 sub-steps
 */
/* global OnboardingStep, ProgressPlannerOnboardData */

class PrplSettingsStep extends OnboardingStep {
	constructor() {
		super( {
			templateId: 'onboarding-step-settings',
		} );
		this.currentSubStep = 0;
		this.subSteps = [
			'about',
			'contact',
			'faq',
			'post-types',
			'login-destination',
		];
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
				'post-types': {
					selectedTypes: [], // Array of selected post type slugs
				},
				'login-destination': {
					redirectOnLogin: false, // Checkbox state
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
			progressIndicator.textContent = `${ this.currentSubStep + 1 }/${
				this.subSteps.length
			}`;
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
	 * @param {string} subStepName - Name of sub-step (about/contact/faq/post-types/login-destination)
	 * @param {Object} subStepData - Data for this sub-step
	 * @param {Object} state       - Wizard state
	 */
	setupSubStepListeners( subStepName, subStepData, state ) {
		// Handle page selection sub-steps (about, contact, faq)
		if ( [ 'about', 'contact', 'faq' ].includes( subStepName ) ) {
			this.setupPageSelectListeners( subStepName, subStepData, state );
			return;
		}

		// Handle post types sub-step
		if ( subStepName === 'post-types' ) {
			this.setupPostTypesListeners( subStepName, subStepData, state );
			return;
		}

		// Handle login destination sub-step
		if ( subStepName === 'login-destination' ) {
			this.setupLoginDestinationListeners(
				subStepName,
				subStepData,
				state
			);
		}
	}

	/**
	 * Setup event listeners for page select sub-steps (about, contact, faq)
	 * @param {string} subStepName - Name of sub-step
	 * @param {Object} subStepData - Data for this sub-step
	 * @param {Object} state       - Wizard state
	 */
	setupPageSelectListeners( subStepName, subStepData, state ) {
		// Get select and checkbox
		const pageSelect = this.popover.querySelector(
			`select[name="pages[${ subStepName }][id]"]`
		);
		const noPageCheckbox = this.popover.querySelector(
			`#prpl-no-${ subStepName }-page`
		);

		// Get save button
		const saveButton = this.popover.querySelector(
			`#prpl-save-${ subStepName }-setting`
		);

		if ( ! pageSelect || ! noPageCheckbox || ! saveButton ) {
			return;
		}

		// Get select wrapper
		const selectWrapper = this.popover.querySelector(
			`.prpl-setting-item[data-page="${ subStepName }"] .prpl-select-page`
		);

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
			} else if ( selectWrapper ) {
				// Checkbox is unchecked - show select
				selectWrapper.style.display = 'block';
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
	 * Setup event listeners for post types sub-step
	 * @param {string} subStepName - Name of sub-step
	 * @param {Object} subStepData - Data for this sub-step
	 * @param {Object} state       - Wizard state
	 */
	setupPostTypesListeners( subStepName, subStepData, state ) {
		const container = this.popover.querySelector(
			`.prpl-setting-item[data-page="${ subStepName }"]`
		);
		const saveButton = this.popover.querySelector(
			`#prpl-save-${ subStepName }-setting`
		);

		if ( ! container || ! saveButton ) {
			return;
		}

		// Get all checkboxes
		const checkboxes = container.querySelectorAll(
			'input[type="checkbox"][name="prpl-post-types-include[]"]'
		);

		// Initialize selected types from checkboxes that are already checked (from template)
		// or from saved data if available
		if (
			subStepData.selectedTypes &&
			subStepData.selectedTypes.length > 0
		) {
			// Use saved data if available
			checkboxes.forEach( ( checkbox ) => {
				checkbox.checked = subStepData.selectedTypes.includes(
					checkbox.value
				);
			} );
		} else {
			// Initialize from checkboxes that are already checked in the template
			subStepData.selectedTypes = Array.from( checkboxes )
				.filter( ( cb ) => cb.checked )
				.map( ( cb ) => cb.value );

			// If no checkboxes are checked, default to all checked
			if ( subStepData.selectedTypes.length === 0 ) {
				checkboxes.forEach( ( checkbox ) => {
					checkbox.checked = true;
					subStepData.selectedTypes.push( checkbox.value );
				} );
			}
		}

		// Add change listeners to checkboxes
		checkboxes.forEach( ( checkbox ) => {
			checkbox.addEventListener( 'change', () => {
				// Update selected types array
				subStepData.selectedTypes = Array.from( checkboxes )
					.filter( ( cb ) => cb.checked )
					.map( ( cb ) => cb.value );

				this.updateSaveButtonState( saveButton, subStepData );

				// Update Next/Dashboard button if on last sub-step
				if ( this.currentSubStep === this.subSteps.length - 1 ) {
					this.wizard.updateNextButton();
				}
			} );
		} );

		// Save button handler - just advances to next sub-step
		saveButton.addEventListener( 'click', () => {
			this.advanceSubStep( state );
		} );

		// Initial button state
		this.updateSaveButtonState( saveButton, subStepData );
	}

	/**
	 * Setup event listeners for login destination sub-step
	 * @param {string} subStepName - Name of sub-step
	 * @param {Object} subStepData - Data for this sub-step
	 * @param {Object} state       - Wizard state
	 */
	setupLoginDestinationListeners( subStepName, subStepData, state ) {
		const container = this.popover.querySelector(
			`.prpl-setting-item[data-page="${ subStepName }"]`
		);
		const saveButton = this.popover.querySelector(
			`#prpl-save-${ subStepName }-setting`
		);

		if ( ! container || ! saveButton ) {
			return;
		}

		// Get checkbox
		const checkbox = container.querySelector(
			'input[type="checkbox"][name="prpl-redirect-on-login"]'
		);

		if ( ! checkbox ) {
			return;
		}

		// Initialize from checkbox that is already set in template, or from saved data
		if ( subStepData.redirectOnLogin === undefined ) {
			subStepData.redirectOnLogin = checkbox.checked;
		} else {
			checkbox.checked = subStepData.redirectOnLogin;
		}

		// Add change listener
		checkbox.addEventListener( 'change', ( e ) => {
			subStepData.redirectOnLogin = e.target.checked;
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
		// Handle page selection sub-steps (about, contact, faq)
		if ( subStepData.hasPage !== undefined ) {
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

		// Handle post types sub-step - at least one must be selected
		if ( subStepData.selectedTypes !== undefined ) {
			return subStepData.selectedTypes.length > 0;
		}

		// Handle login destination sub-step - always valid (checkbox is optional)
		if ( subStepData.redirectOnLogin !== undefined ) {
			return true;
		}

		return false;
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
			// Collect all settings data for a single AJAX request
			const formDataObj = new FormData();
			formDataObj.append( 'action', 'prpl_save_all_onboarding_settings' );
			formDataObj.append(
				'nonce',
				ProgressPlannerOnboardData.nonceProgressPlanner
			);

			// Collect page settings (about, contact, faq)
			const pages = {};
			for ( const subStepName of this.subSteps ) {
				const subStepData = state.data.settings[ subStepName ];

				if ( [ 'about', 'contact', 'faq' ].includes( subStepName ) ) {
					pages[ subStepName ] = {
						id: subStepData.pageId || '',
						have_page: subStepData.hasPage ? 'yes' : 'no',
					};
				}
			}

			// Add pages data as JSON
			if ( Object.keys( pages ).length > 0 ) {
				formDataObj.append( 'pages', JSON.stringify( pages ) );
			}

			// Add post types
			const postTypesData = state.data.settings[ 'post-types' ];
			if ( postTypesData && postTypesData.selectedTypes ) {
				postTypesData.selectedTypes.forEach( ( postType ) => {
					formDataObj.append( 'prpl-post-types-include[]', postType );
				} );
			}

			// Add login destination
			const loginData = state.data.settings[ 'login-destination' ];
			if ( loginData && loginData.redirectOnLogin ) {
				formDataObj.append( 'prpl-redirect-on-login', '1' );
			}

			// Send single AJAX request
			const response = await fetch(
				ProgressPlannerOnboardData.adminAjaxUrl,
				{
					method: 'POST',
					body: formDataObj,
					credentials: 'same-origin',
				}
			);

			if ( ! response.ok ) {
				throw new Error( 'Request failed: ' + response.status );
			}

			const result = await response.json();

			if ( ! result.success ) {
				throw new Error(
					result.data?.message || 'Failed to save settings'
				);
			}

			console.log( 'Successfully saved all onboarding settings' );
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
