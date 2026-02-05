/**
 * ToggleSwitch Component
 *
 * A styled toggle switch component matching the onboarding wizard design.
 * Used for post type selection and similar on/off toggles.
 *
 * @package
 */

import Icon from '../Icon';

/**
 * ToggleSwitch component.
 *
 * @param {Object}   props           - Component props.
 * @param {string}   props.id        - Input ID.
 * @param {string}   props.name      - Input name.
 * @param {string}   props.value     - Input value.
 * @param {boolean}  props.checked   - Whether checked.
 * @param {Function} props.onChange  - Change handler.
 * @param {string}   props.label     - Label text.
 * @param {string}   props.className - Additional class names.
 * @return {JSX.Element} ToggleSwitch component.
 */
export default function ToggleSwitch( {
	id,
	name,
	value,
	checked,
	onChange,
	label,
	className = '',
} ) {
	return (
		<div
			className={ `prpl-post-type-toggle-wrapper ${ className }`.trim() }
		>
			<label htmlFor={ id } className="prpl-post-type-toggle-label">
				<input
					type="checkbox"
					id={ id }
					name={ name }
					value={ value }
					checked={ checked }
					onChange={ onChange }
					className="prpl-post-type-toggle-input"
				/>
				<span className="prpl-post-type-toggle-switch">
					<Icon name="check" className="prpl-toggle-icon-check" />
					<Icon name="close" className="prpl-toggle-icon-x" />
				</span>
				<span className="prpl-post-type-toggle-text">{ label }</span>
			</label>
		</div>
	);
}
