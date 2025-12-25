/**
 * CustomCheckbox Component
 *
 * A styled checkbox component matching the onboarding wizard design.
 *
 * @package
 */

/**
 * CustomCheckbox component.
 *
 * @param {Object}             props           - Component props.
 * @param {string}             props.id        - Input ID.
 * @param {string}             props.name      - Input name.
 * @param {string}             props.value     - Input value.
 * @param {boolean}            props.checked   - Whether checked.
 * @param {Function}           props.onChange  - Change handler.
 * @param {string|JSX.Element} props.label     - Label text or JSX element.
 * @param {string}             props.className - Additional class names.
 * @return {JSX.Element} CustomCheckbox component.
 */
export default function CustomCheckbox( {
	id,
	name,
	value,
	checked,
	onChange,
	label,
	className = '',
} ) {
	return (
		<label
			htmlFor={ id }
			className={ `prpl-custom-checkbox ${ className }`.trim() }
		>
			<input
				type="checkbox"
				id={ id }
				name={ name }
				value={ value }
				checked={ checked }
				onChange={ onChange }
			/>
			<span className="prpl-custom-control"></span>
			<span className="prpl-custom-control-text">{ label }</span>
		</label>
	);
}
