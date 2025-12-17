/**
 * Dashboard Store (Zustand)
 *
 * Provides shared state and actions for dashboard widgets.
 * Uses Zustand for cross-widget state management that works
 * across separate React roots (webpack entry points).
 */

import { create } from 'zustand';

/**
 * Dashboard store.
 *
 * State is automatically shared across all React roots because
 * Zustand stores are global singletons.
 */
export const useDashboardStore = create( ( set, get ) => ( {
	// State

	/**
	 * Points earned in the current session.
	 */
	sessionPoints: 0,

	/**
	 * Total points for current period (from API).
	 */
	totalPoints: 0,

	/**
	 * Timestamp of last task completion (for animations).
	 */
	lastCompletionTime: null,

	/**
	 * Last completed task info (for celebrations).
	 */
	lastCompletedTask: null,

	/**
	 * Activity score data.
	 */
	activityScore: {
		current: 0,
		target: 100,
	},

	/**
	 * Badge progress data (keyed by badge type).
	 */
	badgeProgress: {},

	/**
	 * Cache invalidation timestamp (widgets can watch this to refetch).
	 */
	cacheInvalidatedAt: null,

	/**
	 * Flag to indicate if the onboarding wizard should auto-start.
	 */
	shouldAutoStartWizard: false,

	// Actions

	/**
	 * Called when a task is completed.
	 *
	 * @param {Object} task   - The completed task.
	 * @param {number} points - Points earned.
	 */
	onTaskCompleted: ( task, points = 0 ) =>
		set( ( state ) => ( {
			sessionPoints: state.sessionPoints + points,
			lastCompletionTime: Date.now(),
			lastCompletedTask: task,
		} ) ),

	/**
	 * Called when a task is marked incomplete (unchecked).
	 *
	 * @param {Object} task   - The task.
	 * @param {number} points - Points to subtract.
	 */
	onTaskUncompleted: ( task, points = 0 ) =>
		set( ( state ) => ( {
			sessionPoints: Math.max( 0, state.sessionPoints - points ),
		} ) ),

	/**
	 * Update activity score.
	 *
	 * @param {Object} scoreData - Score data to update.
	 */
	updateActivityScore: ( scoreData ) =>
		set( ( state ) => ( {
			activityScore: {
				...state.activityScore,
				...scoreData,
			},
		} ) ),

	/**
	 * Update badge progress.
	 *
	 * @param {string} badgeType - Badge type identifier.
	 * @param {Object} progress  - Progress data.
	 */
	updateBadgeProgress: ( badgeType, progress ) =>
		set( ( state ) => ( {
			badgeProgress: {
				...state.badgeProgress,
				[ badgeType ]: progress,
			},
		} ) ),

	/**
	 * Invalidate cache to trigger widget refetch.
	 */
	invalidateCache: () => set( { cacheInvalidatedAt: Date.now() } ),

	/**
	 * Set whether the onboarding wizard should auto-start.
	 *
	 * @param {boolean} value - Whether to auto-start the wizard.
	 */
	setShouldAutoStartWizard: ( value ) => {
		console.log( '[Zustand Store] setShouldAutoStartWizard called', {
			value,
			currentState: get().shouldAutoStartWizard,
		} );
		set( { shouldAutoStartWizard: value } );
		console.log( '[Zustand Store] shouldAutoStartWizard updated to', get().shouldAutoStartWizard );
	},
} ) );

/**
 * Hook to subscribe to task completions.
 * Convenience hook for widgets that only need completion events.
 *
 * Uses Zustand's selector pattern for optimal re-renders.
 *
 * @return {Object} Task completion state.
 */
export function useTaskCompletions() {
	return useDashboardStore( ( state ) => ( {
		sessionPoints: state.sessionPoints,
		lastCompletionTime: state.lastCompletionTime,
		lastCompletedTask: state.lastCompletedTask,
	} ) );
}

/**
 * Hook to subscribe to activity score.
 *
 * @return {Object} Activity score state and updater.
 */
export function useActivityScore() {
	const activityScore = useDashboardStore( ( state ) => state.activityScore );
	const updateActivityScore = useDashboardStore(
		( state ) => state.updateActivityScore
	);

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
export function useBadgeProgressStore( badgeType = null ) {
	const badgeProgress = useDashboardStore( ( state ) => state.badgeProgress );
	const updateBadgeProgress = useDashboardStore(
		( state ) => state.updateBadgeProgress
	);

	const progress = badgeType ? badgeProgress[ badgeType ] : badgeProgress;

	return {
		progress,
		updateBadgeProgress,
	};
}

export default useDashboardStore;
