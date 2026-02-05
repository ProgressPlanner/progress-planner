/**
 * SiteIconForm Component
 *
 * Renders a file upload zone for the site icon.
 * Replaces views/onboarding/tasks/core-siteicon.php.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.task The task data.
 * @return {JSX.Element} The site icon form.
 */

import { __ } from '@wordpress/i18n';

export default function SiteIconForm( { task } ) {
	return (
		<div className="prpl-onboarding-task">
			<h3 className="prpl-onboarding-task-title">{ task.title }</h3>
			<p>
				{ __(
					'Upload an image to make your site stand out.',
					'progress-planner'
				) }
			</p>
			<div className="prpl-file-drop-zone" data-upload-field="">
				<span className="prpl-icon-image">
					<img
						src={
							( window.prplDashboardConfig?.baseUrl || '' ) +
							'/assets/images/onboarding/icon_image.svg'
						}
						alt=""
					/>
				</span>
				<p>
					{ __( 'Drag and drop a file here or', 'progress-planner' ) }{ ' ' }
					<label
						htmlFor={ `prpl-file-input-${ task.task_id }` }
						className="prpl-file-browse-link"
					>
						{ __( 'upload a file', 'progress-planner' ) }
					</label>
					<span className="prpl-file-upload-hints">
						<span className="prpl-file-upload-hint prpl-file-upload-hint-dimensions">
							{ __(
								'Recommended dimensions: 512 x 521 pixels',
								'progress-planner'
							) }
						</span>
						<span className="prpl-file-upload-hint prpl-file-upload-hint-type">
							PNG, ICO, WEBP
						</span>
					</span>
				</p>
				<input
					type="file"
					id={ `prpl-file-input-${ task.task_id }` }
					data-task-id={ task.task_id }
					accept=".ico,.png,.jpg,.jpeg,.gif,.webp"
					hidden
				/>
				<input
					type="hidden"
					name="post_id"
					defaultValue=""
					data-validate="required"
				/>
				<div className="prpl-upload-status"></div>
				<div className="prpl-file-preview"></div>
				<button type="button" className="prpl-file-remove-btn" hidden>
					{ __( 'Remove icon', 'progress-planner' ) }
				</button>
			</div>
		</div>
	);
}
