/**
 * Tests for SuggestedTasks Widget
 */

import { render, screen, act } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
	sprintf: ( format, ...args ) => {
		let result = format;
		args.forEach( ( arg ) => {
			result = result.replace( '%s', arg );
		} );
		return result;
	},
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useTasksApi', () => ( {
	fetchTasks: jest.fn(),
	completeTask: jest.fn(),
	snoozeTask: jest.fn(),
	deleteTask: jest.fn(),
	updateTask: jest.fn(),
	sendTaskAction: jest.fn(),
} ) );

jest.mock( '../../../hooks/useGridMasonry', () => ( {
	useGridMasonry: jest.fn(),
} ) );

jest.mock( '../../../hooks/useCelebration', () => ( {
	useCelebration: jest.fn( () => ( {
		celebrate: jest.fn(),
	} ) ),
} ) );

jest.mock( '../../../utils/gridResize', () => ( {
	dispatchGridResize: jest.fn(),
} ) );

jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => jest.fn() ),
} ) );

jest.mock( '../../../services/taskRegistry', () => ( {
	setTaskRenderCallback: jest.fn(),
	getTaskProviderInstance: jest.fn(),
} ) );

// Mock tasks registration
jest.mock( '../../../tasks', () => ( {} ) );

// Mock child components
jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header">{ props.title }</div>
) );

jest.mock( '../PopoverManager', () => () => (
	<div data-testid="popover-manager">PopoverManager</div>
) );

jest.mock( '../TaskList', () => {
	// Use forwardRef to handle ref properly
	const React = require( 'react' ); // eslint-disable-line import/no-extraneous-dependencies
	return React.forwardRef( ( props, ref ) => (
		<ul
			data-testid="task-list"
			ref={ ref }
			data-task-count={ props.tasks?.length || 0 }
		>
			{ props.tasks?.map( ( task ) => (
				<li key={ task.id } data-task-id={ task.id }>
					{ task.title?.rendered || task.title }
				</li>
			) ) }
		</ul>
	) );
} );

jest.mock( '../LoadMoreButton', () => ( props ) => (
	<button
		data-testid="load-more-button"
		data-loading={ props.isLoading }
		onClick={ props.onClick }
	>
		Load More
	</button>
) );

// Import after mocks
import SuggestedTasks from '../index';
import { fetchTasks } from '../../../hooks/useTasksApi';
import { setTaskRenderCallback } from '../../../services/taskRegistry';

describe( 'SuggestedTasks', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		// Default: pending tasks returns empty, triggers loading false
		fetchTasks.mockResolvedValue( {
			tasks: [],
			hasMore: false,
			total: 0,
		} );
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( 'loading state', () => {
		it( 'renders loading state initially', () => {
			// Prevent fetchTasks from resolving immediately
			fetchTasks.mockImplementation( () => new Promise( () => {} ) );

			render( <SuggestedTasks /> );

			// During loading, the widget header is rendered with skeleton
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Task list should not be rendered during loading
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );

		it( 'shows widget header during loading', () => {
			fetchTasks.mockImplementation( () => new Promise( () => {} ) );

			render( <SuggestedTasks /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'shows skeleton during loading', () => {
			fetchTasks.mockImplementation( () => new Promise( () => {} ) );

			render( <SuggestedTasks /> );

			// Widget header should be present
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Task list is not rendered during loading (skeleton is shown instead)
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'empty state', () => {
		it( 'shows empty message when no tasks', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			// Advance timers inside act to properly handle state updates
			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			// Text is split by <br> so use regex to match partial content
			expect(
				screen.getByText( /You have completed all recommended tasks/ )
			).toBeInTheDocument();
		} );

		it( 'shows check back later message', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			// Text is split by <br> so use regex to match partial content
			expect(
				screen.getByText( /Check back later for new tasks/ )
			).toBeInTheDocument();
		} );

		it( 'shows widget header in empty state', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'shows empty tasks list element', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				container.querySelector( '.prpl-suggested-tasks-list' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header with default title', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( "Ravi's Recommendations" )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', async () => {
			render(
				<SuggestedTasks
					config={ {
						title: 'Custom Recommendations',
						delayCelebration: true,
					} }
				/>
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( 'Custom Recommendations' )
			).toBeInTheDocument();
		} );

		it( 'uses custom raviName in default title', async () => {
			render(
				<SuggestedTasks
					config={ { raviName: 'Bob', delayCelebration: true } }
				/>
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( "Bob's Recommendations" )
			).toBeInTheDocument();
		} );

		it( 'uses custom description from config', async () => {
			render(
				<SuggestedTasks
					config={ {
						description: 'Custom description text',
						delayCelebration: true,
					} }
				/>
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( 'Custom description text' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'task streaming', () => {
		it( 'sets up task render callback on mount', async () => {
			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			expect( setTaskRenderCallback ).toHaveBeenCalledWith(
				expect.any( Function )
			);
		} );

		it( 'clears task render callback on unmount', () => {
			const { unmount } = render( <SuggestedTasks /> );

			unmount();

			expect( setTaskRenderCallback ).toHaveBeenLastCalledWith( null );
		} );
	} );

	describe( 'pending tasks celebration', () => {
		it( 'fetches pending tasks on mount when no delayCelebration', async () => {
			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			expect( fetchTasks ).toHaveBeenCalledWith(
				expect.objectContaining( {
					status: 'pending',
					perPage: 100,
					excludeProvider: 'user',
				} )
			);
		} );

		it( 'skips pending tasks fetch when delayCelebration is true', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			// Should not call fetchTasks with pending status
			expect( fetchTasks ).not.toHaveBeenCalledWith(
				expect.objectContaining( {
					status: 'pending',
				} )
			);
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'shows skeleton during loading', () => {
			fetchTasks.mockImplementation( () => new Promise( () => {} ) );

			render( <SuggestedTasks /> );

			// During loading, widget header is shown
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Task list is not rendered during loading
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );

		it( 'has description class after loading', async () => {
			const tasks = [
				{ id: 1, title: { rendered: 'Task 1' }, prpl_priority: 10 },
			];
			fetchTasks.mockResolvedValue( { tasks, hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				container.querySelector(
					'.prpl-suggested-tasks-widget-description'
				)
			).toBeInTheDocument();
		} );

		it( 'has no-suggested-tasks class in empty state', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				container.querySelector( '.prpl-no-suggested-tasks' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', async () => {
			render( <SuggestedTasks config={ {} } /> );

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'handles undefined config', async () => {
			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'handles fetch error gracefully', async () => {
			fetchTasks.mockRejectedValue( new Error( 'Network error' ) );

			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			// Should set loading to false on error
			expect( fetchTasks ).toHaveBeenCalled();
		} );
	} );

	describe( 'hook calls', () => {
		it( 'calls useGridMasonry on mount', async () => {
			const {
				useGridMasonry,
			} = require( '../../../hooks/useGridMasonry' );

			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			expect( useGridMasonry ).toHaveBeenCalled();
		} );

		it( 'calls useCelebration on mount', async () => {
			const {
				useCelebration,
			} = require( '../../../hooks/useCelebration' );

			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			expect( useCelebration ).toHaveBeenCalled();
		} );

		it( 'calls useDashboardStore on mount', async () => {
			const {
				useDashboardStore,
			} = require( '../../../stores/dashboardStore' );

			render( <SuggestedTasks /> );

			await act( async () => {
				jest.advanceTimersByTime( 100 );
			} );

			expect( useDashboardStore ).toHaveBeenCalled();
		} );
	} );

	describe( 'HTML entity decoding', () => {
		it( 'decodes HTML entities in title', async () => {
			render(
				<SuggestedTasks
					config={ {
						title: 'Tasks &amp; Recommendations',
						delayCelebration: true,
					} }
				/>
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( 'Tasks & Recommendations' )
			).toBeInTheDocument();
		} );

		it( 'decodes HTML entities in description', async () => {
			render(
				<SuggestedTasks
					config={ {
						description: 'Complete &amp; earn points',
						delayCelebration: true,
					} }
				/>
			);

			await act( async () => {
				jest.advanceTimersByTime( 1500 );
			} );

			expect(
				screen.getByText( 'Complete & earn points' )
			).toBeInTheDocument();
		} );
	} );
} );
