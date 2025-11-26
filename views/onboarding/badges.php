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

use Progress_Planner\Badges\Monthly;

$prpl_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( new \DateTime() ) );
?>

<!-- Tour step badges -->
<script type="text/template" id="onboarding-step-badges">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Our badges are waiting for you', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex prpl-columns-2-1">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php \esc_html_e( 'For every recommendation you complete, you earn points. When you earn at least 10 points each month, you\'ll unlock the special badge for that month. Can you collect them all?', 'progress-planner' ); ?>
				</p>
			</div>
			<div class="prpl-column">
				<div class="prpl-gauge-wrapper">
					<prpl-gauge
						id="prpl-gauge-onboarding"
						background="#fff"
						color="var(--prpl-color-monthly)"
						contentFontSize="var(--prpl-font-size-4xl)"
						contentPadding="var(--prpl-padding)"
						marginBottom="0"
						data-max="<?php echo (int) Monthly::TARGET_POINTS; ?>"
						data-value="<?php echo (float) \progress_planner()->get_admin__widgets__monthly_badges()->get_score()['target_score']; ?>" <?php /* Note that this will be the value before the onboaring started, which is what we want. */ ?>
						data-badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
						data-badge-name="<?php echo \esc_attr( $prpl_badge->get_name() ); ?>"
						data-branding-id="<?php echo (int) \progress_planner()->get_ui__branding()->get_branding_id(); ?>"
					>
						<!-- Badge will be loaded dynamically after privacy policy acceptance -->
					</prpl-gauge>
					<?php \esc_html_e( 'Monthly badge', 'progress-planner' ); ?>
				</div>
			</div>
		</div>
	</div>
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Got it', 'progress-planner' ); ?></button>
		</div>
	</div>
</script>
