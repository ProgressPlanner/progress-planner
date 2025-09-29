<?php
/**
 * Tour step view.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<!-- Tour step connect -->
<script type="text/template" id="tour-step-first-task">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Complete your first task', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>You have pending tasks to complete.</p>

				<p>
					Lorem ipsum dolor sit amet consectetur adipiscing elit, eget interdum nostra tortor vestibulum ultrices, quisque congue nibh ullamcorper sapien natoque. Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam, nibh accumsan ultricies ad placerat maecenas. Id sollicitudin ac auctor odio luctus ornare donec duis maecenas sodales montes nostra mi aliquam ultricies augue, posuere torquent imperdiet lobortis cras gravida nascetur venenatis malesuada potenti et mattis massa parturient.
				</p>
			</div>
			<div class="prpl-column">
				<?php if ( isset( $task ) ) : ?>
					<div class="prpl-complete-first-task">
						<div>
							<h3 class="first-task-title">
								<?php echo esc_html( $task['title'] ); ?>
							</h3>
							<p>
								Lorem ipsum dolor sit amet consectetur adipiscing elit, eget interdum nostra tortor vestibulum ultrices, quisque congue nibh ullamcorper sapien natoque.
							</p>

							<p>
								Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
							</p>
						</div>
						<form class="prpl-complete-task-form" onsubmit="return false;">
							<input type="text" name="prpl-test-input" value="" /> <?php // TODO: This is test input field, demo for the tasks which need user input. ?>
							<button type="button" id="first-task-btn" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Complete first task', 'progress-planner' ); ?></button>
						</form>
					</div>
					<div id="first-task-status"></div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</script>
