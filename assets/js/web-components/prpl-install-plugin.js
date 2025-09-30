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
		constructor(
			pluginSlug,
			pluginName,
			action,
			providerId,
			className = 'prpl-button-link'
		) {
			// Get parent class properties
			super();

			this.pluginSlug =
				pluginSlug ?? this.getAttribute( 'data-plugin-slug' );
			this.pluginName =
				pluginName ?? this.getAttribute( 'data-plugin-name' );
			this.pluginName = this.pluginName ?? this.pluginSlug;
			this.action = action ?? this.getAttribute( 'data-action' );
			this.providerId =
				providerId ?? this.getAttribute( 'data-provider-id' );
			this.className = className ?? this.getAttribute( 'class' );
			// If the plugin slug is empty, bail out.
			if ( ! this.pluginSlug ) {
				return;
			}

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

			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'progress_planner_install_plugin',
					plugin_slug: this.pluginSlug,
					plugin_name: this.pluginName,
					nonce: progressPlanner.nonce,
				},
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

			progressPlannerAjaxRequest( {
				url: progressPlanner.ajaxUrl,
				data: {
					action: 'progress_planner_activate_plugin',
					plugin_slug: thisObj.pluginSlug,
					plugin_name: thisObj.pluginName,
					nonce: progressPlanner.nonce,
				},
			} )
				.then( () => {
					button.innerHTML = prplL10n( 'activated' );
					thisObj.completeTask();
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
