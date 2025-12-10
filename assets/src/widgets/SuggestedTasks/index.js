/**
 * Suggested Tasks Widget Component.
 *
 * Displays a list of suggested tasks (recommendations) for improving the site.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import TaskItem from './TaskItem';
import PopoverManager from './PopoverManager';
import {
	fetchTasks,
	completeTask,
	snoozeTask,
	deleteTask,
	updateTask,
	sendTaskAction,
} from './hooks/useTasksApi';
import { useGridMasonry } from '../../hooks/useGridMasonry';

/**
 * Suggested Tasks widget component.
 *
 * @return {JSX.Element} The widget component.
 */
export default function SuggestedTasks() {
	const [ tasks, setTasks ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ showAll, setShowAll ] = useState(
		window.prplSuggestedTasksConfig?.showAll || false
	);
	const [ celebratingTaskIds, setCelebratingTaskIds ] = useState( new Set() );
	const listRef = useRef( null );
	const injectedTaskIdsRef = useRef( new Set() );

	// Initialize grid masonry layout.
	useGridMasonry();

	/**
	 * Load tasks on component mount.
	 */
	useEffect( () => {
		const loadTasks = async () => {
			try {
				const perPage = showAll
					? 100
					: window.prplSuggestedTasksConfig?.perPage || 5;

				// Fetch published tasks (excluding user tasks).
				const publishedTasks = await fetchTasks( {
					status: 'publish',
					perPage,
					excludeProvider: 'user',
				} );

				// Track injected task IDs.
				publishedTasks.forEach( ( task ) => {
					injectedTaskIdsRef.current.add( task.id );
				} );

				setTasks( publishedTasks );
				setIsLoading( false );

				// Check for pending celebration tasks.
				if ( ! window.prplSuggestedTasksConfig?.delayCelebration ) {
					const pendingTasks = await fetchTasks( {
						status: 'pending',
						perPage,
						excludeProvider: 'user',
					} );

					if ( pendingTasks.length > 0 ) {
						// Add pending tasks to the list.
						setTasks( ( prev ) => [ ...prev, ...pendingTasks ] );

						// Track pending task IDs.
						pendingTasks.forEach( ( task ) => {
							injectedTaskIdsRef.current.add( task.id );
						} );

						// Trash the pending tasks in the background.
						pendingTasks.forEach( ( task ) => {
							completeTask( task.id ).catch( () => {} );
						} );

						// Trigger celebration after 3 seconds.
						setTimeout( () => {
							// Add celebrating class to pending tasks.
							const pendingIds = new Set(
								pendingTasks.map( ( t ) => t.id )
							);
							setCelebratingTaskIds( pendingIds );

							// Dispatch celebration event.
							document.dispatchEvent(
								new CustomEvent( 'prpl/celebrateTasks' )
							);

							// Remove celebrated tasks after animation.
							setTimeout( () => {
								setTasks( ( prev ) =>
									prev.filter(
										( t ) => ! pendingIds.has( t.id )
									)
								);
								setCelebratingTaskIds( new Set() );

								// Trigger grid resize.
								window.dispatchEvent(
									new CustomEvent( 'prpl/grid/resize' )
								);
							}, 2000 );
						}, 3000 );
					}
				}

				// Trigger grid resize.
				setTimeout( () => {
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				}, 100 );
			} catch {
				setIsLoading( false );
			}
		};

		loadTasks();
	}, [ showAll ] );

	/**
	 * Handle task completion.
	 *
	 * @param {number} postId The post ID.
	 * @param {Object} task   The task object.
	 */
	const handleComplete = useCallback( async ( postId, task ) => {
		try {
			// Add to celebrating set.
			setCelebratingTaskIds( ( prev ) => new Set( [ ...prev, postId ] ) );

			// Update task status via API.
			await completeTask( postId );

			// Send analytics action.
			sendTaskAction( postId, 'complete' );

			// Get task points.
			const eventPoints = parseInt( task.prpl_points ) || 0;

			// Update Ravi gauge if task has points.
			if (
				eventPoints > 0 &&
				typeof window.prplUpdateRaviGauge === 'function'
			) {
				window.prplUpdateRaviGauge( eventPoints );
			}

			// Dispatch celebration event for confetti.
			if ( eventPoints > 0 && listRef.current ) {
				const taskElement = listRef.current.querySelector(
					`[data-post-id="${ postId }"]`
				);
				document.dispatchEvent(
					new CustomEvent( 'prpl/celebrateTasks', {
						detail: { element: taskElement },
					} )
				);
			}

			// Remove task after animation delay.
			setTimeout( async () => {
				setTasks( ( prev ) => prev.filter( ( t ) => t.id !== postId ) );
				setCelebratingTaskIds( ( prev ) => {
					const next = new Set( prev );
					next.delete( postId );
					return next;
				} );

				// Fetch replacement task.
				const replacementTasks = await fetchTasks( {
					status: 'publish',
					perPage: 1,
					excludeProvider: 'user',
					excludeIds: Array.from( injectedTaskIdsRef.current ),
				} );

				if ( replacementTasks.length > 0 ) {
					setTasks( ( prev ) => [ ...prev, replacementTasks[ 0 ] ] );
					injectedTaskIdsRef.current.add( replacementTasks[ 0 ].id );
				}

				// Trigger grid resize.
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}, 2000 );
		} catch {
			// Remove from celebrating on error.
			setCelebratingTaskIds( ( prev ) => {
				const next = new Set( prev );
				next.delete( postId );
				return next;
			} );
		}
	}, [] );

	/**
	 * Handle task snooze.
	 *
	 * @param {number} postId   The post ID.
	 * @param {string} duration The snooze duration.
	 */
	const handleSnooze = useCallback( async ( postId, duration ) => {
		try {
			await snoozeTask( postId, duration );

			// Remove task from list.
			setTasks( ( prev ) => prev.filter( ( t ) => t.id !== postId ) );

			// Fetch replacement task.
			const replacementTasks = await fetchTasks( {
				status: 'publish',
				perPage: 1,
				excludeProvider: 'user',
				excludeIds: Array.from( injectedTaskIdsRef.current ),
			} );

			if ( replacementTasks.length > 0 ) {
				setTasks( ( prev ) => [ ...prev, replacementTasks[ 0 ] ] );
				injectedTaskIdsRef.current.add( replacementTasks[ 0 ].id );
			}

			// Trigger grid resize.
			window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
		} catch {
			// Error handled silently.
		}
	}, [] );

	/**
	 * Handle task deletion.
	 *
	 * @param {number} postId The post ID.
	 */
	const handleDelete = useCallback( async ( postId ) => {
		try {
			await deleteTask( postId );

			// Send analytics action.
			sendTaskAction( postId, 'delete' );

			// Remove task from list.
			setTasks( ( prev ) => prev.filter( ( t ) => t.id !== postId ) );

			// Fetch replacement task.
			const replacementTasks = await fetchTasks( {
				status: 'publish',
				perPage: 1,
				excludeProvider: 'user',
				excludeIds: Array.from( injectedTaskIdsRef.current ),
			} );

			if ( replacementTasks.length > 0 ) {
				setTasks( ( prev ) => [ ...prev, replacementTasks[ 0 ] ] );
				injectedTaskIdsRef.current.add( replacementTasks[ 0 ].id );
			}

			// Trigger grid resize.
			setTimeout( () => {
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}, 500 );
		} catch {
			// Error handled silently.
		}
	}, [] );

	/**
	 * Handle task title change (for user tasks).
	 *
	 * @param {number} postId   The post ID.
	 * @param {string} newTitle The new title.
	 */
	const handleTitleChange = useCallback( async ( postId, newTitle ) => {
		try {
			await updateTask( postId, { title: newTitle } );
		} catch {
			// Error handled silently.
		}
	}, [] );

	/**
	 * Handle task move (for user tasks).
	 *
	 * @param {number} postId    The post ID.
	 * @param {string} direction The direction ('up' or 'down').
	 */
	const handleMove = useCallback(
		async ( postId, direction ) => {
			const currentIndex = tasks.findIndex( ( t ) => t.id === postId );
			if ( currentIndex === -1 ) {
				return;
			}

			const newIndex =
				direction === 'up' ? currentIndex - 1 : currentIndex + 1;
			if ( newIndex < 0 || newIndex >= tasks.length ) {
				return;
			}

			// Reorder tasks in state.
			const newTasks = [ ...tasks ];
			const [ movedTask ] = newTasks.splice( currentIndex, 1 );
			newTasks.splice( newIndex, 0, movedTask );

			setTasks( newTasks );

			// Update menu_order for all affected tasks.
			newTasks.forEach( ( task, index ) => {
				updateTask( task.id, { menu_order: index } ).catch( () => {} );
			} );
		},
		[ tasks ]
	);

	/**
	 * Handle show all/fewer toggle.
	 */
	const handleToggleShowAll = useCallback( async () => {
		const newShowAll = ! showAll;
		setShowAll( newShowAll );
		setIsLoading( true );

		// Clear tracking.
		injectedTaskIdsRef.current.clear();

		// Update URL.
		const url = new URL( window.location );
		if ( newShowAll ) {
			url.searchParams.set( 'prpl_show_all_recommendations', '' );
		} else {
			url.searchParams.delete( 'prpl_show_all_recommendations' );
		}
		window.history.pushState( {}, '', url );
	}, [ showAll ] );

	// Show loading state.
	if ( isLoading ) {
		return (
			<p className="prpl-suggested-tasks-loading">
				{ __( 'Loading tasks…', 'progress-planner' ) }
			</p>
		);
	}

	// Show empty state.
	if ( tasks.length === 0 ) {
		return (
			<>
				<ul
					id="prpl-suggested-tasks-list"
					className="prpl-suggested-tasks-list"
					ref={ listRef }
				></ul>
				<p className="prpl-no-suggested-tasks">
					{ __(
						'You have completed all recommended tasks.',
						'progress-planner'
					) }
					<br />
					{ __(
						'Check back later for new tasks!',
						'progress-planner'
					) }
				</p>
			</>
		);
	}

	return (
		<>
			<PopoverManager tasks={ tasks } onComplete={ handleComplete } />
			<ul style={ { display: 'none' } }></ul>
			<ul
				id="prpl-suggested-tasks-list"
				className="prpl-suggested-tasks-list"
				ref={ listRef }
			>
				{ tasks.map( ( task ) => (
					<TaskItem
						key={ task.id }
						task={ task }
						isUserTask={ task.prpl_provider?.slug === 'user' }
						isCelebrating={ celebratingTaskIds.has( task.id ) }
						onComplete={ handleComplete }
						onSnooze={ handleSnooze }
						onDelete={ handleDelete }
						onMove={ handleMove }
						onTitleChange={ handleTitleChange }
					/>
				) ) }
			</ul>
			<p className="prpl-show-all-tasks">
				<button
					type="button"
					id="prpl-toggle-all-recommendations"
					className="prpl-toggle-all-recommendations-button"
					onClick={ handleToggleShowAll }
				>
					{ showAll
						? __( 'Show fewer recommendations', 'progress-planner' )
						: __( 'Show all recommendations', 'progress-planner' ) }
				</button>
			</p>
		</>
	);
}
