/**
 * Tests for WhatsNew Widget
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Mock WordPress packages
jest.mock( '@wordpress/i18n', () => ( {
	__: ( str ) => str,
} ) );

jest.mock( '@wordpress/hooks', () => ( {
	doAction: jest.fn(),
	addAction: jest.fn(),
} ) );

// Mock hooks
jest.mock( '../../../hooks/useApiData', () => ( {
	useApiData: jest.fn(),
} ) );

// Mock child components
jest.mock( '../../../components/WidgetStates', () => ( {
	LoadingState: ( props ) => (
		<div data-testid="loading-state" className={ props.className }>
			Loading...
		</div>
	),
} ) );

jest.mock( '../../../components/WidgetHeader', () => ( props ) => (
	<div data-testid="widget-header">{ props.title }</div>
) );

// Import after mocks
import WhatsNew from '../index';

describe( 'WhatsNew', () => {
	const { useApiData } = require( '../../../hooks/useApiData' );

	const mockPosts = [
		{
			title: 'First Blog Post',
			link: 'https://example.com/post-1',
			excerpt: 'This is the first post excerpt.',
			imageUrl: 'https://example.com/image1.jpg',
		},
		{
			title: 'Second Blog Post',
			link: 'https://example.com/post-2',
			excerpt: 'This is the second post excerpt.',
			imageUrl: 'https://example.com/image2.jpg',
		},
	];

	beforeEach( () => {
		jest.clearAllMocks();

		useApiData.mockReturnValue( {
			isLoading: false,
			error: null,
			data: {
				posts: mockPosts,
				blogUrl: 'https://example.com/blog',
			},
		} );
	} );

	describe( 'loading state', () => {
		it( 'renders loading state when isLoading is true', () => {
			useApiData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <WhatsNew /> );

			// Widget header should be visible during loading
			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
			// Post links should not be visible during loading (skeleton is shown)
			expect( screen.queryByRole( 'link' ) ).not.toBeInTheDocument();
		} );

		it( 'shows widget header during loading', () => {
			useApiData.mockReturnValue( {
				isLoading: true,
				error: null,
				data: null,
			} );

			render( <WhatsNew /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'empty state', () => {
		it( 'returns null when no posts', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: { posts: [], blogUrl: '' },
			} );

			const { container } = render( <WhatsNew /> );

			expect( container.firstChild ).toBeNull();
		} );

		it( 'returns null when posts array is undefined', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {},
			} );

			const { container } = render( <WhatsNew /> );

			expect( container.firstChild ).toBeNull();
		} );
	} );

	describe( 'content rendering', () => {
		it( 'renders widget header', () => {
			render( <WhatsNew /> );

			expect( screen.getByTestId( 'widget-header' ) ).toBeInTheDocument();
		} );

		it( 'uses default title when config not provided', () => {
			render( <WhatsNew /> );

			expect(
				screen.getByText( "What's new on the Progress Planner blog" )
			).toBeInTheDocument();
		} );

		it( 'uses custom title from config', () => {
			render( <WhatsNew config={ { title: 'Custom Blog Title' } } /> );

			expect(
				screen.getByText( 'Custom Blog Title' )
			).toBeInTheDocument();
		} );

		it( 'renders all blog posts', () => {
			render( <WhatsNew /> );

			expect( screen.getByText( 'First Blog Post' ) ).toBeInTheDocument();
			expect(
				screen.getByText( 'Second Blog Post' )
			).toBeInTheDocument();
		} );

		it( 'renders post excerpts', () => {
			render( <WhatsNew /> );

			expect(
				screen.getByText( 'This is the first post excerpt.' )
			).toBeInTheDocument();
			expect(
				screen.getByText( 'This is the second post excerpt.' )
			).toBeInTheDocument();
		} );

		it( 'renders post images', () => {
			const { container } = render( <WhatsNew /> );

			const images = container.querySelectorAll(
				'.prpl-blog-post-image'
			);
			expect( images ).toHaveLength( 2 );
		} );

		it( 'renders Read all posts link', () => {
			render( <WhatsNew /> );

			expect( screen.getByText( 'Read all posts' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'links', () => {
		it( 'post title links to post URL', () => {
			render( <WhatsNew /> );

			const firstPostLink = screen.getByText( 'First Blog Post' );
			expect( firstPostLink.closest( 'a' ) ).toHaveAttribute(
				'href',
				'https://example.com/post-1'
			);
		} );

		it( 'post links open in new tab', () => {
			render( <WhatsNew /> );

			const firstPostLink = screen.getByText( 'First Blog Post' );
			expect( firstPostLink.closest( 'a' ) ).toHaveAttribute(
				'target',
				'_blank'
			);
		} );

		it( 'Read all posts links to blog URL', () => {
			render( <WhatsNew /> );

			const readAllLink = screen.getByText( 'Read all posts' );
			expect( readAllLink ).toHaveAttribute(
				'href',
				'https://example.com/blog'
			);
		} );
	} );

	describe( 'post without image', () => {
		it( 'renders post without image when imageUrl is missing', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					posts: [
						{
							title: 'Post Without Image',
							link: 'https://example.com/no-image',
							excerpt: 'No image here.',
							imageUrl: null,
						},
					],
					blogUrl: 'https://example.com/blog',
				},
			} );

			const { container } = render( <WhatsNew /> );

			expect(
				screen.getByText( 'Post Without Image' )
			).toBeInTheDocument();
			expect(
				container.querySelector( '.prpl-blog-post-image' )
			).not.toBeInTheDocument();
		} );
	} );

	describe( 'CSS classes', () => {
		it( 'has widget footer class', () => {
			const { container } = render( <WhatsNew /> );

			expect(
				container.querySelector( '.prpl-widget-footer' )
			).toBeInTheDocument();
		} );
	} );

	describe( 'API call', () => {
		it( 'calls useApiData with correct path', () => {
			render( <WhatsNew /> );

			expect( useApiData ).toHaveBeenCalledWith(
				'/progress-planner/v1/widgets/whats-new'
			);
		} );
	} );

	describe( 'hover interactions', () => {
		it( 'post title responds to hover', () => {
			render( <WhatsNew /> );

			const link = screen.getByText( 'First Blog Post' ).closest( 'a' );

			// Initial state
			expect( link.style.textDecoration ).toBe( 'none' );

			// Hover
			fireEvent.mouseEnter( link );
			expect( link.style.textDecoration ).toBe( 'underline' );

			// Leave
			fireEvent.mouseLeave( link );
			expect( link.style.textDecoration ).toBe( 'none' );
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty config object', () => {
			render( <WhatsNew config={ {} } /> );

			expect(
				screen.getByText( "What's new on the Progress Planner blog" )
			).toBeInTheDocument();
		} );

		it( 'handles single post', () => {
			useApiData.mockReturnValue( {
				isLoading: false,
				error: null,
				data: {
					posts: [ mockPosts[ 0 ] ],
					blogUrl: 'https://example.com/blog',
				},
			} );

			render( <WhatsNew /> );

			expect( screen.getByText( 'First Blog Post' ) ).toBeInTheDocument();
			expect(
				screen.queryByText( 'Second Blog Post' )
			).not.toBeInTheDocument();
		} );
	} );
} );
