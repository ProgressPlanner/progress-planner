/* global progressPlannerEditor */

/**
 * Icon Component using branding admin menu icon.
 *
 * Renders raw SVG inline so it can be styled with CSS (e.g., currentColor).
 *
 * @return {JSX.Element} The icon element.
 */
export default function ProgressPlannerIcon() {
	return (
		<span
			className="progress-planner-icon"
			style={ {
				display: 'inline-flex',
				width: '20px',
				height: '20px',
			} }
			dangerouslySetInnerHTML={ {
				__html: progressPlannerEditor.adminMenuIconSvg,
			} }
		/>
	);
}
