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
import apiFetch from '@wordpress/api-fetch';
import './InstallPluginButton.css';

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
			await apiFetch( {
				path: '/progress-planner/v1/plugins/install',
				method: 'POST',
				data: {
					plugin_slug: pluginSlug,
				},
			} );

			// After installation, activate the plugin
			await activatePlugin();
		} catch ( err ) {
			console.error( 'Error installing plugin:', err ); // eslint-disable-line no-console
			setStatus( 'idle' );
			setIsLoading( false );
		}
	}, [ pluginSlug, activatePlugin ] );

	/**
	 * Activate plugin.
	 */
	const activatePlugin = useCallback( async () => {
		setStatus( 'activating' );

		try {
			await apiFetch( {
				path: '/progress-planner/v1/plugins/activate',
				method: 'POST',
				data: {
					plugin_slug: pluginSlug,
				},
			} );

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
						const postId = parseInt( taskElement.dataset.postId );
						if ( postId ) {
							window.prplSuggestedTask.maybeComplete( postId );
						}
					}
				}
			}
		} catch ( err ) {
			console.error( 'Error activating plugin:', err ); // eslint-disable-line no-console
			setStatus( 'idle' );
		} finally {
			setIsLoading( false );
		}
	}, [ pluginSlug, completeTask, providerId ] );

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
