/**
 * Render the todo items progressbar.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @param {string} props.pageTodos     Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */
export default function TodoProgress( { lessonSection, pageTodos } ) {
	// Get an array of required todo items.
	const requiredToDos = [];
	if ( lessonSection.todos ) {
		lessonSection.todos.forEach( ( toDoGroup ) => {
			toDoGroup.group_todos.forEach( ( item ) => {
				if ( item.todo_required ) {
					requiredToDos.push( item.id );
				}
			} );
		} );
	}

	// Get an array of completed todo items.
	const completedToDos = ( pageTodos || '' )
		.split( ',' )
		.filter( ( item ) => item && requiredToDos.includes( item ) );

	// Get the percentage of completed todo items.
	const percentageComplete =
		requiredToDos.length > 0
			? Math.round(
					( completedToDos.length / requiredToDos.length ) * 100
			  )
			: 0;

	return (
		<div>
			<div
				style={ {
					width: '100%',
					display: 'flex',
					alignItems: 'center',
				} }
			>
				<div
					style={ {
						width: '100%',
						backgroundColor: '#e1e3e7',
						height: '15px',
						borderRadius: '5px',
					} }
				>
					<div
						style={ {
							width: `${ percentageComplete }%`,
							backgroundColor: '#14b8a6',
							height: '15px',
							borderRadius: '5px',
						} }
					/>
				</div>
				<div
					style={ {
						margin: '0 5px',
						fontSize: '12px',
						color: '#38296D',
					} }
				>
					{ `${ percentageComplete }%` }
				</div>
			</div>
			<div
				dangerouslySetInnerHTML={ {
					__html:
						window.prplL10nStrings?.checklistProgressDescription ||
						'',
				} }
			/>
		</div>
	);
}
