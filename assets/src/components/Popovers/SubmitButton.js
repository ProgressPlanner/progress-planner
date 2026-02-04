/**
 * SubmitButton Component.
 *
 * Renders the standard popover submit button with a loading spinner.
 *
 * @param {Object}  props           Component props.
 * @param {boolean} props.isLoading Whether the form is submitting.
 * @param {boolean} props.disabled  Whether the button is disabled (beyond isLoading).
 * @param {string}  props.label     Button label text.
 * @return {JSX.Element} The submit button.
 */
export default function SubmitButton( {
	isLoading = false,
	disabled = false,
	label,
} ) {
	return (
		<button
			type="submit"
			className="prpl-button prpl-button-primary"
			disabled={ isLoading || disabled }
		>
			{ isLoading ? (
				<span
					className="spinner"
					style={ { visibility: 'visible' } }
				></span>
			) : (
				label
			) }
		</button>
	);
}
