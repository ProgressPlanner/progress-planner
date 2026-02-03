/**
 * Render the video section.
 * This will display a button to open a modal with the video.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @return {JSX.Element} Element to render.
 */
import { useState } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function SectionVideo( { lessonSection } ) {
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<div title={ __( 'Video', 'progress-planner' ) }>
			<div>
				<Button
					onClick={ openModal }
					icon="video-alt3"
					variant="secondary"
					style={ {
						width: '100%',
						margin: '15px 0',
						color: '#38296D',
						boxShadow: 'inset 0 0 0 1px #38296D',
					} }
				>
					{ lessonSection.video_button_label
						? lessonSection.video_button_text
						: __( 'Watch video', 'progress-planner' ) }
				</Button>
				{ isOpen && (
					<Modal
						title={ __( 'Video', 'progress-planner' ) }
						onRequestClose={ closeModal }
						shouldCloseOnClickOutside={ true }
						shouldCloseOnEsc={ true }
						size="large"
					>
						<div>
							<div
								dangerouslySetInnerHTML={ {
									__html: lessonSection.video,
								} }
							/>
						</div>
					</Modal>
				) }
			</div>
		</div>
	);
}
