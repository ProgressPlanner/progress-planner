/**
 * Tests for PopoverManager Component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/element', () => ( {
	...jest.requireActual( '@wordpress/element' ),
	useState: jest.requireActual( '@wordpress/element' ).useState,
	useCallback: jest.requireActual( '@wordpress/element' ).useCallback,
} ) );

// Mock hooks
jest.mock( '../../../hooks/usePopoverHooks', () => ( {
	usePopoverHooks: jest.fn(),
} ) );

jest.mock( '../../../hooks/useCustomSubmitHandlers', () => ( {
	useCustomSubmitHandlers: jest.fn( () => null ),
} ) );

jest.mock( '../../../utils/taskIdResolver', () => ( {
	resolveTaskId: jest.fn( ( task, popoverId ) => task?.slug || popoverId ),
} ) );

jest.mock( '../../../components/Popovers/popoverRegistry', () => ( {
	getPopoverComponent: jest.fn(),
} ) );

// Import after mocks
import PopoverManager from '../PopoverManager';
import { usePopoverHooks } from '../../../hooks/usePopoverHooks';
import { useCustomSubmitHandlers } from '../../../hooks/useCustomSubmitHandlers';
import { resolveTaskId } from '../../../utils/taskIdResolver';
import { getPopoverComponent } from '../../../components/Popovers/popoverRegistry';

describe( 'PopoverManager', () => {
	const mockTask = {
		id: 123,
		slug: 'test-task',
		title: { rendered: 'Test Task' },
	};

	const MockPopoverComponent = ( props ) => (
		<div data-testid="mock-popover">
			<span data-testid="popover-task-id">{ props.task?.id }</span>
			<button
				data-testid="popover-submit"
				onClick={ () => props.onSubmit( props.task?.id, props.task ) }
			>
				Submit
			</button>
			<button data-testid="popover-close" onClick={ props.onClose }>
				Close
			</button>
		</div>
	);

	let capturedOpenHandler;
	let capturedCloseHandler;

	beforeEach( () => {
		jest.clearAllMocks();

		// Capture the handlers passed to usePopoverHooks
		usePopoverHooks.mockImplementation( ( openHandler, closeHandler ) => {
			capturedOpenHandler = openHandler;
			capturedCloseHandler = closeHandler;
		} );

		// Default: no popover component registered
		getPopoverComponent.mockReturnValue( null );
	} );

	describe( 'initial render', () => {
		it( 'renders null when no popover is open', () => {
			const { container } = render( <PopoverManager /> );

			expect( container.firstChild ).toBeNull();
		} );

		it( 'sets up popover hooks on mount', () => {
			render( <PopoverManager /> );

			expect( usePopoverHooks ).toHaveBeenCalledWith(
				expect.any( Function ),
				expect.any( Function )
			);
		} );

		it( 'calls useCustomSubmitHandlers with null initially', () => {
			render( <PopoverManager /> );

			expect( useCustomSubmitHandlers ).toHaveBeenCalledWith( null );
		} );
	} );

	describe( 'popover opening', () => {
		it( 'renders popover component when opened with valid task', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			// Trigger popover open
			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( screen.getByTestId( 'mock-popover' ) ).toBeInTheDocument();
		} );

		it( 'passes task to popover component', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( screen.getByTestId( 'popover-task-id' ) ).toHaveTextContent(
				'123'
			);
		} );

		it( 'does not open popover when taskId is missing', () => {
			const consoleWarn = jest
				.spyOn( console, 'warn' )
				.mockImplementation();
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( null, mockTask );
			} );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
			expect( consoleWarn ).toHaveBeenCalledWith(
				expect.stringContaining( 'Invalid popover open event' )
			);

			consoleWarn.mockRestore();
		} );

		it( 'does not open popover when task is missing', () => {
			const consoleWarn = jest
				.spyOn( console, 'warn' )
				.mockImplementation();
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', null );
			} );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
			expect( consoleWarn ).toHaveBeenCalledWith(
				expect.stringContaining( 'Invalid popover open event' )
			);

			consoleWarn.mockRestore();
		} );
	} );

	describe( 'popover closing', () => {
		it( 'closes popover when close handler is called with matching taskId', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			// Open popover
			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( screen.getByTestId( 'mock-popover' ) ).toBeInTheDocument();

			// Close popover
			act( () => {
				capturedCloseHandler( 'test-task' );
			} );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
		} );

		it( 'closes popover when close handler is called with null taskId', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			act( () => {
				capturedCloseHandler( null );
			} );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
		} );

		it( 'does not close popover when close handler is called with different taskId', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			act( () => {
				capturedCloseHandler( 'different-task' );
			} );

			expect( screen.getByTestId( 'mock-popover' ) ).toBeInTheDocument();
		} );

		it( 'closes popover when onClose prop is called', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			fireEvent.click( screen.getByTestId( 'popover-close' ) );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'popover submission', () => {
		it( 'calls onComplete when popover is submitted', async () => {
			const onComplete = jest.fn().mockResolvedValue( undefined );
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager onComplete={ onComplete } /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'popover-submit' ) );
			} );

			expect( onComplete ).toHaveBeenCalledWith( 123, mockTask );
		} );

		it( 'closes popover after successful submission', async () => {
			const onComplete = jest.fn().mockResolvedValue( undefined );
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager onComplete={ onComplete } /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'popover-submit' ) );
			} );

			expect(
				screen.queryByTestId( 'mock-popover' )
			).not.toBeInTheDocument();
		} );

		it( 'keeps popover open on submission error', async () => {
			const consoleError = jest
				.spyOn( console, 'error' )
				.mockImplementation();
			const onComplete = jest
				.fn()
				.mockRejectedValue( new Error( 'Submit failed' ) );
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager onComplete={ onComplete } /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'popover-submit' ) );
			} );

			expect( screen.getByTestId( 'mock-popover' ) ).toBeInTheDocument();
			expect( consoleError ).toHaveBeenCalled();

			consoleError.mockRestore();
		} );

		it( 'warns when onComplete is not provided', async () => {
			const consoleWarn = jest
				.spyOn( console, 'warn' )
				.mockImplementation();
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			await act( async () => {
				fireEvent.click( screen.getByTestId( 'popover-submit' ) );
			} );

			expect( consoleWarn ).toHaveBeenCalledWith(
				expect.stringContaining( 'onComplete callback not provided' )
			);

			consoleWarn.mockRestore();
		} );
	} );

	describe( 'component lookup', () => {
		it( 'uses resolveTaskId to look up popover component', () => {
			getPopoverComponent.mockReturnValue( MockPopoverComponent );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( resolveTaskId ).toHaveBeenCalledWith(
				mockTask,
				'test-task'
			);
		} );

		it( 'logs warning when no component found for task', () => {
			const consoleWarn = jest
				.spyOn( console, 'warn' )
				.mockImplementation();
			getPopoverComponent.mockReturnValue( null );

			render( <PopoverManager /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( consoleWarn ).toHaveBeenCalledWith(
				expect.stringContaining( 'No popover component found' ),
				expect.any( String )
			);

			consoleWarn.mockRestore();
		} );
	} );

	describe( 'config passing', () => {
		it( 'passes config to popover component', () => {
			const config = { customOption: true };
			const ConfigAwarePopover = ( props ) => (
				<div
					data-testid="config-popover"
					data-config={ JSON.stringify( props.config ) }
				/>
			);
			getPopoverComponent.mockReturnValue( ConfigAwarePopover );

			render( <PopoverManager config={ config } /> );

			act( () => {
				capturedOpenHandler( 'test-task', mockTask );
			} );

			expect( screen.getByTestId( 'config-popover' ) ).toHaveAttribute(
				'data-config',
				JSON.stringify( config )
			);
		} );
	} );
} );
