/**
 * Render a single todo item with its checkbox.
 *
 * @param {Object} props           Component props.
 * @param {Object} props.item      The todo item.
 * @param {string} props.pageTodos Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */
import { CheckboxControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

export default function ChecklistItem( { item, pageTodos } ) {
	const { editPost } = useDispatch( 'core/editor' );

	const handleChange = ( checked ) => {
		const toDos = ( pageTodos || '' ).split( ',' ).filter( ( id ) => id ); // Remove empty strings
		if ( checked ) {
			if ( ! toDos.includes( item.id ) ) {
				toDos.push( item.id );
			}
		} else {
			const index = toDos.indexOf( item.id );
			if ( index > -1 ) {
				toDos.splice( index, 1 );
			}
		}
		// Update the `progress_planner_page_todos` meta value.
		editPost( {
			meta: {
				progress_planner_page_todos: toDos.join( ',' ),
			},
		} );
	};

	const isChecked = ( pageTodos || '' )
		.split( ',' )
		.filter( ( id ) => id )
		.includes( item.id );

	return (
		<div>
			<CheckboxControl
				checked={ isChecked }
				label={ item.todo_name }
				className={
					item.todo_required
						? 'progress-planner-todo-item required'
						: 'progress-planner-todo-item'
				}
				help={
					<div
						dangerouslySetInnerHTML={ {
							__html: item.todo_description,
						} }
					/>
				}
				onChange={ handleChange }
			/>
		</div>
	);
}
