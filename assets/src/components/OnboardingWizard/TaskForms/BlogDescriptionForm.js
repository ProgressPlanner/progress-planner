/**
 * BlogDescriptionForm Component
 *
 * Renders a text input for the site tagline (blog description).
 * Replaces views/onboarding/tasks/core-blogdescription.php.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.task The task data with site_description.
 * @return {JSX.Element} The blog description form.
 */

import { __ } from '@wordpress/i18n';

export default function BlogDescriptionForm( { task } ) {
	return (
		<div className="prpl-onboarding-task">
			<div>
				<h3 className="prpl-onboarding-task-title">{ task.title }</h3>
				<p>
					{ __(
						"In a few words, explain what this site is about. This information is used in your website's schema and RSS feeds, and can be displayed on your site. The tagline typically is your site's mission statement.",
						'progress-planner'
					) }
				</p>
			</div>
			<input
				type="text"
				name="blogdescription"
				defaultValue={ task.site_description || '' }
				placeholder={ __(
					'A catchy phrase to describe your website',
					'progress-planner'
				) }
			/>
		</div>
	);
}
