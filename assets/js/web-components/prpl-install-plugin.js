/* global customElements, HTMLElement, prplL10n, progressPlanner, progressPlannerAjaxRequest, prplSuggestedTask */
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
		constructor( pluginSlug, pluginName, action, providerId ) {
			// Get parent class properties
			super();

			pluginSlug = pluginSlug || this.getAttribute( 'data-plugin-slug' );
			pluginName = pluginName || this.getAttribute( 'data-plugin-name' );
			pluginName = pluginName || pluginSlug;
			action = action || this.getAttribute( 'data-action' );
			if ( ! pluginSlug ) {
				return;
			}

			this.innerHTML = `
				<button
					type="button"
					class="prpl-button prpl-button-primary"
					data-plugin-name="${ pluginName }"
					data-plugin-slug="${ pluginSlug }"
					data-action="${ action }"
					data-nonce="${ progressPlanner.nonce }"
					data-provider-id="${ providerId }"
					style="color: #fff;"
				>
					${
						'install' === action
							? prplL10n( 'installPlugin' ).replace(
									'%s',
									pluginName
							  )
							: prplL10n( 'activatePlugin' ).replace(
									'%s',
									pluginName
							  )
					}
				</button>
			`;

			this.handleClick();
		}

		handleClick() {
			const button = this.querySelector( 'button' );
			if ( ! button ) {
				return;
			}

			const action = button.getAttribute( 'data-action' );

			button.addEventListener( 'click', () => {
				button.disabled = true;
				if ( 'install' === action ) {
					this.installPlugin();
				} else {
					this.activatePlugin();
				}
			} );
		}

		installPlugin() {
			const button = this.querySelector( 'button' );
			const pluginName = button.getAttribute( 'data-plugin-name' );
			const pluginSlug = button.getAttribute( 'data-plugin-slug' );
			const nonce = button.getAttribute( 'data-nonce' );

			const thisObj = this;

			button.innerHTML = prplL10n( 'installing' );

			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'progress_planner_install_plugin',
					plugin_slug: pluginSlug,
					plugin_name: pluginName,
					nonce,
				},
			} )
				.then( () => {
					thisObj.activatePlugin();
				} )
				.catch( ( error ) => {
					console.error( error );
				} );
		}

		activatePlugin() {
			const button = this.querySelector( 'button' );
			const pluginName = button.getAttribute( 'data-plugin-name' );
			const pluginSlug = button.getAttribute( 'data-plugin-slug' );
			const nonce = button.getAttribute( 'data-nonce' );
			const thisObj = this;
			button.innerHTML = prplL10n( 'activating' );

			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'progress_planner_activate_plugin',
					plugin_slug: pluginSlug,
					plugin_name: pluginName,
					nonce,
				},
			} )
				.then( () => {
					button.innerHTML = prplL10n( 'activated' );
					thisObj.completeTask();
				} )
				.catch( ( error ) => {
					console.error( error );
				} );
		}

		/**
		 * Complete the task.
		 */
		completeTask() {
			const providerId = this.getAttribute( 'data-provider-id' );
			const tasks = document.querySelectorAll(
				'#prpl-suggested-tasks-list .prpl-suggested-task'
			);

			tasks.forEach( ( taskElement ) => {
				if ( taskElement.dataset.taskId === providerId ) {
					// Close popover.
					document
						.getElementById( 'prpl-popover-' + providerId )
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
