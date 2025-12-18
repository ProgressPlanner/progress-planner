/**
 * Suggested Tasks Widget Component.
 *
 * Displays a list of suggested tasks (recommendations) for improving the site.
 * Uses lazy evaluation to load tasks on-demand for better performance.
 */

import {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from '@wordpress/element';
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
import { getTaskPoints } from '../../utils/taskUtils';
import WidgetHeader from '../../components/WidgetHeader';
import SuggestedTasksSkeleton from './SuggestedTasksSkeleton';
import {
	evaluateTasksUntil,
	hasMoreTasksToEvaluate,
	getBufferSize,
	getTaskProviderInstance,
} from '../../services/taskRegistry';
import { useDashboardStore } from '../../stores/dashboardStore';

// Import task registrations (tasks will self-register on import).
import '../../tasks';

// Configuration constants for task limiting
const TASKS_INITIAL_LIMIT = 5;
const TASKS_LOAD_INCREMENT = 5;

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
	const [ visibleTaskLimit, setVisibleTaskLimit ] =
		useState( TASKS_INITIAL_LIMIT );
	const [ celebratingTaskIds, setCelebratingTaskIds ] = useState( new Set() );
	const [ hasMoreToEvaluate, setHasMoreToEvaluate ] = useState( true );
	const listRef = useRef( null );
	const tasksMapRef = useRef( new Map() ); // Map of task ID to task object for quick lookup
	const evaluatedCountRef = useRef( 0 ); // Track how many tasks we've evaluated and added

	// Derive visible tasks and button states
	const visibleTasks = useMemo( () => {
		return tasks.slice( 0, visibleTaskLimit );
	}, [ tasks, visibleTaskLimit ] );

	// Calculate skeleton count for progressive loading
	// Show skeletons only when we have tasks but haven't filled the initial limit yet
	const skeletonCount = useMemo( () => {
		if ( isLoading || ! hasMoreToEvaluate ) {
			return 0;
		}
		return Math.max( 0, TASKS_INITIAL_LIMIT - visibleTasks.length );
	}, [ isLoading, hasMoreToEvaluate, visibleTasks.length ] );

	const hasMoreTasks = hasMoreToEvaluate || tasks.length > visibleTaskLimit;
	const isShowingAll =
		visibleTaskLimit >= tasks.length && ! hasMoreToEvaluate;
	const canCollapse =
		visibleTaskLimit > TASKS_INITIAL_LIMIT &&
		isShowingAll &&
		tasks.length > TASKS_INITIAL_LIMIT;

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
		let providerId =
			taskData.prpl_provider?.slug ||
			taskData.provider_id ||
			taskData.meta?.provider_id ||
			'';

		// Fallback: Use task slug as provider ID
		if ( ! providerId && taskData.slug ) {
			providerId = taskData.slug;
		}

		// Fallback: Try to get provider from embedded taxonomy terms
		if (
			! providerId &&
			taskData.prpl_recommendations_provider &&
			Array.isArray( taskData.prpl_recommendations_provider )
		) {
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
			return taskData;
		}

		const providerInstance = getTaskProviderInstance( providerId );
		if ( ! providerInstance || ! providerInstance.getTaskActions ) {
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
		} catch ( error ) {
			console.error(
				`Error generating actions for task provider "${ providerId }":`,
				error
			);
		}

		return taskData;
	}, [] );

	/**
	 * Add a task to the state.
	 *
	 * @param {Object} taskData Task data.
	 * @param {number} priority Task priority.
	 */
	const addTask = useCallback(
		( taskData, priority ) => {
			// Skip if already in state
			if ( tasksMapRef.current.has( taskData.id ) ) {
				return;
			}

			// Add priority to task data if not present
			if ( taskData.prpl_priority === undefined ) {
				taskData.prpl_priority = priority;
			}

			// Ensure task actions are generated
			const taskWithActions = ensureTaskActions( taskData );

			// Insert in sorted position
			setTasks( ( prev ) =>
				insertTaskSorted( prev, taskWithActions, priority )
			);

			evaluatedCountRef.current++;
		},
		[ ensureTaskActions, insertTaskSorted ]
	);

	/**
	 * Evaluate more tasks until we have enough.
	 *
	 * @param {number} targetCount Target number of tasks needed.
	 * @return {Promise<void>}
	 */
	const evaluateMoreTasks = useCallback(
		async ( targetCount ) => {
			if ( ! hasMoreTasksToEvaluate() ) {
				setHasMoreToEvaluate( false );
				return;
			}

			const needed = targetCount - evaluatedCountRef.current;
			if ( needed <= 0 ) {
				return;
			}

			const result = await evaluateTasksUntil( needed, addTask );
			setHasMoreToEvaluate( ! result.complete );
		},
		[ addTask ]
	);

	/**
	 * Fetch a replacement task after completing/snoozing/deleting.
	 * Uses lazy evaluation to get the next task if available.
	 *
	 * @return {Promise<void>}
	 */
	const fetchAndInsertReplacementTask = useCallback( async () => {
		// First, check if we have buffered tasks ready
		const bufferSize = getBufferSize();
		const currentBuffer = tasks.length - visibleTaskLimit;

		// If buffer is depleted and more tasks are available, evaluate more
		if ( currentBuffer <= 0 && hasMoreToEvaluate ) {
			await evaluateMoreTasks(
				evaluatedCountRef.current + bufferSize + 1
			);
		}
	}, [
		tasks.length,
		visibleTaskLimit,
		hasMoreToEvaluate,
		evaluateMoreTasks,
	] );

	/**
	 * Initialize tasks with lazy evaluation.
	 */
	useEffect( () => {
		let mounted = true;

		async function initializeTasks() {
			setIsLoading( true );

			// Handle pending celebration tasks first
			if ( ! config?.delayCelebration ) {
				try {
					const pendingResult = await fetchTasks( {
						status: 'pending',
						perPage: 100,
						excludeProvider: 'user',
					} );

					if ( pendingResult.tasks.length > 0 && mounted ) {
						// Add pending tasks to the list
						pendingResult.tasks.forEach( ( task ) => {
							addTask( task, task.prpl_priority || 50 );
						} );

						// Trash the pending tasks in the background
						pendingResult.tasks.forEach( ( task ) => {
							completeTask( task.id ).catch( () => {} );
						} );

						// Trigger celebration after 3 seconds
						setTimeout( () => {
							if ( ! mounted ) {
								return;
							}
							const pendingIds = new Set(
								pendingResult.tasks.map( ( t ) => t.id )
							);
							setCelebratingTaskIds( pendingIds );
							celebrate( listRef.current );

							// Remove celebrated tasks after animation
							setTimeout( () => {
								if ( ! mounted ) {
									return;
								}
								setTasks( ( prev ) =>
									prev.filter(
										( t ) => ! pendingIds.has( t.id )
									)
								);
								pendingIds.forEach( ( id ) => {
									tasksMapRef.current.delete( id );
									evaluatedCountRef.current--;
								} );
								setCelebratingTaskIds( new Set() );
								dispatchGridResize();
							}, 2000 );
						}, 3000 );
					}
				} catch {
					// Continue with evaluation even if pending fetch fails
				}
			}

			// Evaluate tasks lazily until we have initial + buffer
			const targetCount = TASKS_INITIAL_LIMIT + getBufferSize();
			let firstTaskShown = false;

			const result = await evaluateTasksUntil(
				targetCount,
				( taskData, priority ) => {
					if ( mounted ) {
						addTask( taskData, priority );

						// Show widget after first task instead of waiting for all
						if ( ! firstTaskShown ) {
							firstTaskShown = true;
							setIsLoading( false );
							dispatchGridResize( 100 );
						}
					}
				}
			);

			if ( mounted ) {
				setHasMoreToEvaluate( ! result.complete );
				// Only set loading false here if no tasks were found at all
				if ( ! firstTaskShown ) {
					setIsLoading( false );
					dispatchGridResize( 100 );
				}
			}
		}

		initializeTasks();

		return () => {
			mounted = false;
		};
	}, [ config, celebrate, addTask ] );

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
				const eventPoints = getTaskPoints( task );

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

					// Evaluate more tasks to refill buffer.
					await fetchAndInsertReplacementTask();

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
		[ celebrate, fetchAndInsertReplacementTask, onTaskCompleted ]
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

				// Evaluate more tasks to refill buffer.
				await fetchAndInsertReplacementTask();

				// Trigger grid resize.
				dispatchGridResize();
			} catch {
				// Error handled silently.
			}
		},
		[ fetchAndInsertReplacementTask ]
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

				// Evaluate more tasks to refill buffer.
				await fetchAndInsertReplacementTask();

				// Trigger grid resize.
				dispatchGridResize( 500 );
			} catch {
				// Error handled silently.
			}
		},
		[ fetchAndInsertReplacementTask ]
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
	 * Shows more tasks and evaluates more if needed.
	 */
	const handleLoadMore = useCallback( async () => {
		const newLimit = visibleTaskLimit + TASKS_LOAD_INCREMENT;
		setVisibleTaskLimit( newLimit );

		// Evaluate more tasks if needed to fill buffer
		const bufferSize = getBufferSize();
		const targetCount = newLimit + bufferSize;

		if ( evaluatedCountRef.current < targetCount && hasMoreToEvaluate ) {
			await evaluateMoreTasks( targetCount );
		}

		// Trigger grid resize after showing more tasks
		dispatchGridResize( 100 );
	}, [ visibleTaskLimit, hasMoreToEvaluate, evaluateMoreTasks ] );

	/**
	 * Handle collapse button click.
	 * Resets the visible task limit to show only the initial tasks.
	 */
	const handleCollapse = useCallback( () => {
		setVisibleTaskLimit( TASKS_INITIAL_LIMIT );
		// Trigger grid resize after collapsing
		dispatchGridResize( 100 );
	}, [] );

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
	if ( tasks.length === 0 && ! hasMoreToEvaluate ) {
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
				tasks={ visibleTasks }
				celebratingTaskIds={ celebratingTaskIds }
				skeletonCount={ skeletonCount }
				onComplete={ handleComplete }
				onSnooze={ handleSnooze }
				onDelete={ handleDelete }
				onMove={ handleMove }
				onTitleChange={ handleTitleChange }
			/>
			<LoadMoreButton
				hasMore={ hasMoreTasks }
				canCollapse={ canCollapse }
				onLoadMore={ handleLoadMore }
				onCollapse={ handleCollapse }
			/>
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
	title: __( "Ravi's Recommendations", 'progress-planner' ),
	infoIconSvg: '',
} );

export default SuggestedTasks;
