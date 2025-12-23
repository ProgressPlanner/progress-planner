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
	<h3 class="prpl-onboarding-task-title">
		<?php echo esc_html( $task['title'] ); ?>
	</h3>
	<p>
		<?php \esc_html_e( 'Upload an image to make your site stand out.', 'progress-planner' ); ?>
	</p>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">

		<div class="prpl-file-drop-zone" data-upload-field>
			<span class="prpl-icon-image">
				<?php \progress_planner()->the_file( 'assets/images/onboarding/icon_image.svg' ); ?>
			</span>
			<p>
			<?php
				printf(
					// translators: %1$s is opening label tag, %2$s is the closing label tag.
					\esc_html__( 'Drag and drop a file here or %1$s upload a file %2$s', 'progress-planner' ),
					'<label for="prpl-file-input-core-siteicon" class="prpl-file-browse-link">',
					'</label>'
				);
				?>
				<div class="prpl-file-upload-hints">
					<span class="prpl-file-upload-hint prpl-file-upload-hint-dimensions"><?php \esc_html_e( 'Recommended dimensions: 512 x 521 pixels', 'progress-planner' ); ?></span>
					<span class="prpl-file-upload-hint prpl-file-upload-hint-type">PNG, ICO, WEBP</span>
				</div>
			</p>
			<input type="file" id="prpl-file-input-core-siteicon" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" accept=".ico,.png,.jpg,.jpeg,.gif,.webp" hidden>
			<input type="hidden" name="post_id" value="" data-validate="required">
			<div class="prpl-upload-status"></div> <!-- WIP -->
			<div class="prpl-file-preview"></div>
			<button type="button" class="prpl-file-remove-btn" hidden><?php \esc_html_e( 'Remove icon', 'progress-planner' ); ?></button>
		</div>
		<button type="button" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-secondary">
			<?php \esc_html_e( 'Set site icon', 'progress-planner' ); ?>
		</button>
	</form>
</div>
