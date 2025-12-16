/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 * Prevents a single widget crash from breaking the entire dashboard.
 *
 * Note: Error boundaries must be class components as React doesn't provide
 * hook equivalents for componentDidCatch and getDerivedStateFromError.
 */

import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Style constants for error display.
 */
const STYLES = {
	container: {
		padding: 'var(--prpl-padding, 1rem)',
		backgroundColor: 'var(--prpl-background-error, #fef2f2)',
		borderRadius: 'var(--prpl-border-radius, 8px)',
		border: '1px solid var(--prpl-color-error, #ef4444)',
	},
	heading: {
		margin: '0 0 0.5rem 0',
		fontSize: 'var(--prpl-font-size-medium, 1rem)',
		color: 'var(--prpl-color-error, #ef4444)',
	},
	message: {
		margin: 0,
		fontSize: 'var(--prpl-font-size-small, 0.875rem)',
		color: 'var(--prpl-color-text-secondary, #6b7280)',
	},
	button: {
		marginTop: '0.75rem',
		padding: '0.5rem 1rem',
		backgroundColor: 'var(--prpl-color-primary, #3b82f6)',
		color: 'white',
		border: 'none',
		borderRadius: 'var(--prpl-border-radius-small, 4px)',
		cursor: 'pointer',
		fontSize: 'var(--prpl-font-size-small, 0.875rem)',
	},
};

/**
 * ErrorBoundary class component.
 */
export default class ErrorBoundary extends Component {
	/**
	 * Constructor.
	 *
	 * @param {Object} props - Component props.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	/**
	 * Update state when an error is caught.
	 *
	 * @param {Error} error - The error that was thrown.
	 * @return {Object} New state.
	 */
	static getDerivedStateFromError( error ) {
		return { hasError: true, error };
	}

	/**
	 * Log error information for debugging.
	 *
	 * @param {Error}  error     - The error that was thrown.
	 * @param {Object} errorInfo - Component stack information.
	 */
	componentDidCatch( error, errorInfo ) {
		// Log error for debugging
		console.error( 'ErrorBoundary caught an error:', error, errorInfo );

		this.setState( { errorInfo } );

		// If an onError callback was provided, call it
		if ( this.props.onError ) {
			this.props.onError( error, errorInfo );
		}
	}

	/**
	 * Reset error state to retry rendering.
	 */
	handleRetry = () => {
		this.setState( {
			hasError: false,
			error: null,
			errorInfo: null,
		} );
	};

	/**
	 * Render the component.
	 *
	 * @return {JSX.Element} The component.
	 */
	render() {
		const { hasError } = this.state;
		const { children, fallback } = this.props;

		if ( hasError ) {
			// If a custom fallback was provided, use it
			if ( fallback ) {
				return fallback;
			}

			// Default error UI
			return (
				<div style={ STYLES.container }>
					<h4 style={ STYLES.heading }>
						{ __( 'Something went wrong', 'progress-planner' ) }
					</h4>
					<p style={ STYLES.message }>
						{ __(
							'This widget failed to load. Try refreshing the page.',
							'progress-planner'
						) }
					</p>
					<button
						type="button"
						style={ STYLES.button }
						onClick={ this.handleRetry }
					>
						{ __( 'Retry', 'progress-planner' ) }
					</button>
				</div>
			);
		}

		return children;
	}
}
