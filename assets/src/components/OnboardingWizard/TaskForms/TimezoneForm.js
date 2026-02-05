/**
 * TimezoneForm Component
 *
 * Renders a select dropdown for timezone selection.
 * Fetches options from the timezone-options REST endpoint.
 * Replaces views/onboarding/tasks/select-timezone.php.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.task The task data.
 * @return {JSX.Element} The timezone form.
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function TimezoneForm( { task } ) {
	const [ options, setOptions ] = useState( [] );

	useEffect( () => {
		apiFetch( { path: '/progress-planner/v1/timezone-options' } ).then(
			( data ) => {
				setOptions( data );
			}
		);
	}, [] );

	return (
		<div className="prpl-onboarding-task">
			<h3 className="prpl-onboarding-task-title">{ task.title }</h3>
			<p>
				{ __(
					"Setting your timezone ensures that scheduled posts and automated updates happen exactly when you expect them to. It keeps your site's clock synced with your local time. Pick your city or offset now!",
					'progress-planner'
				) }
			</p>
			<select name="timezone_string" data-validate="required">
				{ options.map( ( option ) => (
					<option key={ option.value } value={ option.value }>
						{ option.label }
					</option>
				) ) }
			</select>
		</div>
	);
}
