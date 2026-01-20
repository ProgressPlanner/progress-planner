/**
 * CustomRadio Component
 *
 * A styled radio button component matching the onboarding wizard design.
 *
 * @package
 */

/**
 * CustomRadio component.
 *
 * @param {Object}   props           - Component props.
 * @param {string}   props.id        - Input ID.
 * @param {string}   props.name      - Input name (groups radios together).
 * @param {string}   props.value     - Input value.
 * @param {boolean}  props.checked   - Whether checked.
 * @param {Function} props.onChange  - Change handler.
 * @param {string}   props.label     - Label text.
 * @param {string}   props.className - Additional class names.
 * @return {JSX.Element} CustomRadio component.
 */
export default function CustomRadio( {
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
			className={ `prpl-custom-radio ${ className }`.trim() }
		>
			<input
				type="radio"
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
