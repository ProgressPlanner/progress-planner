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

	// Show loading state.
	if ( isLoading ) {
		return (
			<Fragment>
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

	return (
		<Fragment>
			<hr />
			<ul
				className="prpl-whats-new__list"
				style={ {
					listStyle: 'none',
					padding: 0,
				} }
			>
				{ posts.map( ( post, index ) => (
					<li key={ index } className="prpl-whats-new__item">
						{ post.imageUrl && (
							<a
								href={ post.link }
								target="_blank"
								rel="noopener noreferrer"
								className="prpl-whats-new__image-link"
							>
								<div
									className="prpl-blog-post-image"
									style={ {
										backgroundImage: `url(${ post.imageUrl })`,
									} }
								/>
							</a>
						) }
						<h3 className="prpl-whats-new__title">
							<a
								href={ post.link }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ post.title }
							</a>
						</h3>
						<p className="prpl-whats-new__excerpt">
							{ post.excerpt }
						</p>
						<hr />
					</li>
				) ) }
			</ul>
			<div className="prpl-widget-footer">
				<a href={ blogUrl } target="_blank" rel="noopener noreferrer">
					{ __( 'Read all posts', 'progress-planner' ) }
				</a>
			</div>
		</Fragment>
	);
}
