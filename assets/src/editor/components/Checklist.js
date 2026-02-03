/**
 * Render the todo items.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @param {string} props.pageTodos     Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */
import { PanelBody } from '@wordpress/components';
import ChecklistItem from './ChecklistItem';

export default function Checklist( { lessonSection, pageTodos } ) {
	if ( ! lessonSection.todos ) {
		return null;
	}

	return (
		<>
			{ lessonSection.todos.map( ( toDoGroup ) => (
				<PanelBody
					key={ `progress-planner-sidebar-lesson-section-${ toDoGroup.group_heading }` }
					title={ toDoGroup.group_heading }
					initialOpen={ false }
				>
					<div>
						{ toDoGroup.group_todos.map( ( item ) => (
							<ChecklistItem
								key={ item.id }
								item={ item }
								pageTodos={ pageTodos }
							/>
						) ) }
					</div>
				</PanelBody>
			) ) }
		</>
	);
}
