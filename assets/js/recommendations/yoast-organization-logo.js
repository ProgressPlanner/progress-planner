/* global prplInteractiveTaskFormListener, prplYoastOrganizationLogo */
/**
 * Core Site Icon recommendation.
 *
 * Dependencies: progress-planner/recommendations/interactive-task, wp-api
 */
( function () {
	/**
	 * Core Site Icon class.
	 */
	class CoreSiteIcon {
		/**
		 * Constructor.
		 */
		constructor() {
			this.mediaUploader = null;
			this.elements = this.getElements();
			this.init();
		}

		/**
		 * Get all DOM elements.
		 *
		 * @return {Object} Object containing all DOM elements.
		 */
		getElements() {
			return {
				uploadButton: document.getElementById(
					'prpl-upload-organization-logo-button'
				),
				popover: document.getElementById(
					'prpl-popover-yoast-organization-logo'
				),
				hiddenField: document.getElementById(
					'prpl-yoast-organization-logo-id'
				),
				preview: document.getElementById( 'organization-logo-preview' ),
				submitButton: document.getElementById(
					'prpl-set-organization-logo-button'
				),
			};
		}

		/**
		 * Initialize the component.
		 */
		init() {
			if ( this.elements.uploadButton ) {
				this.bindEvents();
			}
			this.initFormListener();
		}

		/**
		 * Bind event listeners.
		 */
		bindEvents() {
			this.elements.uploadButton.addEventListener( 'click', ( e ) => {
				this.handleUploadButtonClick( e );
			} );
		}

		/**
		 * Handle upload button click.
		 *
		 * @param {Event} e The click event.
		 */
		handleUploadButtonClick( e ) {
			e.preventDefault();

			// If the uploader object has already been created, reopen the dialog.
			if ( this.mediaUploader ) {
				this.mediaUploader.open();
				return;
			}

			this.createMediaUploader();
			this.bindMediaUploaderEvents();
			this.mediaUploader.open();
		}

		/**
		 * Create the media uploader.
		 */
		createMediaUploader() {
			this.mediaUploader = wp.media.frames.file_frame = wp.media( {
				title:
					prplYoastOrganizationLogo?.mediaTitle || 'Choose Site Icon',
				button: {
					text:
						prplYoastOrganizationLogo?.mediaButtonText ||
						'Use as Site Icon',
				},
				multiple: false,
				library: {
					type: 'image',
				},
			} );
		}

		/**
		 * Bind media uploader events.
		 */
		bindMediaUploaderEvents() {
			// Hide popover when media library opens.
			this.mediaUploader.on( 'open', () => {
				if ( this.elements.popover ) {
					this.elements.popover.hidePopover();
				}
			} );

			// Show popover when media library closes.
			this.mediaUploader.on( 'close', () => {
				if ( this.elements.popover ) {
					this.elements.popover.showPopover();
				}
			} );

			// Handle image selection.
			this.mediaUploader.on( 'select', () => {
				this.handleImageSelection();
			} );
		}

		/**
		 * Handle image selection.
		 */
		handleImageSelection() {
			const attachment = this.mediaUploader
				.state()
				.get( 'selection' )
				.first()
				.toJSON();

			this.updateHiddenField( attachment );
			this.updatePreview( attachment );
			this.enableSubmitButton();
		}

		/**
		 * Update the hidden field with attachment ID.
		 *
		 * @param {Object} attachment The selected attachment.
		 */
		updateHiddenField( attachment ) {
			if ( this.elements.hiddenField ) {
				this.elements.hiddenField.value = attachment.id;
			}
		}

		/**
		 * Update the preview with the selected image.
		 *
		 * @param {Object} attachment The selected attachment.
		 */
		updatePreview( attachment ) {
			if ( ! this.elements.preview ) {
				return;
			}

			// Use thumbnail size if available, otherwise use full size.
			const imageUrl =
				attachment.sizes && attachment.sizes.thumbnail
					? attachment.sizes.thumbnail.url
					: attachment.url;

			this.elements.preview.innerHTML =
				'<img src="' +
				imageUrl +
				'" alt="' +
				( attachment.alt || 'Site icon preview' ) +
				'" style="max-width: 150px; height: auto; border-radius: 4px; border: 1px solid #ddd;">';
		}

		/**
		 * Enable the submit button.
		 */
		enableSubmitButton() {
			if ( this.elements.submitButton ) {
				this.elements.submitButton.disabled = false;
			}
		}

		/**
		 * Initialize the form listener.
		 */
		initFormListener() {
			prplInteractiveTaskFormListener.settings( {
				setting: 'wpseo_titles',
				settingPath:
					'company' === prplYoastOrganizationLogo.companyOrPerson
						? JSON.stringify( [ 'company_logo_id' ] )
						: JSON.stringify( [ 'person_logo_id' ] ),
				taskId: 'yoast-organization-logo',
				popoverId: 'prpl-popover-yoast-organization-logo',
				action: 'prpl_interactive_task_submit',
				settingCallbackValue: () => {
					const popover = document.getElementById(
						'prpl-popover-yoast-organization-logo'
					);

					if ( ! popover ) {
						return false;
					}

					const organizationLogoId = popover.querySelector(
						'input[name="prpl_yoast_organization_logo_id"]'
					).value;
					return parseInt( organizationLogoId, 10 );
				},
			} );
		}
	}

	// Initialize the component.
	new CoreSiteIcon();
} )();
