<?php
/**
 * Popover for the email-sending task.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

?>

<prpl-interactive-task-popover
	popover-id="<?php echo \esc_attr( 'prpl-popover-' . $prpl_popover_id ); ?>"
	provider-id="<?php echo \esc_attr( $prpl_provider_id ); ?>"
>
	<div class="prpl-columns-wrapper-flex">
		<div class="prpl-column prpl-column-content">
			<p><?php \esc_html_e( 'Your site’s tagline is the first thing people see when they land on your site. It’s a short description of what your site is about.', 'progress-planner' ); ?></p>
		</div>
		<div class="prpl-column">
			<form id="prpl-blog-description-form" onsubmit="return false;">
				<input name="blogdescription" type="text" id="blogdescription" aria-describedby="tagline-description" value="" class="regular-text">
				<p class="description" id="tagline-description">
					<?php \esc_html_e( 'In a few words, explain what this site is about.', 'progress-planner' ); ?>
				</p>
				<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;"><?php \esc_html_e( 'Save', 'progress-planner' ); ?></button>
			</form>
		</div>
	</div>
</prpl-interactive-task-popover>
