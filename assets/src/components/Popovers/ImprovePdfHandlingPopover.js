/**
 * Improve PDF Handling Popover Component.
 *
 * Multi-step popover for improving PDF handling with plugin installation.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import InstallPluginButton from '../InstallPluginButton';

const STEP_FIRST = 'first';
const STEP_PDF_XML_SITEMAP = 'pdf-xml-sitemap';
const STEP_SUCCESS = 'success';

export default function ImprovePdfHandlingPopover( {
	task,
	onSubmit,
	onClose,
} ) {
	const [ currentStep, setCurrentStep ] = useState( STEP_FIRST );
	const [ canShowPdfSitemapStep, setCanShowPdfSitemapStep ] =
		useState( false );
	const [ isPdfSitemapInstalled, setIsPdfSitemapInstalled ] =
		useState( false );

	/**
	 * Check plugin status on mount.
	 *
	 * Note: This should ideally check plugin status via AJAX or from task data.
	 * The old PHP template checked:
	 * - ! is_multisite() && current_user_can( 'install_plugins' )
	 * - is_plugin_activated( 'wordpress-seo' )
	 * - ! is_plugin_activated( 'pdf-library' )
	 * - is_plugin_installed( 'pdf-sitemap' )
	 */
	useEffect( () => {
		// Check if we can show the PDF sitemap step
		// This requires: not multisite, user can install plugins, Yoast SEO is active, PDF Library is not active
		const checkPluginStatus = async () => {
			try {
				// Check if we're on multisite
				const isMultisite =
					window.prplSuggestedTasksConfig?.isMultisite || false;
				const canInstallPlugins =
					window.prplSuggestedTasksConfig?.canInstallPlugins !==
					false;

				if ( isMultisite || ! canInstallPlugins ) {
					setCanShowPdfSitemapStep( false );
					return;
				}

				// TODO: Fetch plugin status via AJAX endpoint
				// For now, check from localized data if available
				// The Improve_Pdf_Handling provider should localize this data or
				// we should create an AJAX endpoint to check plugin status
				const yoastActive =
					window.prplSuggestedTasksConfig?.plugins?.yoast ||
					task.prpl_task_data?.plugins?.yoast ||
					false;
				const pdfLibraryActive =
					window.prplSuggestedTasksConfig?.plugins?.pdfLibrary ||
					task.prpl_task_data?.plugins?.pdfLibrary ||
					false;

				setCanShowPdfSitemapStep( yoastActive && ! pdfLibraryActive );

				// Check if PDF sitemap is installed
				const pdfSitemapInstalled =
					window.prplSuggestedTasksConfig?.plugins?.pdfSitemap ||
					task.prpl_task_data?.plugins?.pdfSitemap ||
					false;
				setIsPdfSitemapInstalled( pdfSitemapInstalled );
			} catch ( err ) {
				// If we can't check, default to not showing the step
				setCanShowPdfSitemapStep( false );
			}
		};

		checkPluginStatus();
	}, [ task ] );

	/**
	 * Handle complete task.
	 */
	const handleComplete = useCallback( async () => {
		if ( onSubmit ) {
			await onSubmit( task.id, task );
		}
	}, [ task, onSubmit ] );

	// Render current step
	const renderStep = () => {
		switch ( currentStep ) {
			case STEP_FIRST:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									"Improve your site's PDF handling",
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									'We have detected that your site has quite a few PDF files.',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'It would be great if you could improve the way your site handles them.',
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'Do you need to show a folder structure with the files to make them more discoverable?',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'If so, you can improve the way your site handles them by adding a folder structure.',
									'progress-planner'
								) }
							</p>
							<p>
								<a
									href="https://barn2.com/blog/wordpress-pdf-library-plugin/"
									target="_blank"
									rel="noopener noreferrer"
								>
									{ __(
										'Learn more about the PDF Library plugin',
										'progress-planner'
									) }
								</a>
							</p>
							<div className="prpl-steps-nav-wrapper">
								{ canShowPdfSitemapStep ? (
									<button
										type="button"
										className="prpl-button prpl-button-step"
										onClick={ () =>
											setCurrentStep(
												STEP_PDF_XML_SITEMAP
											)
										}
									>
										{ __(
											'Next step',
											'progress-planner'
										) }
										<span className="dashicons dashicons-arrow-right-alt2"></span>
									</button>
								) : (
									<button
										type="button"
										className="prpl-button prpl-button-step"
										onClick={ handleComplete }
									>
										{ __(
											'Collect your point!',
											'progress-planner'
										) }
									</button>
								) }
							</div>
						</div>
					</>
				);

			case STEP_PDF_XML_SITEMAP:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'Do you want these PDFs to be found in search engines better?',
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									'Adding an XML sitemap for your PDF files helps search engines discover and index them more effectively. This can improve visibility in search results and drive more organic traffic to your valuable PDF content.',
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'XML Sitemap for PDFs for Yoast SEO',
									'progress-planner'
								) }
							</p>
							<p>
								{ __(
									'This plugin adds an XML sitemap for PDFs. It adds this XML sitemap to the sitemap_index.xml that Yoast SEO generates.',
									'progress-planner'
								) }
							</p>
							<div>
								<InstallPluginButton
									pluginSlug="pdf-sitemap"
									pluginName="XML Sitemap for PDFs for Yoast SEO"
									action={
										isPdfSitemapInstalled
											? 'activate'
											: 'install'
									}
									completeTask={ false }
									providerId={
										task.prpl_provider?.slug ||
										task.slug ||
										task.id
									}
								/>
							</div>
							<div className="prpl-steps-nav-wrapper">
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ () =>
										setCurrentStep( STEP_SUCCESS )
									}
								>
									{ __( 'Next step', 'progress-planner' ) }
									<span className="dashicons dashicons-arrow-right-alt2"></span>
								</button>
							</div>
						</div>
					</>
				);

			case STEP_SUCCESS:
				return (
					<>
						<div className="prpl-column prpl-column-content">
							<h2 className="prpl-popover-title">
								{ __(
									'Your PDF handling is improved!',
									'progress-planner'
								) }
							</h2>
							<p>
								{ __(
									'Great, you improved the way your site handles PDFs! This indicates PDF handling is set up properly on your website.',
									'progress-planner'
								) }
							</p>
						</div>
						<div className="prpl-column">
							<p>
								{ __(
									'Celebrate this achievement!',
									'progress-planner'
								) }
							</p>
							<div className="prpl-steps-nav-wrapper">
								<button
									type="button"
									className="prpl-button prpl-button-step"
									onClick={ handleComplete }
								>
									{ __(
										'Collect your point!',
										'progress-planner'
									) }
								</button>
							</div>
						</div>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ task.slug || task.id }
			task={ task }
			onClose={ onClose }
		>
			{ renderStep() }
		</InteractiveTaskPopover>
	);
}

