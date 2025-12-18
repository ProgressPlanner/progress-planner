/**
 * Dashboard Store (Zustand)
 *
 * Provides shared state and actions for dashboard widgets.
 * Uses Zustand for cross-widget state management that works
 * across separate React roots (webpack entry points).
 */

import { create } from 'zustand';
import apiFetch from '@wordpress/api-fetch';

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

	/**
	 * Provider taxonomy terms (keyed by slug).
	 * Used to get term IDs for task creation.
	 */
	providerTerms: {},

	/**
	 * Whether provider terms are being loaded.
	 */
	termsLoading: false,

	/**
	 * Whether provider terms have been loaded.
	 */
	termsLoaded: false,

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
		set( { shouldAutoStartWizard: value } );
	},

	/**
	 * Get provider term ID by slug.
	 *
	 * @param {string} slug - The term slug (e.g., 'user').
	 * @return {number|null} The term ID, or null if not found.
	 */
	getProviderTermId: ( slug ) => {
		const state = get();
		return state.providerTerms[ slug ]?.id || null;
	},

	/**
	 * Fetch provider taxonomy terms from REST API.
	 * Creates 'user' term if it doesn't exist (matches develop branch behavior).
	 *
	 * @return {Promise<Object>} Promise resolving to terms object.
	 */
	fetchProviderTerms: async () => {
		const state = get();
		if ( state.termsLoaded || state.termsLoading ) {
			return state.providerTerms;
		}

		set( { termsLoading: true } );

		try {
			const data = await apiFetch( {
				path: '/wp/v2/prpl_recommendations_provider?per_page=100',
			} );

			const terms = {};
			let userTermFound = false;

			data.forEach( ( term ) => {
				terms[ term.slug ] = term;
				if ( term.slug === 'user' ) {
					userTermFound = true;
				}
			} );

			// If 'user' term doesn't exist, create it (matches develop branch)
			if ( ! userTermFound ) {
				try {
					const newTerm = await apiFetch( {
						path: '/wp/v2/prpl_recommendations_provider',
						method: 'POST',
						data: { slug: 'user', name: 'user' },
					} );
					terms.user = newTerm;
				} catch ( createError ) {
					// eslint-disable-next-line no-console
					console.error( 'Error creating user term:', createError );
				}
			}

			set( {
				providerTerms: terms,
				termsLoading: false,
				termsLoaded: true,
			} );
			return terms;
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error fetching provider terms:', error );
			set( { termsLoading: false } );
			return {};
		}
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
