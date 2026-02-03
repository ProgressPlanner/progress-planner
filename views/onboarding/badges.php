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

// @phpstan-ignore-next-line class.notFound
$prpl_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( new \DateTime() ) );
?>

<!-- Tour step badges -->
<script type="text/template" id="onboarding-step-badges">
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex prpl-columns-2-1">
			<div class="prpl-column">
				<div class="prpl-background-content">
					<h3>
						<?php \esc_html_e( 'Whoohoo, nice one! You just earned your first point!', 'progress-planner' ); ?>
					</h3>
					<p>
						<?php \esc_html_e( 'Gather ten points this month to unlock your special badge.', 'progress-planner' ); ?>
					</p>
					<p>
						<?php \esc_html_e( 'You’re off to a great start!', 'progress-planner' ); ?>
					</p>
				</div>
			</div>
			<div class="prpl-column">
				<div class="prpl-gauge-wrapper">
					<prpl-gauge
						id="prpl-gauge-onboarding"
						background="#fff"
						color="var(--prpl-color-monthly)"
						contentFontSize="3rem"
						contentPadding="20px"
						marginBottom="0"
						data-max="<?php echo (int) ( Monthly::TARGET_POINTS ?? 10 ); // @phpstan-ignore-line class.notFound ?>"
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
			<button class="prpl-tour-next prpl-btn prpl-btn-secondary">
				<?php
				/* translators: %s: arrow icon */
				printf( \esc_html__( 'Got it %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
				?>
			</button>
		</div>
	</div>
</script>
