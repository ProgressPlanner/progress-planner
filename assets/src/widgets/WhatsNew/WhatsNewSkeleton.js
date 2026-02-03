/**
 * WhatsNew Skeleton Component
 *
 * Skeleton loading state for the WhatsNew widget.
 */

import { SkeletonRect, SkeletonText } from '../../components/Skeleton';

/**
 * PostItemSkeleton component - skeleton for a single blog post.
 *
 * @param {Object}  props           - Component props.
 * @param {boolean} props.showImage - Whether to show image placeholder.
 * @return {JSX.Element} The PostItemSkeleton component.
 */
function PostItemSkeleton( { showImage = true } ) {
	const titleStyle = {
		marginTop: 0,
		marginBottom: '6px',
	};

	const excerptStyle = {
		margin: 0,
	};

	return (
		<li>
			{ showImage && (
				<SkeletonRect
					width="100%"
					height="120px"
					style={ {
						aspectRatio: '3 / 2',
						marginBottom: '0.75rem',
						borderRadius: 'var(--prpl-border-radius-big)',
					} }
				/>
			) }
			<div style={ titleStyle }>
				<SkeletonRect width="85%" height="var(--prpl-font-size-lg)" />
			</div>
			<div style={ excerptStyle }>
				<SkeletonText lines={ 2 } />
			</div>
			<hr />
		</li>
	);
}

/**
 * WhatsNewSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.posts - Number of post skeletons to show.
 * @return {JSX.Element} The WhatsNewSkeleton component.
 */
export default function WhatsNewSkeleton( { posts = 2 } ) {
	const listStyle = {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	};

	const footerStyle = {
		display: 'flex',
		justifyContent: 'flex-end',
	};

	return (
		<>
			<ul style={ listStyle }>
				{ Array.from( { length: posts } ).map( ( _, i ) => (
					<PostItemSkeleton key={ i } showImage={ i === 0 } />
				) ) }
			</ul>
			<div style={ footerStyle }>
				<SkeletonRect width="6rem" height="1rem" />
			</div>
		</>
	);
}
