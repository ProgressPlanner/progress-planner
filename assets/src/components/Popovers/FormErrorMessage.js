/**
 * FormErrorMessage Component.
 *
 * Renders the standard popover error message when an error string is provided.
 * Returns null when there is no error.
 *
 * @param {Object} props       Component props.
 * @param {string} props.error Error message to display, or null/undefined.
 * @return {JSX.Element|null} The error paragraph or null.
 */
export default function FormErrorMessage( { error } ) {
	if ( ! error ) {
		return null;
	}

	return (
		<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
			{ error }
		</p>
	);
}
