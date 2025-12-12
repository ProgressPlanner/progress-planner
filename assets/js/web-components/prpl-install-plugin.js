/* global customElements, HTMLElement, prplL10n, prplSuggestedTask */
/*
 * Install Plugin
 *
 * A web component to install a plugin.
 *
 * Dependencies: progress-planner/l10n, progress-planner/ajax-request, progress-planner/suggested-task
 */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-install-plugin',
	class extends HTMLElement {
		constructor(
			pluginSlug,
			pluginName,
			action,
			providerId,
			className = 'prpl-button-link',
			completeTaskAttr = 'true' // String on purpose, since element attributes are always strings.
		) {
			// Get parent class properties
			super();

			this.pluginSlug =
				pluginSlug ?? this.getAttribute( 'data-plugin-slug' );
			this.pluginName =
				pluginName ?? this.getAttribute( 'data-plugin-name' );
			this.pluginName = this.pluginName ?? this.pluginSlug;
			this.action = action ?? this.getAttribute( 'data-action' );
			this.completeTaskAttr =
				completeTaskAttr ?? this.getAttribute( 'data-complete-task' );
			this.providerId =
				providerId ?? this.getAttribute( 'data-provider-id' );
			this.className = className ?? this.getAttribute( 'class' );
			// If the plugin slug is empty, bail out.
			if ( ! this.pluginSlug ) {
				return;
			}

			// Convert the string to a boolean.
			this.completeTaskAttr = 'true' === this.completeTaskAttr;

			// Set the inner HTML.
			this.innerHTML = `
				<button type="button" class="${ this.className }">
					${ prplL10n(
						'install' === this.action
							? 'installPlugin'
							: 'activatePlugin'
					).replace( '%s', this.pluginName ) }
				</button>
			`;

			// Handle the click event.
			this.handleClick();
		}

		/**
		 * Handle the click event.
		 */
		handleClick() {
			const button = this.querySelector( 'button' );
			if ( ! button ) {
				return;
			}

			button.addEventListener( 'click', () => {
				button.disabled = true;
				if ( 'install' === this.action ) {
					this.installPlugin();
				} else {
					this.activatePlugin();
				}
			} );
		}

		installPlugin() {
			const button = this.querySelector( 'button' );
			const thisObj = this;

			button.innerHTML = `
				<span class="prpl-install-button-loader"></span>
				${ prplL10n( 'installing' ) }
			`;

			const restRoot =
				( window.wpApiSettings && window.wpApiSettings.root ) ||
				'/wp-json/';
			const endpoint =
				restRoot.replace( /\/$/, '' ) +
				'/progress-planner/v1/plugins/install';

			fetch( endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.wpApiSettings?.nonce || '',
				},
				credentials: 'same-origin',
				body: JSON.stringify( {
					plugin_slug: this.pluginSlug,
				} ),
			} )
				.then( ( response ) => {
					if ( ! response.ok ) {
						return response.json().then( ( error ) => {
							throw new Error(
								error.message || 'Installation failed'
							);
						} );
					}
					return response.json();
				} )
				.then( () => thisObj.activatePlugin() )
				.catch( ( error ) => console.error( error ) );
		}

		activatePlugin() {
			const button = this.querySelector( 'button' );
			const thisObj = this;
			button.innerHTML = `
				<span class="prpl-install-button-loader"></span>
				${ prplL10n( 'activating' ) }
			`;

			const restRoot =
				( window.wpApiSettings && window.wpApiSettings.root ) ||
				'/wp-json/';
			const endpoint =
				restRoot.replace( /\/$/, '' ) +
				'/progress-planner/v1/plugins/activate';

			fetch( endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.wpApiSettings?.nonce || '',
				},
				credentials: 'same-origin',
				body: JSON.stringify( {
					plugin_slug: thisObj.pluginSlug,
				} ),
			} )
				.then( ( response ) => {
					if ( ! response.ok ) {
						return response.json().then( ( error ) => {
							throw new Error(
								error.message || 'Activation failed'
							);
						} );
					}
					return response.json();
				} )
				.then( () => {
					button.innerHTML = prplL10n( 'activated' );

					// Complete the task if the completeTask attribute is set to true.
					if ( true === thisObj.completeTaskAttr ) {
						thisObj.completeTask();
					}
				} )
				.catch( ( error ) => console.error( error ) );
		}

		/**
		 * Complete the task.
		 */
		completeTask() {
			const tasks = document.querySelectorAll(
				'#prpl-suggested-tasks-list .prpl-suggested-task'
			);
			const thisObj = this;

			tasks.forEach( ( taskElement ) => {
				if ( taskElement.dataset.taskId === thisObj.providerId ) {
					// Close popover.
					document
						.getElementById( 'prpl-popover-' + thisObj.providerId )
						.hidePopover();

					const postId = parseInt( taskElement.dataset.postId );

					if ( postId ) {
						prplSuggestedTask.maybeComplete( postId );
					}
				}
			} );
		}
	}
);
