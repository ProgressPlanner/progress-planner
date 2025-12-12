/**
 * Install Plugin Button Component.
 *
 * Replaces the prpl-install-plugin web component.
 * Handles plugin installation and activation.
 *
 * @param {Object}  props              Component props.
 * @param {string}  props.pluginSlug   The plugin slug.
 * @param {string}  props.pluginName   The plugin name.
 * @param {string}  props.action       The action: 'install' or 'activate'.
 * @param {boolean} props.completeTask Whether to complete the task after activation.
 * @param {string}  props.providerId   The provider ID for task completion.
 * @param {string}  props.className    CSS class name for the button.
 * @return {JSX.Element} The install plugin button component.
 */

import { useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export default function InstallPluginButton( {
	pluginSlug,
	pluginName,
	action = 'install',
	completeTask = true,
	providerId,
	className = 'prpl-button-link',
} ) {
	const [ currentAction, setCurrentAction ] = useState( action );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ status, setStatus ] = useState( 'idle' ); // idle, installing, activating, activated

	/**
	 * Install plugin.
	 */
	const installPlugin = useCallback( async () => {
		setIsLoading( true );
		setStatus( 'installing' );

		try {
			const ajaxUrl =
				window.progressPlanner?.ajaxUrl ||
				window.prplSuggestedTasksConfig?.ajaxUrl ||
				'/wp-admin/admin-ajax.php';
			const nonce =
				window.progressPlanner?.nonce ||
				window.prplSuggestedTasksConfig?.nonce ||
				'';

			const response = await fetch( ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'progress_planner_install_plugin',
					plugin_slug: pluginSlug,
					plugin_name: pluginName,
					nonce,
				} ),
				credentials: 'same-origin',
			} );

			const data = await response.json();

			if ( data.success ) {
				// After installation, activate the plugin
				await activatePlugin();
			} else {
				throw new Error(
					data.data?.message ||
						__( 'Installation failed', 'progress-planner' )
				);
			}
		} catch ( err ) {
			console.error( 'Error installing plugin:', err ); // eslint-disable-line no-console
			setStatus( 'idle' );
			setIsLoading( false );
		}
	}, [ pluginSlug, pluginName, activatePlugin ] );

	/**
	 * Activate plugin.
	 */
	const activatePlugin = useCallback( async () => {
		setStatus( 'activating' );

		try {
			const ajaxUrl =
				window.progressPlanner?.ajaxUrl ||
				window.prplSuggestedTasksConfig?.ajaxUrl ||
				'/wp-admin/admin-ajax.php';
			const nonce =
				window.progressPlanner?.nonce ||
				window.prplSuggestedTasksConfig?.nonce ||
				'';

			const response = await fetch( ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams( {
					action: 'progress_planner_activate_plugin',
					plugin_slug: pluginSlug,
					plugin_name: pluginName,
					nonce,
				} ),
				credentials: 'same-origin',
			} );

			const data = await response.json();

			if ( data.success ) {
				setStatus( 'activated' );
				setCurrentAction( 'activated' );

				// Complete task if needed
				if ( completeTask && providerId ) {
					// Trigger task completion via hook
					// This will be handled by the parent component or PopoverManager
					if ( window.prplSuggestedTask?.maybeComplete ) {
						// Find the task element and complete it
						const taskElement = document.querySelector(
							`#prpl-suggested-tasks-list .prpl-suggested-task[data-task-id="${ providerId }"]`
						);
						if ( taskElement ) {
							const postId = parseInt(
								taskElement.dataset.postId
							);
							if ( postId ) {
								window.prplSuggestedTask.maybeComplete(
									postId
								);
							}
						}
					}
				}
			} else {
				throw new Error(
					data.data?.message ||
						__( 'Activation failed', 'progress-planner' )
				);
			}
		} catch ( err ) {
			console.error( 'Error activating plugin:', err ); // eslint-disable-line no-console
			setStatus( 'idle' );
		} finally {
			setIsLoading( false );
		}
	}, [ pluginSlug, pluginName, completeTask, providerId ] );

	/**
	 * Handle button click.
	 */
	const handleClick = useCallback( () => {
		if ( currentAction === 'install' ) {
			installPlugin();
		} else if ( currentAction === 'activate' ) {
			activatePlugin();
		}
	}, [ currentAction, installPlugin, activatePlugin ] );

	// Get button text based on status
	const getButtonText = () => {
		if ( status === 'activated' ) {
			return __( 'Activated', 'progress-planner' );
		}
		if ( status === 'activating' ) {
			return __( 'Activating…', 'progress-planner' );
		}
		if ( status === 'installing' ) {
			return __( 'Installing…', 'progress-planner' );
		}
		if ( currentAction === 'install' ) {
			return sprintf(
				// translators: %s is the plugin name.
				__( 'Install %s', 'progress-planner' ),
				pluginName
			);
		}
		return sprintf(
			// translators: %s is the plugin name.
			__( 'Activate %s', 'progress-planner' ),
			pluginName
		);
	};

	return (
		<button
			type="button"
			className={ className }
			onClick={ handleClick }
			disabled={ isLoading || status === 'activated' }
		>
			{ ( status === 'installing' || status === 'activating' ) && (
				<span className="prpl-install-button-loader">
					<span
						className="spinner"
						style={ { visibility: 'visible' } }
					></span>
				</span>
			) }
			{ getButtonText() }
		</button>
	);
}
