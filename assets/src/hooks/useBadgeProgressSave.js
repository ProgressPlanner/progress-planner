/**
 * useBadgeProgressSave Hook
 *
 * Automatically saves badge progress to the API when it changes.
 * Mirrors the PHP behavior where progress was saved after calculation.
 */

import { useEffect, useRef } from '@wordpress/element';
import { saveBadgeStats } from '../services/badgeService';

/**
 * Custom hook for automatically saving badge progress.
 *
 * @param {Object} badgeProgress - Calculated badge progress.
 * @param {Object} savedStats - Previously saved badge stats.
 * @return {void}
 */
export function useBadgeProgressSave( badgeProgress, savedStats ) {
	const previousProgressRef = useRef( {} );
	const isSavingRef = useRef( false );

	useEffect( () => {
		// Don't save if already saving or if progress hasn't changed.
		if ( isSavingRef.current || ! badgeProgress || Object.keys( badgeProgress ).length === 0 ) {
			return;
		}

		// Check if progress has changed and needs to be saved.
		const progressToSave = {};
		let hasChanges = false;

		Object.keys( badgeProgress ).forEach( ( badgeId ) => {
			const current = badgeProgress[ badgeId ];
			const previous = previousProgressRef.current[ badgeId ];
			const saved = savedStats[ badgeId ];

			// Save if:
			// 1. Progress changed from previous calculation
			// 2. Badge is newly completed (progress >= 100 and wasn't before)
			// 3. Progress is different from saved stats
			const progressChanged =
				! previous ||
				previous.progress !== current.progress ||
				previous.remaining !== current.remaining;

			const newlyCompleted =
				current.progress >= 100 &&
				( ! saved || ( saved.progress ?? 0 ) < 100 );

			const differentFromSaved =
				! saved ||
				saved.progress !== current.progress ||
				saved.remaining !== current.remaining;

			if ( progressChanged || newlyCompleted || differentFromSaved ) {
				progressToSave[ badgeId ] = {
					progress: current.progress,
					remaining: current.remaining,
					...( current.points !== undefined && { points: current.points } ),
				};

				// If badge is newly completed, the API will add the completion date.
				hasChanges = true;
			}
		} );

		// Save if there are changes.
		if ( hasChanges && Object.keys( progressToSave ).length > 0 ) {
			isSavingRef.current = true;

			saveBadgeStats( progressToSave )
				.catch( ( error ) => {
					// Silently fail - progress will be recalculated on next load.
					// eslint-disable-next-line no-console
					console.warn( 'Failed to save badge progress:', error );
				} )
				.finally( () => {
					isSavingRef.current = false;
				} );
		}

		// Update previous progress reference.
		previousProgressRef.current = { ...badgeProgress };
	}, [ badgeProgress, savedStats ] );
}

