<?php
/**
 * Onboarding task, site icon.
 *
 * @package Progress_Planner
 *
 * @var array $task
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="prpl-onboarding-task">
	<div class="tour-content">
		<div>
			<h3 class="prpl-onboarding-task-title">
				<?php echo esc_html( $task['title'] ); ?>
			</h3>
			<p>
				Lorem ipsum dolor sit amet consectetur adipiscing elit, eget interdum nostra tortor vestibulum ultrices, quisque congue nibh ullamcorper sapien natoque.
			</p>

			<p>
				Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
			</p>
		</div>
		<form class="prpl-onboarding-task-form" onsubmit="return false;">

			<div class="prpl-file-drop-zone" data-upload-field>
				<p>
				<?php
					printf(
						// translators: %1$s is opening label tag, %2$s is the closing label tag.
						\esc_html__( 'Drag & drop a file here, or %1$s browse %2$s', 'progress-planner' ),
						'<label for="file-input" class="prpl-file-browse-link">',
						'</label>'
					);
					?>
				</p>
				<input type="file" id="file-input" accept=".ico,.png,.jpg,.jpeg,.gif,.svg,.webp" hidden>
				<div class="prpl-upload-status"></div> <!-- WIP -->
			</div>
			<button type="button" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary">
				<?php \esc_html_e( 'Upload site icon', 'progress-planner' ); ?>
			</button>
		</form>
	</div>
</div>
