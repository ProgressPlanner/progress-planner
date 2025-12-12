/**
 * Suggested Tasks Widget Component.
 *
 * Displays a list of suggested tasks (recommendations) for improving the site.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import TaskItem from '../../components/TaskItem';
import PopoverManager from './PopoverManager';
import {
	fetchTasks,
	completeTask,
	snoozeTask,
	deleteTask,
	updateTask,
	sendTaskAction,
} from '../../hooks/useTasksApi';
import { useGridMasonry } from '../../hooks/useGridMasonry';
import { useCelebration } from '../../hooks/useCelebration';

/**
 * Suggested Tasks widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The widget component.
 */
function SuggestedTasks( { config = {} } ) {
	const [ tasks, setTasks ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ hasMorePages, setHasMorePages ] = useState( false );
	const [ isLoadingMore, setIsLoadingMore ] = useState( false );
	const [ celebratingTaskIds, setCelebratingTaskIds ] = useState( new Set() );
	const listRef = useRef( null );
	const injectedTaskIdsRef = useRef( new Set() );

	// Initialize grid masonry layout.
	useGridMasonry();

	// Get celebration functions.
	const { celebrate } = useCelebration();

	/**
	 * Load tasks on component mount.
	 */
	useEffect( () => {
		const loadTasks = async () => {
			try {
				const perPage = config?.perPage || 5;

				// First: Fetch pending celebration tasks (if not delayed).
				if ( ! config?.delayCelebration ) {
					const pendingResult = await fetchTasks( {
						status: 'pending',
						perPage: 100, // Get all pending tasks for celebration
						excludeProvider: 'user',
					} );

					if ( pendingResult.tasks.length > 0 ) {
						// Add pending tasks to the list.
						setTasks( pendingResult.tasks );

						// Track pending task IDs.
						pendingResult.tasks.forEach( ( task ) => {
							injectedTaskIdsRef.current.add( task.id );
						} );

						// Trash the pending tasks in the background.
						pendingResult.tasks.forEach( ( task ) => {
							completeTask( task.id ).catch( () => {} );
						} );

						// Trigger celebration after 3 seconds.
						setTimeout( () => {
							// Add celebrating class to pending tasks.
							const pendingIds = new Set(
								pendingResult.tasks.map( ( t ) => t.id )
							);
							setCelebratingTaskIds( pendingIds );

							// Trigger celebration confetti.
							celebrate( listRef.current );

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

				// Second: Fetch first page of published tasks.
				const publishedResult = await fetchTasks( {
					status: 'publish',
					perPage,
					page: 1,
					excludeProvider: 'user',
				} );

				// Track injected task IDs.
				publishedResult.tasks.forEach( ( task ) => {
					injectedTaskIdsRef.current.add( task.id );
				} );

				// Add published tasks to the list (append if we already have pending tasks).
				setTasks( ( prev ) => [ ...prev, ...publishedResult.tasks ] );
				setHasMorePages( publishedResult.hasMore );
				setIsLoading( false );

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
	}, [ config, celebrate ] );

	/**
	 * Handle task completion.
	 *
	 * @param {number} postId The post ID.
	 * @param {Object} task   The task object.
	 */
	const handleComplete = useCallback(
		async ( postId, task ) => {
			try {
				// Add to celebrating set.
				setCelebratingTaskIds(
					( prev ) => new Set( [ ...prev, postId ] )
				);

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

				// Trigger celebration confetti.
				if ( eventPoints > 0 && listRef.current ) {
					const taskElement = listRef.current.querySelector(
						`[data-post-id="${ postId }"]`
					);
					celebrate( taskElement );
				}

				// Remove task after animation delay.
				setTimeout( async () => {
					setTasks( ( prev ) =>
						prev.filter( ( t ) => t.id !== postId )
					);
					setCelebratingTaskIds( ( prev ) => {
						const next = new Set( prev );
						next.delete( postId );
						return next;
					} );

					// Fetch replacement task.
					const replacementResult = await fetchTasks( {
						status: 'publish',
						perPage: 1,
						page: 1,
						excludeProvider: 'user',
						excludeIds: Array.from( injectedTaskIdsRef.current ),
					} );

					if ( replacementResult.tasks.length > 0 ) {
						setTasks( ( prev ) => [
							...prev,
							replacementResult.tasks[ 0 ],
						] );
						injectedTaskIdsRef.current.add(
							replacementResult.tasks[ 0 ].id
						);
					}

					// Trigger grid resize.
					window.dispatchEvent(
						new CustomEvent( 'prpl/grid/resize' )
					);
				}, 2000 );
			} catch {
				// Remove from celebrating on error.
				setCelebratingTaskIds( ( prev ) => {
					const next = new Set( prev );
					next.delete( postId );
					return next;
				} );
			}
		},
		[ celebrate ]
	);

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
			const replacementResult = await fetchTasks( {
				status: 'publish',
				perPage: 1,
				page: 1,
				excludeProvider: 'user',
				excludeIds: Array.from( injectedTaskIdsRef.current ),
			} );

			if ( replacementResult.tasks.length > 0 ) {
				setTasks( ( prev ) => [
					...prev,
					replacementResult.tasks[ 0 ],
				] );
				injectedTaskIdsRef.current.add(
					replacementResult.tasks[ 0 ].id
				);
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
			const replacementResult = await fetchTasks( {
				status: 'publish',
				perPage: 1,
				page: 1,
				excludeProvider: 'user',
				excludeIds: Array.from( injectedTaskIdsRef.current ),
			} );

			if ( replacementResult.tasks.length > 0 ) {
				setTasks( ( prev ) => [
					...prev,
					replacementResult.tasks[ 0 ],
				] );
				injectedTaskIdsRef.current.add(
					replacementResult.tasks[ 0 ].id
				);
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
	 * Handle load more button click.
	 */
	const handleLoadMore = useCallback( async () => {
		if ( isLoadingMore || ! hasMorePages ) {
			return;
		}

		setIsLoadingMore( true );
		const nextPage = currentPage + 1;
		const perPage = config?.perPage || 5;

		try {
			const result = await fetchTasks( {
				status: 'publish',
				perPage,
				page: nextPage,
				excludeProvider: 'user',
			} );

			// Track injected task IDs.
			result.tasks.forEach( ( task ) => {
				injectedTaskIdsRef.current.add( task.id );
			} );

			// Append new tasks to existing list.
			setTasks( ( prev ) => [ ...prev, ...result.tasks ] );
			setHasMorePages( result.hasMore );
			setCurrentPage( nextPage );

			// Trigger grid resize.
			setTimeout( () => {
				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
			}, 100 );
		} catch ( error ) {
			console.error( 'Error loading more tasks:', error );
		} finally {
			setIsLoadingMore( false );
		}
	}, [ currentPage, hasMorePages, isLoadingMore, config ] );

	// Inline styles
	const listStyle = {
		listStyle: 'none',
		padding: 0,
		margin: '0 0 var(--prpl-padding) 0',
	};

	const loadingStyle = {
		display: 'block',
		backgroundColor: 'var(--prpl-background-activity)',
		padding: 'calc(var(--prpl-padding) / 2)',
	};

	const emptyStyle = {
		display: 'block',
		backgroundColor: 'var(--prpl-background-activity)',
		padding: 'calc(var(--prpl-padding) / 2)',
	};

	const toggleButtonStyle = {
		background: 'none',
		border: 'none',
		padding: 0,
		color: 'var(--prpl-color-link)',
		textDecoration: 'underline',
		cursor: 'pointer',
		fontSize: 'inherit',
		fontFamily: 'inherit',
	};

	/**
	 * Decode HTML entities in a string.
	 *
	 * @param {string} str The string to decode.
	 * @return {string} The decoded string.
	 */
	const decodeHtmlEntities = ( str ) => {
		const textarea = document.createElement( 'textarea' );
		textarea.innerHTML = str;
		return textarea.value;
	};

	// Get title and description from config or use defaults.
	const widgetTitle = decodeHtmlEntities(
		config?.title ||
			sprintf(
				/* translators: %s: Ravi's name. */
				__( "%s's Recommendations", 'progress-planner' ),
				config?.raviName || 'Ravi'
			)
	);

	const widgetDescription = decodeHtmlEntities(
		config?.description ||
			sprintf(
				/* translators: %s: Ravi's name. */
				__(
					"Complete a task from %s's Recommendations to improve your site and earn points toward this month's badge!",
					'progress-planner'
				),
				config?.raviName || 'Ravi'
			)
	);

	// Show loading state.
	if ( isLoading ) {
		return (
			<>
				<h2 className="prpl-widget-title">{ widgetTitle }</h2>
				<p className="prpl-suggested-tasks-widget-description">
					{ widgetDescription }
				</p>
				<p
					className="prpl-suggested-tasks-loading"
					style={ loadingStyle }
				>
					{ __( 'Loading tasks…', 'progress-planner' ) }
				</p>
			</>
		);
	}

	// Show empty state.
	if ( tasks.length === 0 ) {
		return (
			<>
				<h2 className="prpl-widget-title">{ widgetTitle }</h2>
				<p className="prpl-suggested-tasks-widget-description">
					{ widgetDescription }
				</p>
				<ul
					id="prpl-suggested-tasks-list"
					className="prpl-suggested-tasks-list"
					style={ listStyle }
					ref={ listRef }
				></ul>
				<p className="prpl-no-suggested-tasks" style={ emptyStyle }>
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
			<h2 className="prpl-widget-title">{ widgetTitle }</h2>
			<p className="prpl-suggested-tasks-widget-description">
				{ widgetDescription }
			</p>
			<PopoverManager onComplete={ handleComplete } config={ config } />
			<ul style={ { display: 'none' } }></ul>
			<ul
				id="prpl-suggested-tasks-list"
				className="prpl-suggested-tasks-list"
				style={ listStyle }
				ref={ listRef }
			>
				{ tasks.map( ( task, index ) => (
					<TaskItem
						key={ task.id }
						task={ task }
						index={ index }
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
			{ hasMorePages && (
				<p className="prpl-show-all-tasks">
					<button
						type="button"
						id="prpl-load-more-recommendations"
						className="prpl-toggle-all-recommendations-button"
						style={ toggleButtonStyle }
						onClick={ handleLoadMore }
						disabled={ isLoadingMore }
					>
						{ isLoadingMore
							? __( 'Loading…', 'progress-planner' )
							: __( 'Load more tasks', 'progress-planner' ) }
					</button>
				</p>
			) }
		</>
	);
}

// Register widget via hook
doAction( 'prpl.dashboard.registerWidget', {
	id: 'suggested-tasks',
	component: SuggestedTasks,
	priority: 10,
} );
