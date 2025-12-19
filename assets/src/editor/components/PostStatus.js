/**
 * Render the Progress Planner post status.
 *
 * @return {JSX.Element} Element to render.
 */
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ProgressPlannerIcon from './ProgressPlannerIcon';

export default function PostStatus() {
	const { openGeneralSidebar } = useDispatch( 'core/edit-post' );

	const handleClick = () => {
		openGeneralSidebar(
			'progress-planner-sidebar/progress-planner-sidebar'
		);
	};

	return (
		<div>
			<PluginPostStatusInfo>
				<Button
					icon={ <ProgressPlannerIcon /> }
					style={ {
						width: '100%',
						margin: '15px 0',
						color: '#38296D',
						boxShadow: 'inset 0 0 0 1px #38296D',
						fontWeight: 'bold',
					} }
					variant="secondary"
					href="#"
					onClick={ handleClick }
				>
					{ __( 'Progress Planner', 'progress-planner' ) }
				</Button>
			</PluginPostStatusInfo>
			<PluginPostStatusInfo></PluginPostStatusInfo>
		</div>
	);
}
