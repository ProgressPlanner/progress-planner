/**
 * Custom Popover Component.
 *
 * Handles complex custom submit handlers with form inputs when needed.
 *
 * @param {Object}   props                Component props.
 * @param {Object}   props.task           The task object.
 * @param {Function} props.onSubmit       Callback when form is submitted.
 * @param {Function} props.onClose        Callback when popover is closed.
 * @param {Function} props.onCustomSubmit Custom submit handler from PopoverManager.
 * @return {JSX.Element} The popover component.
 */

import { useState, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';

export default function CustomPopover( {
	task,
	onSubmit,
	onClose,
	onCustomSubmit,
} ) {
	const taskId = task.slug || task.prpl_provider?.slug || task.id;
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	// Form state for rename-uncategorized-category
	const [ categoryName, setCategoryName ] = useState( '' );
	const [ categorySlug, setCategorySlug ] = useState( '' );

	// Form state for update-term-description
	const [ termDescription, setTermDescription ] = useState( '' );
	const [ termId, setTermId ] = useState( null );
	const [ taxonomy, setTaxonomy ] = useState( '' );

	/**
	 * Load initial data for specific tasks.
	 */
	useEffect( () => {
		if ( taskId === 'update-term-description' ) {
			// Get term data from task
			const targetTermId =
				task.target_term_id || task.prpl_task_data?.target_term_id;
			const targetTaxonomy =
				task.target_taxonomy || task.prpl_task_data?.target_taxonomy;

			if ( targetTermId && targetTaxonomy ) {
				setTermId( targetTermId );
				setTaxonomy( targetTaxonomy );

				// Fetch current term description
				const endpoint =
					targetTaxonomy === 'category'
						? 'categories'
						: targetTaxonomy;
				apiFetch( { path: `/wp/v2/${ endpoint }/${ targetTermId }` } )
					.then( ( term ) => {
						setTermDescription( term.description || '' );
					} )
					.catch( () => {
						// Ignore errors
					} );
			}
		} else if ( taskId === 'rename-uncategorized-category' ) {
			// Fetch current category name
			const categoryId =
				task.prpl_task_data?.category_id || task.category_id;
			if ( categoryId ) {
				apiFetch( { path: `/wp/v2/categories/${ categoryId }` } )
					.then( ( category ) => {
						setCategoryName( category.name || '' );
						setCategorySlug( category.slug || '' );
					} )
					.catch( () => {
						// Ignore errors, use defaults
						setCategoryName(
							__( 'Uncategorized', 'progress-planner' )
						);
					} );
			}
		}
	}, [ taskId, task ] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			setIsLoading( true );
			setError( null );

			try {
				const popoverId = `prpl-popover-${ taskId }`;

				if ( taskId === 'rename-uncategorized-category' ) {
					// Submit category rename via AJAX
					const ajaxUrl =
						window.prplDashboardConfig?.ajaxUrl ||
						window.progressPlanner?.ajaxUrl ||
						'/wp-admin/admin-ajax.php';
					const nonce =
						window.prplDashboardConfig?.nonce ||
						window.progressPlanner?.nonce ||
						'';

					const body = new URLSearchParams( {
						action: 'prpl_interactive_task_submit_rename-uncategorized-category',
						_ajax_nonce: nonce,
						uncategorized_category_name: categoryName.trim(),
						uncategorized_category_slug: categorySlug.trim(),
					} );

					const response = await fetch( ajaxUrl, {
						method: 'POST',
						body,
						credentials: 'same-origin',
					} );

					const data = await response.json();

					if ( ! data.success ) {
						throw new Error(
							data.data?.message ||
								__(
									'Failed to update category.',
									'progress-planner'
								)
						);
					}
				} else if ( taskId === 'update-term-description' ) {
					// Submit term description via AJAX
					const ajaxUrl =
						window.prplDashboardConfig?.ajaxUrl ||
						window.progressPlanner?.ajaxUrl ||
						'/wp-admin/admin-ajax.php';
					const nonce =
						window.prplDashboardConfig?.nonce ||
						window.progressPlanner?.nonce ||
						'';

					const body = new URLSearchParams( {
						action: 'prpl_interactive_task_submit_update-term-description',
						_ajax_nonce: nonce,
						term_id: termId,
						taxonomy,
						description: termDescription,
					} );

					const response = await fetch( ajaxUrl, {
						method: 'POST',
						body,
						credentials: 'same-origin',
					} );

					const data = await response.json();

					if ( ! data.success ) {
						throw new Error(
							data.data?.message ||
								__(
									'Failed to update term description.',
									'progress-planner'
								)
						);
					}
				} else if ( onCustomSubmit ) {
					// For other tasks, use the custom submit handler
					await onCustomSubmit( taskId, popoverId );
				}

				if ( onSubmit ) {
					await onSubmit( task.id, task );
				}
			} catch ( err ) {
				setError(
					err.message ||
						__(
							'Something went wrong. Please try again.',
							'progress-planner'
						)
				);
			} finally {
				setIsLoading( false );
			}
		},
		[
			taskId,
			task,
			onSubmit,
			onCustomSubmit,
			categoryName,
			categorySlug,
			termId,
			taxonomy,
			termDescription,
		]
	);

	const taskTitle = task.title?.rendered || task.title;
	const taskDescription =
		task.description?.rendered || task.description || '';

	// Render form inputs based on task type
	const renderFormInputs = () => {
		if ( taskId === 'rename-uncategorized-category' ) {
			return (
				<>
					<label htmlFor="uncategorized_category_name">
						{ __( 'Category Name', 'progress-planner' ) }
						<input
							type="text"
							id="uncategorized_category_name"
							name="uncategorized_category_name"
							value={ categoryName }
							onChange={ ( e ) => {
								setCategoryName( e.target.value );
								// Auto-generate slug from name
								const slug = e.target.value
									.toLowerCase()
									.replace( /[^a-z0-9]+/g, '-' )
									.replace( /^-+|-+$/g, '' );
								setCategorySlug( slug );
							} }
							disabled={ isLoading }
							required
						/>
					</label>
					<label htmlFor="uncategorized_category_slug">
						{ __( 'Category Slug', 'progress-planner' ) }
						<input
							type="text"
							id="uncategorized_category_slug"
							name="uncategorized_category_slug"
							value={ categorySlug }
							onChange={ ( e ) =>
								setCategorySlug( e.target.value )
							}
							disabled={ isLoading }
							required
						/>
					</label>
				</>
			);
		}

		if ( taskId === 'update-term-description' ) {
			const termName =
				task.target_term_name ||
				task.prpl_task_data?.target_term_name ||
				'';
			return (
				<>
					{ termName && (
						<p>
							{ __( 'Term:', 'progress-planner' ) }{ ' ' }
							<strong>{ termName }</strong>
						</p>
					) }
					<label htmlFor="term_description">
						{ __( 'Description', 'progress-planner' ) }
						<textarea
							id="term_description"
							name="description"
							value={ termDescription }
							onChange={ ( e ) =>
								setTermDescription( e.target.value )
							}
							disabled={ isLoading }
							rows={ 5 }
						/>
					</label>
				</>
			);
		}

		// Default: no form inputs, just submit button
		return null;
	};

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ taskId }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ taskTitle }</h2>
				{ taskDescription && <p>{ taskDescription }</p> }
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					{ renderFormInputs() }
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={
								isLoading ||
								( taskId === 'rename-uncategorized-category' &&
									( ! categoryName.trim() ||
										! categorySlug.trim() ) )
							}
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__( 'Submit', 'progress-planner' )
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
