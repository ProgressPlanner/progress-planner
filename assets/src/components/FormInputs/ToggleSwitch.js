/**
 * ToggleSwitch Component
 *
 * A styled toggle switch component matching the onboarding wizard design.
 * Used for post type selection and similar on/off toggles.
 *
 * @package
 */

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
					<svg
						className="prpl-toggle-icon-check"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
					<svg
						className="prpl-toggle-icon-x"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</span>
				<span className="prpl-post-type-toggle-text">{ label }</span>
			</label>
		</div>
	);
}
