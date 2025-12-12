/**
 * useBadgeProgress Hook
 *
 * Custom hook for calculating badge progress from activities and saved stats.
 * Handles caching and progress calculation logic.
 */

import { useMemo } from '@wordpress/element';
import {
	calculateContentBadgeProgress,
	calculateMaintenanceBadgeProgress,
	calculateMonthlyBadgeProgress,
} from '../utils/badgeCalculations';
import { getBadgeById } from '../config/badges';

/**
 * Custom hook for calculating badge progress.
 *
 * @param {Object}   params                          - Parameters.
 * @param {Array}    params.activities               - Array of activity objects.
 * @param {Object}   params.savedStats               - Saved badge progress stats from API.
 * @param {number}   params.totalPostsCount          - Total number of published posts/pages.
 * @param {Date}     params.activationDate           - Plugin activation date.
 * @param {Function} params.getMonthlyBadgeDateRange - Function to get date range for monthly badge.
 * @return {Object} Badge progress data.
 */
export function useBadgeProgress( {
	activities = [],
	savedStats = {},
	totalPostsCount = 0,
	activationDate = null,
	getMonthlyBadgeDateRange = null,
} ) {
	return useMemo( () => {
		if ( ! activationDate ) {
			return {};
		}

		const badgeProgress = {};

		// Process content badges.
		const contentBadges = [
			'content-curator',
			'revision-ranger',
			'purposeful-publisher',
		];

		contentBadges.forEach( ( badgeId ) => {
			const badge = getBadgeById( badgeId );
			if ( ! badge ) {
				return;
			}

			// Check if we have saved progress (and it's recent for content badges).
			const saved = savedStats[ badgeId ];
			if ( saved && saved.progress && saved.remaining !== undefined ) {
				// For content badges, if already complete, use saved value.
				if ( saved.progress >= 100 ) {
					badgeProgress[ badgeId ] = {
						progress: saved.progress,
						remaining: saved.remaining,
					};
					return;
				}
			}

			// Calculate progress.
			const progress = calculateContentBadgeProgress(
				badge,
				activities,
				totalPostsCount,
				activationDate
			);

			badgeProgress[ badgeId ] = progress;
		} );

		// Process maintenance badges.
		const maintenanceBadges = [
			'progress-padawan',
			'maintenance-maniac',
			'super-site-specialist',
		];

		maintenanceBadges.forEach( ( badgeId ) => {
			const badge = getBadgeById( badgeId );
			if ( ! badge ) {
				return;
			}

			// Check if we have saved progress.
			const saved = savedStats[ badgeId ];
			if ( saved && saved.progress && saved.remaining !== undefined ) {
				// For maintenance badges, if complete, use saved value.
				if ( saved.progress >= 100 ) {
					badgeProgress[ badgeId ] = {
						progress: saved.progress,
						remaining: saved.remaining,
					};
					return;
				}

				// Check if saved progress is recent (within 2 days).
				if ( saved.date ) {
					const savedDate = new Date( saved.date );
					const now = new Date();
					const diffDays =
						( now - savedDate ) / ( 1000 * 60 * 60 * 24 );
					if ( diffDays <= 2 ) {
						badgeProgress[ badgeId ] = {
							progress: saved.progress,
							remaining: saved.remaining,
						};
						return;
					}
				}
			}

			// Calculate progress.
			const progress = calculateMaintenanceBadgeProgress(
				badge,
				activities,
				activationDate
			);

			badgeProgress[ badgeId ] = progress;
		} );

		// Process monthly badges if date range function is provided.
		if ( getMonthlyBadgeDateRange ) {
			// Get all monthly badge IDs from saved stats or generate for current/previous months.
			const monthlyBadgeIds = new Set();

			// Add badges from saved stats.
			Object.keys( savedStats ).forEach( ( badgeId ) => {
				if ( badgeId.startsWith( 'monthly-' ) ) {
					monthlyBadgeIds.add( badgeId );
				}
			} );

			// Add current month badge.
			const now = new Date();
			const currentMonthId = `monthly-${ now.getFullYear() }-m${
				now.getMonth() + 1
			}`;
			monthlyBadgeIds.add( currentMonthId );

			// Add previous 12 months to check for incomplete badges.
			for ( let i = 1; i <= 12; i++ ) {
				const checkDate = new Date(
					now.getFullYear(),
					now.getMonth() - i,
					1
				);
				const badgeId = `monthly-${ checkDate.getFullYear() }-m${
					checkDate.getMonth() + 1
				}`;
				monthlyBadgeIds.add( badgeId );
			}

			// Process each monthly badge.
			monthlyBadgeIds.forEach( ( badgeId ) => {
				const badge = getBadgeById( badgeId );
				if ( ! badge ) {
					return;
				}

				const dateRange = getMonthlyBadgeDateRange( badgeId );
				if ( ! dateRange ) {
					return;
				}

				const { startDate, endDate } = dateRange;

				// Check if we have saved progress and badge is complete.
				const saved = savedStats[ badgeId ];
				if (
					saved &&
					saved.progress &&
					saved.remaining !== undefined &&
					saved.points !== undefined &&
					saved.progress >= 100
				) {
					badgeProgress[ badgeId ] = {
						progress: saved.progress,
						remaining: saved.remaining,
						points: saved.points,
					};
					return;
				}

				// Calculate progress.
				const progress = calculateMonthlyBadgeProgress(
					badge,
					activities,
					startDate,
					endDate,
					10, // TARGET_POINTS
					{ noNextBadgePoints: false }
				);

				badgeProgress[ badgeId ] = progress;
			} );
		}

		return badgeProgress;
	}, [
		activities,
		savedStats,
		totalPostsCount,
		activationDate,
		getMonthlyBadgeDateRange,
	] );
}
