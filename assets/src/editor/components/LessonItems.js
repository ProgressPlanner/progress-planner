/**
 * Render the lesson items.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.lessons         Array of lesson objects.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { getPageTypeSlugFromId } from '../utils/getPageTypeSlugFromId';
import SectionHTML from './SectionHTML';
import SectionVideo from './SectionVideo';
import TodoProgress from './TodoProgress';
import Checklist from './Checklist';

const TAXONOMY = 'progress_planner_page_types';

export default function LessonItems( { lessons, pageTypes, defaultPageType } ) {
	const pageTypeID = useSelect( ( select ) =>
		select( 'core/editor' ).getEditedPostAttribute( TAXONOMY )
	);

	const pageTodosMeta = useSelect( ( select ) => {
		const meta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
		return meta ? meta.progress_planner_page_todos : '';
	}, [] );
	const pageTodos = pageTodosMeta || '';

	const pageType = getPageTypeSlugFromId(
		pageTypeID,
		pageTypes,
		defaultPageType
	);

	// Bail early if the page type or lessons are not set.
	if ( ! pageType || ! lessons || 0 === lessons.length ) {
		return <div></div>;
	}

	const lesson = lessons.find(
		( lessonItem ) => lessonItem.settings.id === pageType
	);

	if ( ! lesson ) {
		return <div></div>;
	}

	// Create a copy of the lesson to avoid mutating the original
	const lessonCopy = { ...lesson };

	if ( lessonCopy.content_update_cycle?.text ) {
		lessonCopy.content_update_cycle.text =
			lessonCopy.content_update_cycle.text
				.replace( /\{page_type\}/g, lessonCopy.name )
				.replace(
					/\{update_cycle\}/g,
					lessonCopy.content_update_cycle.update_cycle
				);
	}

	return (
		<Fragment>
			{ /* Update cycle content. */ }
			<SectionHTML
				lesson={ lessonCopy }
				sectionId="content_update_cycle"
				wrapperEl="div"
			/>

			{ /* Intro video & content. */ }
			<SectionHTML
				lesson={ lessonCopy }
				sectionId="intro"
				wrapperEl={ PanelBody }
			/>

			{ /* Checklist video & content. */ }
			{ lessonCopy.checklist ? (
				<PanelBody
					title={ lessonCopy.checklist.heading }
					initialOpen={ false }
				>
					<div>
						{ lessonCopy.checklist.video ? (
							<SectionVideo
								lessonSection={ lessonCopy.checklist }
							/>
						) : (
							<div></div>
						) }
						<TodoProgress
							lessonSection={ lessonCopy.checklist }
							pageTodos={ pageTodos }
						/>
						<Checklist
							lessonSection={ lessonCopy.checklist }
							pageTodos={ pageTodos }
						/>
					</div>
				</PanelBody>
			) : (
				<div></div>
			) }

			{ /* Writers block video & content. */ }
			<SectionHTML
				lesson={ lessonCopy }
				sectionId="writers_block"
				wrapperEl={ PanelBody }
			/>
		</Fragment>
	);
}
