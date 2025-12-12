/**
 * Render HTML content sections.
 *
 * @param {Object}          props           Component props.
 * @param {Object}          props.lesson    The lesson object.
 * @param {string}          props.sectionId The section ID to render.
 * @param {string|Function} props.wrapperEl The wrapper element (default: 'div').
 * @return {JSX.Element} Element to render.
 */
import SectionVideo from './SectionVideo';

export default function SectionHTML( {
	lesson,
	sectionId,
	wrapperEl = 'div',
} ) {
	if ( ! lesson || ! lesson[ sectionId ] ) {
		return <div></div>;
	}

	const section = lesson[ sectionId ];
	const Wrapper = typeof wrapperEl === 'string' ? wrapperEl : wrapperEl;
	const wrapperProps =
		typeof wrapperEl === 'string'
			? {}
			: {
					title: section.heading,
					initialOpen: false,
			  };

	return (
		<Wrapper { ...wrapperProps }>
			{ section.video ? (
				<SectionVideo lessonSection={ section } />
			) : (
				<div></div>
			) }
			{ section.text ? (
				<div
					dangerouslySetInnerHTML={ {
						__html: section.text,
					} }
				/>
			) : (
				<div></div>
			) }
		</Wrapper>
	);
}
