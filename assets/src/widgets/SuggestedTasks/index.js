/**
 * Suggested Tasks Widget Component.
 *
 * Displays a list of suggested tasks (recommendations) for improving the site.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import PopoverManager from './PopoverManager';
import TaskList from './TaskList';
import LoadMoreButton from './LoadMoreButton';
import { STYLES } from './styles';
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
import { dispatchGridResize } from '../../utils/gridResize';
import WidgetHeader from '../../components/WidgetHeader';
import SuggestedTasksSkeleton from './SuggestedTasksSkeleton';
import {
	setTaskRenderCallback,
	getTaskProviderInstance,
} from '../../services/taskRegistry';
import { useDashboardStore } from '../../stores/dashboardStore';

// Import task registrations (tasks will self-register on import).
import '../../tasks';

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
	const tasksMapRef = useRef( new Map() ); // Map of task ID to task object for quick lookup

	// Initialize grid masonry layout.
	useGridMasonry();

	// Get celebration functions.
	const { celebrate } = useCelebration();

	// Get onTaskCompleted from Zustand store for cross-widget communication.
	const onTaskCompleted = useDashboardStore(
		( state ) => state.onTaskCompleted
	);

	/**
	 * Insert task in sorted position by priority.
	 *
	 * @param {Array}  currentTasks Current tasks array.
	 * @param {Object} newTask      New task to insert.
	 * @param {number} priority     Task priority (lower = higher priority).
	 * @return {Array} New tasks array with task inserted in sorted position.
	 */
	const insertTaskSorted = useCallback(
		( currentTasks, newTask, priority ) => {
			// Skip if task already exists
			if ( tasksMapRef.current.has( newTask.id ) ) {
				return currentTasks;
			}

			// Add to map
			tasksMapRef.current.set( newTask.id, newTask );

			// Find insertion point (tasks are sorted by priority ascending)
			let insertIndex = currentTasks.length;
			for ( let i = 0; i < currentTasks.length; i++ ) {
				const taskPriority =
					currentTasks[ i ].prpl_priority !== undefined
						? currentTasks[ i ].prpl_priority
						: 50;
				if ( priority < taskPriority ) {
					insertIndex = i;
					break;
				}
			}

			// Insert task
			const newTasks = [ ...currentTasks ];
			newTasks.splice( insertIndex, 0, newTask );
			return newTasks;
		},
		[]
	);

	/**
	 * Generate task actions if missing.
	 *
	 * @param {Object} taskData Task data from the API.
	 * @return {Object} Task data with actions populated if missing.
	 */
	const ensureTaskActions = useCallback( ( taskData ) => {
		// If actions are already provided, return as-is.
		if (
			taskData.prpl_task_actions &&
			taskData.prpl_task_actions.length > 0
		) {
			return taskData;
		}

		// Try to generate actions from the task provider.
		// Try multiple ways to get the provider ID:
		// 1. From prpl_provider object (if embedded in REST response)
		// 2. From provider_id field
		// 3. From meta.provider_id
		// 4. From task slug (often matches provider ID for React tasks)
		// 5. Fetch term from prpl_recommendations_provider if it's an array
		let providerId =
			taskData.prpl_provider?.slug ||
			taskData.provider_id ||
			taskData.meta?.provider_id ||
			'';

		// Fallback: Use task slug as provider ID (common pattern for React tasks)
		if ( ! providerId && taskData.slug ) {
			// Use slug directly as provider ID
			providerId = taskData.slug;
		}

		// Fallback: Try to get provider from embedded taxonomy terms or fetch it
		if (
			! providerId &&
			taskData.prpl_recommendations_provider &&
			Array.isArray( taskData.prpl_recommendations_provider )
		) {
			// If it's an array of term objects (from _embed)
			const firstItem = taskData.prpl_recommendations_provider[ 0 ];
			if (
				firstItem &&
				typeof firstItem === 'object' &&
				firstItem.slug
			) {
				providerId = firstItem.slug;
			} else if (
				typeof firstItem === 'number' &&
				taskData._embedded &&
				taskData._embedded[ 'wp:term' ] &&
				taskData._embedded[ 'wp:term' ][ 0 ]
			) {
				// Try to find the term in embedded data
				const embeddedTerms = taskData._embedded[ 'wp:term' ].flat();
				const term = embeddedTerms.find(
					( t ) =>
						t &&
						t.taxonomy === 'prpl_recommendations_provider' &&
						t.id === firstItem
				);
				if ( term && term.slug ) {
					providerId = term.slug;
				}
			}
		}

		if ( ! providerId ) {
			console.warn( 'ensureTaskActions: No providerId found for task:', {
				...taskData,
				prpl_provider: taskData.prpl_provider,
				provider_id: taskData.provider_id,
				slug: taskData.slug,
				prpl_recommendations_provider:
					taskData.prpl_recommendations_provider,
			} );
			return taskData;
		}

		const providerInstance = getTaskProviderInstance( providerId );
		if ( ! providerInstance ) {
			console.warn(
				`ensureTaskActions: Provider instance not found for providerId "${ providerId }"`,
				{ taskData }
			);
			return taskData;
		}
		if ( ! providerInstance.getTaskActions ) {
			console.warn(
				`ensureTaskActions: Provider "${ providerId }" does not have getTaskActions method`
			);
			return taskData;
		}

		try {
			const actions = providerInstance.getTaskActions( taskData );
			if ( actions && actions.length > 0 ) {
				return {
					...taskData,
					prpl_task_actions: actions,
				};
			}
			console.warn(
				`ensureTaskActions: No actions generated for provider "${ providerId }"`,
				{ taskData, providerInstance }
			);
		} catch ( error ) {
			console.error(
				`Error generating actions for task provider "${ providerId }":`,
				error
			);
		}

		return taskData;
	}, [] );

	/**
	 * Render callback for streaming tasks.
	 * Called by taskRegistry when a task is ready to render.
	 *
	 * @param {Object} taskData Task data from the API.
	 * @param {number} priority Task priority.
	 * @return {void}
	 */
	const handleTaskRender = useCallback(
		( taskData, priority = 50 ) => {
			// Skip if already rendered
			if ( tasksMapRef.current.has( taskData.id ) ) {
				return;
			}

			// Add priority to task data if not present
			if ( taskData.prpl_priority === undefined ) {
				taskData.prpl_priority = priority;
			}

			// Ensure task actions are generated if missing
			const taskWithActions = ensureTaskActions( taskData );

			// Insert in sorted position
			setTasks( ( prev ) =>
				insertTaskSorted( prev, taskWithActions, priority )
			);

			// Track task ID
			injectedTaskIdsRef.current.add( taskData.id );

			// Trigger grid resize
			dispatchGridResize( 100 );

			// Mark as no longer loading after first task arrives
			setIsLoading( false );
		},
		[ insertTaskSorted, ensureTaskActions ]
	);

	/**
	 * Set up streaming on component mount.
	 */
	useEffect( () => {
		// Set up render callback for task registry
		setTaskRenderCallback( handleTaskRender );

		// Handle pending celebration tasks (if not delayed)
		if ( ! config?.delayCelebration ) {
			fetchTasks( {
				status: 'pending',
				perPage: 100,
				excludeProvider: 'user',
			} )
				.then( ( pendingResult ) => {
					if ( pendingResult.tasks.length > 0 ) {
						// Add pending tasks to the list (actions will be generated in handleTaskRender)
						pendingResult.tasks.forEach( ( task ) => {
							handleTaskRender( task, task.prpl_priority || 50 );
						} );

						// Trash the pending tasks in the background
						pendingResult.tasks.forEach( ( task ) => {
							completeTask( task.id ).catch( () => {} );
						} );

						// Trigger celebration after 3 seconds
						setTimeout( () => {
							const pendingIds = new Set(
								pendingResult.tasks.map( ( t ) => t.id )
							);
							setCelebratingTaskIds( pendingIds );
							celebrate( listRef.current );

							// Remove celebrated tasks after animation
							setTimeout( () => {
								setTasks( ( prev ) =>
									prev.filter(
										( t ) => ! pendingIds.has( t.id )
									)
								);
								pendingIds.forEach( ( id ) => {
									tasksMapRef.current.delete( id );
								} );
								setCelebratingTaskIds( new Set() );
								dispatchGridResize();
							}, 2000 );
						}, 3000 );
					} else {
						setIsLoading( false );
					}
				} )
				.catch( () => {
					setIsLoading( false );
				} );
		} else {
			// If celebration is delayed, mark as not loading
			// Tasks will stream in via handleTaskRender
			setTimeout( () => {
				setIsLoading( false );
			}, 1000 ); // Give tasks time to start streaming
		}

		// Cleanup
		return () => {
			setTaskRenderCallback( null );
		};
	}, [ config, celebrate, handleTaskRender ] );

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

				// Notify context about task completion (for cross-widget updates).
				if ( eventPoints > 0 ) {
					onTaskCompleted( task, eventPoints );
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
					tasksMapRef.current.delete( postId );
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
						const replacementTask = ensureTaskActions(
							replacementResult.tasks[ 0 ]
						);
						setTasks( ( prev ) =>
							insertTaskSorted(
								prev,
								replacementTask,
								replacementTask.prpl_priority || 50
							)
						);
						injectedTaskIdsRef.current.add( replacementTask.id );
					}

					// Trigger grid resize.
					dispatchGridResize();
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
		[ celebrate, insertTaskSorted, ensureTaskActions, onTaskCompleted ]
	);

	/**
	 * Handle task snooze.
	 *
	 * @param {number} postId   The post ID.
	 * @param {string} duration The snooze duration.
	 */
	const handleSnooze = useCallback(
		async ( postId, duration ) => {
			try {
				await snoozeTask( postId, duration );

				// Remove task from list.
				setTasks( ( prev ) => prev.filter( ( t ) => t.id !== postId ) );
				tasksMapRef.current.delete( postId );

				// Fetch replacement task.
				const replacementResult = await fetchTasks( {
					status: 'publish',
					perPage: 1,
					page: 1,
					excludeProvider: 'user',
					excludeIds: Array.from( injectedTaskIdsRef.current ),
				} );

				if ( replacementResult.tasks.length > 0 ) {
					const replacementTask = ensureTaskActions(
						replacementResult.tasks[ 0 ]
					);
					setTasks( ( prev ) =>
						insertTaskSorted(
							prev,
							replacementTask,
							replacementTask.prpl_priority || 50
						)
					);
					injectedTaskIdsRef.current.add( replacementTask.id );
				}

				// Trigger grid resize.
				dispatchGridResize();
			} catch {
				// Error handled silently.
			}
		},
		[ insertTaskSorted, ensureTaskActions ]
	);

	/**
	 * Handle task deletion.
	 *
	 * @param {number} postId The post ID.
	 */
	const handleDelete = useCallback(
		async ( postId ) => {
			try {
				await deleteTask( postId );

				// Send analytics action.
				sendTaskAction( postId, 'delete' );

				// Remove task from list.
				setTasks( ( prev ) => prev.filter( ( t ) => t.id !== postId ) );
				tasksMapRef.current.delete( postId );

				// Fetch replacement task.
				const replacementResult = await fetchTasks( {
					status: 'publish',
					perPage: 1,
					page: 1,
					excludeProvider: 'user',
					excludeIds: Array.from( injectedTaskIdsRef.current ),
				} );

				if ( replacementResult.tasks.length > 0 ) {
					const replacementTask = ensureTaskActions(
						replacementResult.tasks[ 0 ]
					);
					setTasks( ( prev ) =>
						insertTaskSorted(
							prev,
							replacementTask,
							replacementTask.prpl_priority || 50
						)
					);
					injectedTaskIdsRef.current.add( replacementTask.id );
				}

				// Trigger grid resize.
				dispatchGridResize( 500 );
			} catch {
				// Error handled silently.
			}
		},
		[ insertTaskSorted, ensureTaskActions ]
	);

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

			// Track injected task IDs and ensure actions are generated.
			const tasksWithActions = result.tasks.map( ( task ) => {
				injectedTaskIdsRef.current.add( task.id );
				return ensureTaskActions( task );
			} );

			// Append new tasks to existing list.
			setTasks( ( prev ) => [ ...prev, ...tasksWithActions ] );
			setHasMorePages( result.hasMore );
			setCurrentPage( nextPage );

			// Trigger grid resize.
			dispatchGridResize( 100 );
		} catch ( error ) {
			console.error( 'Error loading more tasks:', error );
		} finally {
			setIsLoadingMore( false );
		}
	}, [
		currentPage,
		hasMorePages,
		isLoadingMore,
		config,
		ensureTaskActions,
	] );

	/**
	 * Decode HTML entities in a string.
	 *
	 * @param {string} str The string to decode.
	 * @return {string} The decoded string.
	 */
	const decodeHtmlEntities = useCallback( ( str ) => {
		const textarea = document.createElement( 'textarea' );
		textarea.innerHTML = str;
		return textarea.value;
	}, [] );

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
				<WidgetHeader title={ widgetTitle } />
				<SuggestedTasksSkeleton count={ 4 } />
			</>
		);
	}

	// Show empty state.
	if ( tasks.length === 0 ) {
		return (
			<>
				<WidgetHeader title={ widgetTitle } />
				<p className="prpl-suggested-tasks-widget-description">
					{ widgetDescription }
				</p>
				<ul
					id="prpl-suggested-tasks-list"
					className="prpl-suggested-tasks-list"
					style={ STYLES.list }
					ref={ listRef }
				></ul>
				<p className="prpl-no-suggested-tasks" style={ STYLES.empty }>
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
			<WidgetHeader title={ widgetTitle } />
			<p className="prpl-suggested-tasks-widget-description">
				{ widgetDescription }
			</p>
			<PopoverManager onComplete={ handleComplete } config={ config } />
			<ul style={ STYLES.hiddenList }></ul>
			<TaskList
				ref={ listRef }
				tasks={ tasks }
				celebratingTaskIds={ celebratingTaskIds }
				onComplete={ handleComplete }
				onSnooze={ handleSnooze }
				onDelete={ handleDelete }
				onMove={ handleMove }
				onTitleChange={ handleTitleChange }
			/>
			{ hasMorePages && (
				<LoadMoreButton
					isLoading={ isLoadingMore }
					onClick={ handleLoadMore }
				/>
			) }
		</>
	);
}

// Register widget via hook with metadata
doAction( 'prpl.dashboard.registerWidget', {
	id: 'suggested-tasks',
	component: SuggestedTasks,
	priority: 10,
	width: 2,
	forceLastColumn: false,
	title: __( "Ravi's Recommendations", 'progress-planner' ), // Will be customized with branding if needed
	infoIconSvg: '', // Can be fetched from REST API if needed for branding
} );

export default SuggestedTasks;
