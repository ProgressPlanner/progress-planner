<?php
/**
 * Popover for the check-email-dns-records task.
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
	<div class="prpl-popover-header">
		<h3 class="prpl-popover-title"><?php \esc_html_e( 'Check Email DNS Records', 'progress-planner' ); ?></h3>
		<button type="button" class="prpl-popover-close" data-action="closePopover">
			<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
		</button>
	</div>
	<div class="prpl-popover-content">
		<div class="prpl-email-dns-content">
			<div class="prpl-email-dns-instructions">
				<p><?php \esc_html_e( 'Click "Check Records" below to analyze your email DNS configuration. This check will send a test email and verify your SPF, DKIM, and DMARC records.', 'progress-planner' ); ?></p>
				<p><?php \esc_html_e( 'This process may take up to 15 seconds.', 'progress-planner' ); ?></p>
			</div>
			<div class="prpl-email-dns-loading" style="display:none;">
				<div class="prpl-spinner"></div>
				<p><?php \esc_html_e( 'Checking your email DNS records... This may take up to 15 seconds.', 'progress-planner' ); ?></p>
			</div>
			<div class="prpl-email-dns-result" style="display:none;">
				<div class="prpl-email-dns-response"></div>
			</div>
			<div class="prpl-email-dns-error" style="display:none;">
				<p class="prpl-error-message"></p>
			</div>
		</div>
		<div class="prpl-steps-nav-wrapper">
			<button type="button" class="prpl-button prpl-button-primary prpl-email-dns-check">
				<?php \esc_html_e( 'Check Records', 'progress-planner' ); ?>
			</button>
			<button type="button" class="prpl-button prpl-button-secondary prpl-email-dns-retry" style="display:none;">
				<?php \esc_html_e( 'Send another test email', 'progress-planner' ); ?>
			</button>
			<button type="button" class="prpl-button prpl-button-secondary prpl-email-dns-check-report-again" style="display:none;">
				<?php \esc_html_e( 'Check again if report is ready', 'progress-planner' ); ?>
			</button>
			<button type="button" class="prpl-button prpl-button-primary prpl-email-dns-complete" data-action="completeTask" style="display:none;">
				<?php \esc_html_e( 'Collect your point!', 'progress-planner' ); ?>
			</button>
		</div>
	</div>
</prpl-interactive-task-popover>
