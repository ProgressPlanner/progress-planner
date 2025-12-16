/**
 * Dashboard Context
 *
 * Provides shared state and actions for dashboard widgets.
 * Enables cross-widget communication without relying on window object.
 */

import {
	createContext,
	useContext,
	useReducer,
	useCallback,
	useMemo,
} from '@wordpress/element';

/**
 * Action types for the dashboard reducer.
 */
const ACTIONS = {
	TASK_COMPLETED: 'TASK_COMPLETED',
	TASK_UNCOMPLETED: 'TASK_UNCOMPLETED',
	UPDATE_ACTIVITY_SCORE: 'UPDATE_ACTIVITY_SCORE',
	UPDATE_BADGE_PROGRESS: 'UPDATE_BADGE_PROGRESS',
	SET_TASKS: 'SET_TASKS',
	ADD_TASK: 'ADD_TASK',
	REMOVE_TASK: 'REMOVE_TASK',
	INVALIDATE_CACHE: 'INVALIDATE_CACHE',
};

/**
 * Initial state for the dashboard.
 */
const initialState = {
	// Points earned in the current session.
	sessionPoints: 0,
	// Total points for current period (from API).
	totalPoints: 0,
	// Timestamp of last task completion (for animations).
	lastCompletionTime: null,
	// Last completed task info (for celebrations).
	lastCompletedTask: null,
	// Activity score data.
	activityScore: {
		current: 0,
		target: 100,
	},
	// Badge progress data (keyed by badge type).
	badgeProgress: {},
	// Cache invalidation timestamp (widgets can watch this to refetch).
	cacheInvalidatedAt: null,
};

/**
 * Dashboard reducer.
 *
 * @param {Object} state  - Current state.
 * @param {Object} action - Action object.
 * @return {Object} New state.
 */
function dashboardReducer( state, action ) {
	switch ( action.type ) {
		case ACTIONS.TASK_COMPLETED:
			return {
				...state,
				sessionPoints: state.sessionPoints + ( action.points || 0 ),
				lastCompletionTime: Date.now(),
				lastCompletedTask: action.task || null,
			};

		case ACTIONS.TASK_UNCOMPLETED:
			return {
				...state,
				sessionPoints: Math.max(
					0,
					state.sessionPoints - ( action.points || 0 )
				),
			};

		case ACTIONS.UPDATE_ACTIVITY_SCORE:
			return {
				...state,
				activityScore: {
					...state.activityScore,
					...action.payload,
				},
			};

		case ACTIONS.UPDATE_BADGE_PROGRESS:
			return {
				...state,
				badgeProgress: {
					...state.badgeProgress,
					[ action.badgeType ]: action.progress,
				},
			};

		case ACTIONS.INVALIDATE_CACHE:
			return {
				...state,
				cacheInvalidatedAt: Date.now(),
			};

		default:
			return state;
	}
}

/**
 * Dashboard Context.
 */
const DashboardContext = createContext( null );

/**
 * Dashboard Provider component.
 *
 * @param {Object} props          - Component props.
 * @param {Object} props.children - Child components.
 * @return {JSX.Element} Provider component.
 */
export function DashboardProvider( { children } ) {
	const [ state, dispatch ] = useReducer( dashboardReducer, initialState );

	/**
	 * Called when a task is completed.
	 *
	 * @param {Object} task   - The completed task.
	 * @param {number} points - Points earned.
	 */
	const onTaskCompleted = useCallback( ( task, points = 0 ) => {
		dispatch( {
			type: ACTIONS.TASK_COMPLETED,
			task,
			points,
		} );
	}, [] );

	/**
	 * Called when a task is marked incomplete (unchecked).
	 *
	 * @param {Object} task   - The task.
	 * @param {number} points - Points to subtract.
	 */
	const onTaskUncompleted = useCallback( ( task, points = 0 ) => {
		dispatch( {
			type: ACTIONS.TASK_UNCOMPLETED,
			task,
			points,
		} );
	}, [] );

	/**
	 * Update activity score.
	 *
	 * @param {Object} scoreData - Score data to update.
	 */
	const updateActivityScore = useCallback( ( scoreData ) => {
		dispatch( {
			type: ACTIONS.UPDATE_ACTIVITY_SCORE,
			payload: scoreData,
		} );
	}, [] );

	/**
	 * Update badge progress.
	 *
	 * @param {string} badgeType - Badge type identifier.
	 * @param {Object} progress  - Progress data.
	 */
	const updateBadgeProgress = useCallback( ( badgeType, progress ) => {
		dispatch( {
			type: ACTIONS.UPDATE_BADGE_PROGRESS,
			badgeType,
			progress,
		} );
	}, [] );

	/**
	 * Invalidate cache to trigger widget refetch.
	 */
	const invalidateCache = useCallback( () => {
		dispatch( { type: ACTIONS.INVALIDATE_CACHE } );
	}, [] );

	// Memoize context value to prevent unnecessary re-renders.
	const value = useMemo(
		() => ( {
			// State
			sessionPoints: state.sessionPoints,
			totalPoints: state.totalPoints,
			lastCompletionTime: state.lastCompletionTime,
			lastCompletedTask: state.lastCompletedTask,
			activityScore: state.activityScore,
			badgeProgress: state.badgeProgress,
			cacheInvalidatedAt: state.cacheInvalidatedAt,

			// Actions
			onTaskCompleted,
			onTaskUncompleted,
			updateActivityScore,
			updateBadgeProgress,
			invalidateCache,
		} ),
		[
			state,
			onTaskCompleted,
			onTaskUncompleted,
			updateActivityScore,
			updateBadgeProgress,
			invalidateCache,
		]
	);

	return (
		<DashboardContext.Provider value={ value }>
			{ children }
		</DashboardContext.Provider>
	);
}

/**
 * Hook to access dashboard context.
 *
 * @return {Object} Dashboard context value.
 * @throws {Error} If used outside DashboardProvider.
 */
export function useDashboard() {
	const context = useContext( DashboardContext );

	if ( ! context ) {
		throw new Error(
			'useDashboard must be used within a DashboardProvider'
		);
	}

	return context;
}

/**
 * Hook to subscribe to task completions.
 * Convenience hook for widgets that only need completion events.
 *
 * @return {Object} Task completion state and handler.
 */
export function useTaskCompletions() {
	const { sessionPoints, lastCompletionTime, lastCompletedTask } =
		useDashboard();

	return {
		sessionPoints,
		lastCompletionTime,
		lastCompletedTask,
	};
}

/**
 * Hook to subscribe to activity score.
 *
 * @return {Object} Activity score state and updater.
 */
export function useActivityScore() {
	const { activityScore, updateActivityScore } = useDashboard();

	return {
		activityScore,
		updateActivityScore,
	};
}

/**
 * Hook to subscribe to badge progress.
 *
 * @param {string} badgeType - Optional badge type to filter.
 * @return {Object} Badge progress state and updater.
 */
export function useBadgeProgressContext( badgeType = null ) {
	const { badgeProgress, updateBadgeProgress } = useDashboard();

	const progress = badgeType ? badgeProgress[ badgeType ] : badgeProgress;

	return {
		progress,
		updateBadgeProgress,
	};
}

export default DashboardContext;
