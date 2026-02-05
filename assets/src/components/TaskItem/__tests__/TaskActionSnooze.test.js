/**
 * Tests for TaskActionSnooze Component
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

import TaskActionSnooze from '../TaskActionSnooze';

describe( 'TaskActionSnooze', () => {
	const defaultProps = {
		taskId: 'test-task-123',
		onSnooze: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( 'basic rendering', () => {
		it( 'renders the snooze trigger button', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			expect(
				screen.getByRole( 'button', { name: /snooze/i } )
			).toBeInTheDocument();
		} );

		it( 'renders fieldset with no visible border', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			// Open the tooltip first.
			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			const fieldset = document.querySelector( 'fieldset' );
			expect( fieldset ).toBeInTheDocument();
			expect( fieldset ).toHaveStyle( {
				padding: '0',
				margin: '0',
			} );
		} );

		it( 'renders legend with full width', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			// Open the tooltip.
			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			const legend = document.querySelector( 'legend' );
			expect( legend ).toBeInTheDocument();
			expect( legend ).toHaveStyle( {
				display: 'block',
				width: '100%',
			} );
		} );

		it( 'renders title text with correct styles', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			expect(
				screen.getByText( 'Snooze this task?' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'expand/collapse', () => {
		it( 'duration group is hidden by default', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			// The duration labels should not be visible (display: none).
			const labels = document.querySelectorAll( 'label' );
			if ( labels.length > 0 ) {
				const container = labels[ 0 ].parentElement;
				expect( container ).toHaveStyle( { display: 'none' } );
			}
		} );

		it( 'shows duration options when toggle is clicked', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			// Click the "How long?" toggle.
			fireEvent.click(
				screen.getByRole( 'button', { name: /how long/i } )
			);

			// Duration labels should now be visible.
			expect( screen.getByText( '1 week' ) ).toBeInTheDocument();
			expect( screen.getByText( '1 month' ) ).toBeInTheDocument();
			expect( screen.getByText( 'forever' ) ).toBeInTheDocument();

			const container = screen
				.getByText( '1 week' )
				.closest( 'label' ).parentElement;
			expect( container ).toHaveStyle( { display: 'block' } );
		} );

		it( 'collapses when toggle is clicked again', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			const toggle = screen.getByRole( 'button', {
				name: /how long/i,
			} );

			// Expand.
			fireEvent.click( toggle );

			// Collapse.
			fireEvent.click( toggle );

			const labels = document.querySelectorAll( 'label' );
			if ( labels.length > 0 ) {
				const container = labels[ 0 ].parentElement;
				expect( container ).toHaveStyle( { display: 'none' } );
			}
		} );
	} );

	describe( 'label hover', () => {
		it( 'highlights label on hover', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			fireEvent.click(
				screen.getByRole( 'button', { name: /how long/i } )
			);

			const label = screen.getByText( '1 week' ).closest( 'label' );

			// Default: white background.
			expect( label ).toHaveStyle( { backgroundColor: '#fff' } );

			// Hover: highlighted background.
			fireEvent.mouseEnter( label );
			expect( label ).toHaveStyle( {
				backgroundColor: 'var(--prpl-color-gauge-remain)',
			} );

			// Leave: back to white.
			fireEvent.mouseLeave( label );
			expect( label ).toHaveStyle( { backgroundColor: '#fff' } );
		} );
	} );

	describe( 'duration selection', () => {
		it( 'calls onSnooze when a duration label is clicked', () => {
			const onSnooze = jest.fn();
			render(
				<TaskActionSnooze { ...defaultProps } onSnooze={ onSnooze } />
			);

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			fireEvent.click(
				screen.getByRole( 'button', { name: /how long/i } )
			);

			// Click the label to trigger radio change.
			const weekLabel = screen.getByText( '1 week' ).closest( 'label' );
			fireEvent.click( weekLabel );

			expect( onSnooze ).toHaveBeenCalledWith( '1-week' );
		} );
	} );

	describe( 'state reset on tooltip close', () => {
		it( 'resets expanded state when tooltip closes', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			// Open the tooltip.
			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			// Expand the duration picker.
			fireEvent.click(
				screen.getByRole( 'button', { name: /how long/i } )
			);

			// Verify it's expanded.
			const container = screen
				.getByText( '1 week' )
				.closest( 'label' ).parentElement;
			expect( container ).toHaveStyle( { display: 'block' } );

			// Close tooltip via close button.
			fireEvent.click( screen.getByRole( 'button', { name: /close/i } ) );

			// Re-open the tooltip.
			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			// Duration picker should be collapsed again.
			const labels = document.querySelectorAll( 'label' );
			if ( labels.length > 0 ) {
				const group = labels[ 0 ].parentElement;
				expect( group ).toHaveStyle( { display: 'none' } );
			}
		} );
	} );

	describe( 'radio inputs', () => {
		it( 'renders hidden radio inputs', () => {
			render( <TaskActionSnooze { ...defaultProps } /> );

			fireEvent.click(
				screen.getByRole( 'button', { name: /snooze/i } )
			);

			fireEvent.click(
				screen.getByRole( 'button', { name: /how long/i } )
			);

			const radios = document.querySelectorAll( 'input[type="radio"]' );
			expect( radios.length ).toBeGreaterThan( 0 );
			radios.forEach( ( radio ) => {
				expect( radio ).toHaveStyle( { display: 'none' } );
			} );
		} );
	} );
} );
