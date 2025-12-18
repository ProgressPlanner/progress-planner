/**
 * Tests for SuggestedTasks Widget
 */

import { render, screen, waitFor } from '@testing-library/react';

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

jest.mock( '../../../hooks/useCelebration', () => {
	// Create stable mock function to avoid useEffect dependency changes
	const mockCelebrate = jest.fn();
	return {
		useCelebration: jest.fn( () => ( { celebrate: mockCelebrate } ) ),
	};
} );

jest.mock( '../../../utils/gridResize', () => ( {
	dispatchGridResize: jest.fn(),
} ) );

jest.mock( '../../../stores/dashboardStore', () => ( {
	useDashboardStore: jest.fn( () => jest.fn() ),
} ) );

jest.mock( '../../../services/taskRegistry', () => ( {
	registerTask: jest.fn(),
	evaluateTasksUntil: jest.fn( () =>
		Promise.resolve( { complete: true, tasksAdded: 0 } )
	),
	resetEvaluationState: jest.fn(),
	getEvaluationProgress: jest.fn( () => ( {
		current: 0,
		total: 0,
		complete: true,
		isEvaluating: false,
	} ) ),
	hasMoreTasksToEvaluate: jest.fn( () => false ),
	getTaskProviderClass: jest.fn(),
	getTaskProviderInstance: jest.fn(),
	getBufferSize: jest.fn( () => 3 ),
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

jest.mock( '../SuggestedTasksSkeleton', () => () => (
	<div data-testid="skeleton">Loading skeleton</div>
) );

// Import after mocks
import SuggestedTasks from '../index';
import { fetchTasks } from '../../../hooks/useTasksApi';
import {
	evaluateTasksUntil,
	hasMoreTasksToEvaluate,
} from '../../../services/taskRegistry';

describe( 'SuggestedTasks', () => {
	beforeEach( () => {
		// Clear mock call history but preserve implementations
		jest.clearAllMocks();
		// Use real timers by default for async tests
		jest.useRealTimers();

		// Re-setup mock implementations that may have been changed by previous tests
		fetchTasks.mockResolvedValue( {
			tasks: [],
			hasMore: false,
			total: 0,
		} );

		evaluateTasksUntil.mockResolvedValue( {
			complete: true,
			tasksAdded: 0,
		} );

		hasMoreTasksToEvaluate.mockReturnValue( false );
	} );

	afterEach( () => {
		// Ensure evaluateTasksUntil mock is restored after each test
		// This prevents tests that use mockImplementation with never-resolving promises
		// from affecting subsequent tests
		evaluateTasksUntil.mockResolvedValue( {
			complete: true,
			tasksAdded: 0,
		} );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state initially', () => {
			// Prevent evaluateTasksUntil from resolving immediately
			evaluateTasksUntil.mockImplementation(
				() => new Promise( () => {} )
			);

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			// During loading, the widget header is rendered with skeleton
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'skeleton' ) ).toBeInTheDocument();
			// Task list should not be rendered during loading
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );

		it( 'shows widget header during loading', () => {
			evaluateTasksUntil.mockImplementation(
				() => new Promise( () => {} )
			);

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'shows skeleton during loading', () => {
			evaluateTasksUntil.mockImplementation(
				() => new Promise( () => {} )
			);

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			// Widget header should be present
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Skeleton is shown during loading
			expect( screen.getByTestId( 'skeleton' ) ).toBeInTheDocument();
			// Task list is not rendered during loading
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'empty state', () => {
		beforeEach( () => {
			// Ensure evaluateTasksUntil resolves for empty state tests
			evaluateTasksUntil.mockResolvedValue( {
				complete: true,
				tasksAdded: 0,
			} );
			hasMoreTasksToEvaluate.mockReturnValue( false );
		} );

		it( 'shows empty message when no tasks', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			// Wait for the component to finish loading
			await waitFor(
				() => {
					expect(
						screen.getByText(
							/You have completed all recommended tasks/
						)
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'shows check back later message', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect(
						screen.getByText( /Check back later for new tasks/ )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'shows widget header in empty state', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect(
						screen.queryByText(
							/You have completed all recommended tasks/
						)
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'shows empty tasks list element', async () => {
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await waitFor(
				() => {
					expect(
						container.querySelector( '.prpl-suggested-tasks-list' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header with default title', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect(
						screen.getByText( "Ravi's Recommendations" )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
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

			await waitFor(
				() => {
					expect(
						screen.getByText( 'Custom Recommendations' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'uses custom raviName in default title', async () => {
			render(
				<SuggestedTasks
					config={ { raviName: 'Bob', delayCelebration: true } }
				/>
			);

			await waitFor(
				() => {
					expect(
						screen.getByText( "Bob's Recommendations" )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
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

			await waitFor(
				() => {
					expect(
						screen.getByText( 'Custom description text' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );
	} );

	describe( 'lazy task evaluation', () => {
		it( 'calls evaluateTasksUntil on mount', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect( evaluateTasksUntil ).toHaveBeenCalledWith(
						expect.any( Number ),
						expect.any( Function )
					);
				},
				{ timeout: 3000 }
			);
		} );

		it( 'evaluates tasks with correct target count', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					// Should evaluate initial limit (5) + buffer size (3) = 8
					expect( evaluateTasksUntil ).toHaveBeenCalledWith(
						8,
						expect.any( Function )
					);
				},
				{ timeout: 3000 }
			);
		} );
	} );

	describe( 'pending tasks celebration', () => {
		it( 'fetches pending tasks on mount when no delayCelebration', async () => {
			render( <SuggestedTasks /> );

			await waitFor(
				() => {
					expect( fetchTasks ).toHaveBeenCalledWith(
						expect.objectContaining( {
							status: 'pending',
							perPage: 100,
							excludeProvider: 'user',
						} )
					);
				},
				{ timeout: 3000 }
			);
		} );

		it( 'skips pending tasks fetch when delayCelebration is true', async () => {
			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					// Wait for component to finish loading
					expect(
						screen.getByTestId( 'widget-header' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);

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
			evaluateTasksUntil.mockImplementation(
				() => new Promise( () => {} )
			);

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			// During loading, widget header is shown
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Skeleton is shown during loading
			expect( screen.getByTestId( 'skeleton' ) ).toBeInTheDocument();
			// Task list is not rendered during loading
			expect(
				screen.queryByTestId( 'task-list' )
			).not.toBeInTheDocument();
		} );

		it( 'has description class after loading', async () => {
			// Reset mock for this async test
			evaluateTasksUntil.mockResolvedValue( {
				complete: true,
				tasksAdded: 0,
			} );
			const tasks = [
				{ id: 1, title: { rendered: 'Task 1' }, prpl_priority: 10 },
			];
			fetchTasks.mockResolvedValue( { tasks, hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await waitFor(
				() => {
					expect(
						container.querySelector(
							'.prpl-suggested-tasks-widget-description'
						)
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'has no-suggested-tasks class in empty state', async () => {
			// Reset mock for this async test
			evaluateTasksUntil.mockResolvedValue( {
				complete: true,
				tasksAdded: 0,
			} );
			hasMoreTasksToEvaluate.mockReturnValue( false );
			fetchTasks.mockResolvedValue( { tasks: [], hasMore: false } );

			const { container } = render(
				<SuggestedTasks config={ { delayCelebration: true } } />
			);

			await waitFor(
				() => {
					expect(
						container.querySelector( '.prpl-no-suggested-tasks' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', async () => {
			render( <SuggestedTasks config={ {} } /> );

			await waitFor(
				() => {
					expect(
						screen.getByTestId( 'widget-header' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'handles undefined config', async () => {
			render( <SuggestedTasks /> );

			await waitFor(
				() => {
					expect(
						screen.getByTestId( 'widget-header' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'handles fetch error gracefully', async () => {
			fetchTasks.mockRejectedValue( new Error( 'Network error' ) );

			render( <SuggestedTasks /> );

			await waitFor(
				() => {
					// Should set loading to false on error
					expect( fetchTasks ).toHaveBeenCalled();
				},
				{ timeout: 3000 }
			);
		} );
	} );

	describe( 'hook calls', () => {
		it( 'calls useGridMasonry on mount', async () => {
			const {
				useGridMasonry,
			} = require( '../../../hooks/useGridMasonry' );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect( useGridMasonry ).toHaveBeenCalled();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'calls useCelebration on mount', async () => {
			const {
				useCelebration,
			} = require( '../../../hooks/useCelebration' );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect( useCelebration ).toHaveBeenCalled();
				},
				{ timeout: 3000 }
			);
		} );

		it( 'calls useDashboardStore on mount', async () => {
			const {
				useDashboardStore,
			} = require( '../../../stores/dashboardStore' );

			render( <SuggestedTasks config={ { delayCelebration: true } } /> );

			await waitFor(
				() => {
					expect( useDashboardStore ).toHaveBeenCalled();
				},
				{ timeout: 3000 }
			);
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

			await waitFor(
				() => {
					expect(
						screen.getByText( 'Tasks & Recommendations' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
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

			await waitFor(
				() => {
					expect(
						screen.getByText( 'Complete & earn points' )
					).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		} );
	} );
} );
