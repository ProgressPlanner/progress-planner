<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Badges\Monthly;

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__missed_badges();
?>

<?php if ( ! empty( $prpl_widget->get_previous_incomplete_months_badges() ) ) : ?>
	<?php
	$prpl_remaining_points = $prpl_widget->get_score()['target'] - $prpl_widget->get_score()['target_score'];
	$prpl_days_remaining   = (int) \gmdate( 't' ) - (int) \gmdate( 'j' );
	?>
	<div class="prpl-previous-month-badge-progress-bars-wrapper">
		<h3><?php \esc_html_e( 'Oh no! You missed the previous monthly badge!', 'progress-planner' ); ?></h3>
		<p><?php echo \wp_kses( \__( 'No worries though! <strong>Collect the surplus of points</strong> you earn, and get your badge!', 'progress-planner' ), [ 'strong' => [] ] ); ?></p>
		<?php foreach ( $prpl_widget->get_previous_incomplete_months_badges() as $prpl_previous_incomplete_month_badge ) : ?>
			<?php $prpl_remaining_points += $prpl_previous_incomplete_month_badge->progress_callback()['remaining']; ?>
			<div
				class="prpl-previous-month-badge-progress-bar-wrapper"
				style="padding: 1rem 0; background-color: var(--prpl-background-orange); border-radius: 0.5rem; padding: 1rem;"
				data-badge-id="<?php echo \esc_attr( $prpl_previous_incomplete_month_badge->get_id() ); ?>"
			>
				<prpl-badge-progress-bar
					data-badge-id="<?php echo \esc_attr( $prpl_previous_incomplete_month_badge->get_id() ); ?>"
					data-points="<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['points']; ?>"
					data-max-points="<?php echo (int) Monthly::TARGET_POINTS; ?>"
				></prpl-badge-progress-bar>

				<div class="prpl-widget-content-points">
					<span class="prpl-widget-previous-ravi-points-number" class="prpl-widget-content-points-number">
						<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['points']; ?>pt
					</span>
					<span class="prpl-previous-month-badge-progress-bar-remaining" data-remaining="<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['remaining']; ?>">
						<?php
						\printf(
							/* translators: %1$d: The number of points. %2$d: The number of days. */
							\esc_html__( '%1$d more points to go in the next %2$d days', 'progress-planner' ),
							(int) $prpl_remaining_points,
							(int) $prpl_days_remaining
						);
						?>
					</span>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
<?php endif; ?>
