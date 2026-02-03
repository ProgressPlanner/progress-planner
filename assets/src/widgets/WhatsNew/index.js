/**
 * What's New Widget Component.
 *
 * Displays blog posts from the Progress Planner blog RSS feed.
 */

import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { useApiData } from '../../hooks/useApiData';
import WidgetHeader from '../../components/WidgetHeader';
import WhatsNewSkeleton from './WhatsNewSkeleton';

/**
 * BlogPostImage component with hover state.
 *
 * @param {Object} props      - Component props.
 * @param {string} props.link - Link URL.
 * @param {string} props.url  - Image URL.
 * @return {JSX.Element} The blog post image.
 */
function BlogPostImage( { link, url } ) {
	const [ isHovered, setIsHovered ] = useState( false );

	const baseStyle = {
		width: '100%',
		minHeight: '120px',
		aspectRatio: '3 / 2',
		backgroundSize: 'cover',
		marginBottom: '0.75rem',
		borderRadius: 'var(--prpl-border-radius-big)',
		border: '1px solid var(--prpl-color-border)',
		backgroundColor: 'var(--prpl-color-gauge-remain)',
		transition: 'transform 0.2s, box-shadow 0.2s',
		backgroundImage: `url(${ url })`,
	};

	const hoverStyle = isHovered
		? {
				transform: 'scale(1.01)',
				boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.2)',
		  }
		: {};

	return (
		<a href={ link } target="_blank" rel="noopener noreferrer">
			<div
				className="prpl-blog-post-image"
				style={ { ...baseStyle, ...hoverStyle } }
				onMouseEnter={ () => setIsHovered( true ) }
				onMouseLeave={ () => setIsHovered( false ) }
			/>
		</a>
	);
}

/**
 * PostTitleLink component with hover state.
 *
 * @param {Object} props          - Component props.
 * @param {string} props.link     - Link URL.
 * @param {string} props.children - Link text.
 * @return {JSX.Element} The post title link.
 */
function PostTitleLink( { link, children } ) {
	const [ isHovered, setIsHovered ] = useState( false );

	const style = {
		color: isHovered
			? 'var(--prpl-color-link)'
			: 'var(--prpl-color-headings)',
		textDecoration: isHovered ? 'underline' : 'none',
	};

	return (
		<a
			href={ link }
			target="_blank"
			rel="noopener noreferrer"
			style={ style }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
		>
			{ children }
		</a>
	);
}

/**
 * FooterLink component with hover state.
 *
 * @param {Object} props          - Component props.
 * @param {string} props.link     - Link URL.
 * @param {string} props.children - Link text.
 * @return {JSX.Element} The footer link.
 */
function FooterLink( { link, children } ) {
	const [ isHovered, setIsHovered ] = useState( false );

	const style = {
		color: isHovered
			? 'var(--prpl-color-link-hover)'
			: 'var(--prpl-color-link)',
		textDecoration: isHovered ? 'none' : 'underline',
	};

	return (
		<a
			href={ link }
			target="_blank"
			rel="noopener noreferrer"
			style={ style }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
		>
			{ children }
		</a>
	);
}

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
				<WhatsNewSkeleton posts={ 2 } />
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

	const excerptStyle = {
		margin: 0,
	};

	const footerStyle = {
		display: 'flex',
		justifyContent: 'flex-end',
	};

	return (
		<Fragment>
			<WidgetHeader title={ widgetTitle } />
			<hr />
			<ul style={ listStyle }>
				{ posts.map( ( post, index ) => (
					<li key={ index }>
						{ post.imageUrl && (
							<BlogPostImage
								link={ post.link }
								url={ post.imageUrl }
							/>
						) }
						<h3 style={ titleStyle }>
							<PostTitleLink link={ post.link }>
								{ post.title }
							</PostTitleLink>
						</h3>
						<p style={ excerptStyle }>{ post.excerpt }</p>
						<hr />
					</li>
				) ) }
			</ul>
			<div className="prpl-widget-footer" style={ footerStyle }>
				<FooterLink link={ blogUrl }>
					{ __( 'Read all posts', 'progress-planner' ) }
				</FooterLink>
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

export default WhatsNew;
