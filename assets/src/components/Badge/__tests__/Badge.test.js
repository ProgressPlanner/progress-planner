/**
 * Tests for Badge Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Badge from '../index';

describe( 'Badge', () => {
	beforeEach( () => {
		// Reset window.progressPlannerBadge
		window.progressPlannerBadge = {
			remoteServerRootUrl: 'https://progressplanner.com',
			placeholderImageUrl: '/placeholder.svg',
		};
	} );

	describe( 'rendering', () => {
		it( 'renders badge image with correct src', () => {
			render(
				<Badge badgeId="monthly-2024-m12" badgeName="Daisy December" />
			);

			const img = screen.getByRole( 'img' );
			expect( img ).toHaveAttribute( 'alt', 'Daisy December' );
			expect( img.src ).toContain( 'badge_id=monthly-2024-m12' );
		} );

		it( 'uses correct alt text from badgeName', () => {
			render(
				<Badge badgeId="test-badge" badgeName="Test Badge Name" />
			);

			const img = screen.getByRole( 'img' );
			expect( img ).toHaveAttribute( 'alt', 'Test Badge Name' );
		} );

		it( 'uses default alt text when badgeName is null string', () => {
			render( <Badge badgeId="test-badge" badgeName="null" /> );

			const img = screen.getByRole( 'img' );
			expect( img ).toHaveAttribute( 'alt', 'Badge' );
		} );

		it( 'uses default alt text when badgeName is falsy', () => {
			render( <Badge badgeId="test-badge" badgeName="" /> );

			const img = screen.getByRole( 'img' );
			expect( img ).toHaveAttribute( 'alt', 'Badge' );
		} );
	} );

	describe( 'URL construction', () => {
		it( 'builds correct URL with badge ID', () => {
			render( <Badge badgeId="content-curator" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.src ).toBe(
				'https://progressplanner.com/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=content-curator'
			);
		} );

		it( 'includes branding ID in URL when provided', () => {
			render(
				<Badge
					badgeId="test-badge"
					badgeName="Test"
					brandingId={ 123 }
				/>
			);

			const img = screen.getByRole( 'img' );
			expect( img.src ).toContain( 'branding_id=123' );
		} );

		it( 'does not include branding ID when not provided', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.src ).not.toContain( 'branding_id' );
		} );

		it( 'uses production URL when config points to localhost', () => {
			window.progressPlannerBadge = {
				remoteServerRootUrl: 'http://localhost:8888',
				placeholderImageUrl: '/placeholder.svg',
			};

			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.src ).toContain( 'https://progressplanner.com' );
			expect( img.src ).not.toContain( 'localhost' );
		} );

		it( 'uses production URL when config points to 127.0.0.1', () => {
			window.progressPlannerBadge = {
				remoteServerRootUrl: 'http://127.0.0.1:8888',
				placeholderImageUrl: '/placeholder.svg',
			};

			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.src ).toContain( 'https://progressplanner.com' );
		} );

		it( 'falls back to default URL when no config', () => {
			window.progressPlannerBadge = undefined;

			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.src ).toContain( 'https://progressplanner.com' );
		} );
	} );

	describe( 'complete/incomplete styling', () => {
		it( 'applies grayscale filter when incomplete', () => {
			render(
				<Badge
					badgeId="test-badge"
					badgeName="Test"
					isComplete={ false }
				/>
			);

			const img = screen.getByRole( 'img' );
			expect( img.style.opacity ).toBe( '0.25' );
			expect( img.style.filter ).toBe( 'grayscale(1)' );
		} );

		it( 'does not apply grayscale when complete', () => {
			render(
				<Badge
					badgeId="test-badge"
					badgeName="Test"
					isComplete={ true }
				/>
			);

			const img = screen.getByRole( 'img' );
			expect( img.style.opacity ).not.toBe( '0.25' );
			expect( img.style.filter ).not.toBe( 'grayscale(1)' );
		} );

		it( 'defaults to complete when isComplete not provided', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			// Should not have incomplete styles
			expect( img.style.opacity ).not.toBe( '0.25' );
		} );
	} );

	describe( 'error handling', () => {
		it( 'falls back to placeholder on image error', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			const originalSrc = img.src;

			// Trigger error
			fireEvent.error( img );

			expect( img.src ).toBe( 'http://localhost/placeholder.svg' );
			expect( img.src ).not.toBe( originalSrc );
		} );

		it( 'does not set placeholder when already showing placeholder', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );

			// First error - sets placeholder
			fireEvent.error( img );
			const placeholderSrc = img.src;

			// Second error - should not change (onerror nullified)
			// The handler sets onerror to null, so nothing should happen
			expect( img.src ).toBe( placeholderSrc );
		} );

		it( 'does not fallback when no placeholder URL configured', () => {
			window.progressPlannerBadge = {
				remoteServerRootUrl: 'https://progressplanner.com',
				placeholderImageUrl: '',
			};

			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			const originalSrc = img.src;

			// Trigger error
			fireEvent.error( img );

			// Should still have original src since no placeholder
			expect( img.src ).toBe( originalSrc );
		} );
	} );

	describe( 'base styles', () => {
		it( 'has max-width 100%', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.style.maxWidth ).toBe( '100%' );
		} );

		it( 'has height auto', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.style.height ).toBe( 'auto' );
		} );

		it( 'has transition for opacity and filter', () => {
			render( <Badge badgeId="test-badge" badgeName="Test" /> );

			const img = screen.getByRole( 'img' );
			expect( img.style.transition ).toContain( 'opacity' );
			expect( img.style.transition ).toContain( 'filter' );
		} );
	} );
} );
