/**
 * What's New Widget Component.
 *
 * Displays blog posts from the Progress Planner blog RSS feed.
 */

import { useState, useEffect, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * What's New widget component.
 *
 * @return {JSX.Element|null} The widget component or null if no posts.
 */
export default function WhatsNew() {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ posts, setPosts ] = useState( [] );
	const [ blogUrl, setBlogUrl ] = useState( '' );

	useEffect( () => {
		apiFetch( { path: '/progress-planner/v1/whats-new' } )
			.then( ( response ) => {
				setPosts( response.posts || [] );
				setBlogUrl( response.blogUrl || '' );
				setIsLoading( false );
			} )
			.catch( () => {
				setIsLoading( false );
			} );
	}, [] );

	// Get title from config or use default.
	const widgetTitle =
		window.prplWhatsNewConfig?.title ||
		__( 'What\'s new on the Progress Planner blog', 'progress-planner' );

	// Show loading state.
	if ( isLoading ) {
		return (
			<Fragment>
				<h2 className="prpl-widget-title">{ widgetTitle }</h2>
				<hr />
				<p className="prpl-whats-new__loading">
					{ __( 'Loading…', 'progress-planner' ) }
				</p>
			</Fragment>
		);
	}

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
			<h2 className="prpl-widget-title">{ widgetTitle }</h2>
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
						<p style={ excerptStyle }>
							{ post.excerpt }
						</p>
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
