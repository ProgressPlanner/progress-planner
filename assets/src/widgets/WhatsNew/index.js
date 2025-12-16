/**
 * What's New Widget Component.
 *
 * Displays blog posts from the Progress Planner blog RSS feed.
 */

import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { useApiData } from '../../hooks/useApiData';
import { LoadingState } from '../../components/WidgetStates';
import WidgetHeader from '../../components/WidgetHeader';

/**
 * What's New widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element|null} The widget component or null if no posts.
 */
function WhatsNew( { config = {} } ) {
	const { isLoading, data } = useApiData(
		'/progress-planner/v1/widgets/whats-new'
	);

	// Get title - will come from widget registry metadata
	const widgetTitle =
		config?.title ||
		__( "What's new on the Progress Planner blog", 'progress-planner' );

	// Show loading state.
	if ( isLoading ) {
		return (
			<Fragment>
				<WidgetHeader title={ widgetTitle } />
				<hr />
				<LoadingState simple className="prpl-whats-new__loading" />
			</Fragment>
		);
	}

	// Extract data
	const posts = data?.posts || [];
	const blogUrl = data?.blogUrl || '';

	// Return null if no posts (widget should not render content).
	if ( posts.length === 0 ) {
		return null;
	}

	// Inline styles.
	const listStyle = {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	};

	const titleStyle = {
		marginTop: 0,
		fontSize: 'var(--prpl-font-size-lg)',
		lineHeight: 1.25,
		fontWeight: 600,
		marginBottom: '6px',
	};

	const titleLinkStyle = {
		color: 'var(--prpl-color-headings)',
		textDecoration: 'none',
	};

	const excerptStyle = {
		margin: 0,
	};

	const footerStyle = {
		display: 'flex',
		justifyContent: 'flex-end',
	};

	const footerLinkStyle = {
		color: 'var(--prpl-color-link)',
		textDecoration: 'underline',
	};

	const blogPostImageStyle = {
		width: '100%',
		minHeight: '120px',
		aspectRatio: '3 / 2',
		backgroundSize: 'cover',
		marginBottom: '0.75rem',
		borderRadius: 'var(--prpl-border-radius-big)',
		border: '1px solid var(--prpl-color-border)',
		backgroundColor: 'var(--prpl-color-gauge-remain)',
		transition: 'transform 0.2s, box-shadow 0.2s',
	};

	return (
		<Fragment>
			<WidgetHeader title={ widgetTitle } />
			<hr />
			<ul style={ listStyle }>
				{ posts.map( ( post, index ) => (
					<li key={ index }>
						{ post.imageUrl && (
							<a
								href={ post.link }
								target="_blank"
								rel="noopener noreferrer"
							>
								<div
									className="prpl-blog-post-image"
									style={ {
										...blogPostImageStyle,
										backgroundImage: `url(${ post.imageUrl })`,
									} }
								/>
							</a>
						) }
						<h3 style={ titleStyle }>
							<a
								href={ post.link }
								target="_blank"
								rel="noopener noreferrer"
								style={ titleLinkStyle }
							>
								{ post.title }
							</a>
						</h3>
						<p style={ excerptStyle }>{ post.excerpt }</p>
						<hr />
					</li>
				) ) }
			</ul>
			<div className="prpl-widget-footer" style={ footerStyle }>
				<a
					href={ blogUrl }
					target="_blank"
					rel="noopener noreferrer"
					style={ footerLinkStyle }
				>
					{ __( 'Read all posts', 'progress-planner' ) }
				</a>
			</div>
		</Fragment>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'whats-new',
	component: WhatsNew,
	priority: 10,
	width: 1,
	forceLastColumn: false,
	title: __( "What's new on the Progress Planner blog", 'progress-planner' ),
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );
