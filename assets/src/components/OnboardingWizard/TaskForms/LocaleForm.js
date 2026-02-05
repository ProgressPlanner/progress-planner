/**
 * LocaleForm Component
 *
 * Renders a select dropdown for locale/language selection.
 * Fetches options from the locale-options REST endpoint.
 * Replaces views/onboarding/tasks/select-locale.php.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.task The task data.
 * @return {JSX.Element} The locale form.
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function LocaleForm( { task } ) {
	const [ options, setOptions ] = useState( [] );

	useEffect( () => {
		apiFetch( { path: '/progress-planner/v1/locale-options' } ).then(
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
					'Your locale determines the language and formatting your visitors see, such as date structures and currency. Setting this helps your audience feel right at home. Choose your preferred language and region.',
					'progress-planner'
				) }
			</p>
			<select name="WPLANG">
				{ options.map( ( option ) => (
					<option key={ option.value } value={ option.value }>
						{ option.label }
					</option>
				) ) }
			</select>
		</div>
	);
}
