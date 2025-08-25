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
$prpl_location  = '';
$prpl_css_class = '';

if ( isset( $args['css_class'] ) ) {
	$prpl_css_class = \esc_attr( $args['css_class'] );
}

$prpl_location    = false !== \strpos( $prpl_css_class, 'in-popover' ) ? 'popover' : 'suggested-tasks';
$prpl_badges_year = (int) isset( $args['badges_year'] ) ? $args['badges_year'] : \gmdate( 'Y' );

$prpl_previous_incomplete_month_badge_ids = [];
foreach ( \progress_planner()->get_admin__widgets__monthly_badges()->get_previous_incomplete_months_badges() as $prpl_previous_incomplete_month_badge ) {
	$prpl_previous_incomplete_month_badge_ids[] = $prpl_previous_incomplete_month_badge->get_id();
}
?>
<div class="prpl-widget-wrapper <?php echo \esc_attr( $prpl_css_class ); ?>">
	<h3 class="prpl-widget-title">
		<?php
		\printf(
			/* translators: %d: year */
			\esc_html__( 'Monthly badges %d', 'progress-planner' ),
			\esc_html( (string) $prpl_badges_year )
		);
		?>
	</h3>

	<?php $prpl_badges = Monthly::get_instances_for_year( $prpl_badges_year ); ?>
	<?php if ( $prpl_badges ) : ?>
		<?php
		if ( 'popover' !== $prpl_location && 3 < \count( $prpl_badges ) ) {
			// If we have more than 3 badges, we need to show the current month badge and the previous 2 months badges.
			$prpl_current_month_badge_id = Monthly::get_badge_id_from_date( new \DateTime() );
			$prpl_temp_badges            = [];
			foreach ( $prpl_badges as $prpl_badge ) {
				$prpl_temp_badges[] = $prpl_badge;
				if ( $prpl_current_month_badge_id === $prpl_badge->get_id() ) {
					break;
				}
			}
			$prpl_badges = \array_slice( $prpl_temp_badges, -3 ); // We show only 3 badges in page widget.
		}
		?>

		<div class="progress-wrapper badge-group-monthly">
			<div class="prpl-badge-row-wrapper">
				<?php foreach ( $prpl_badges as $prpl_badge ) : ?>
					<span
						class="prpl-badge prpl-badge-<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
						data-value="<?php echo \esc_attr( $prpl_badge->progress_callback()['progress'] ); ?>"
						data-monthly-is-missed="<?php echo \in_array( $prpl_badge->get_id(), $prpl_previous_incomplete_month_badge_ids, true ) ? 'true' : 'false'; ?>"
					>
						<prpl-badge
							complete="<?php echo 100 === (int) $prpl_badge->progress_callback()['progress'] ? 'true' : 'false'; ?>"
							badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
						></prpl-badge>
						<p><?php echo \esc_html( $prpl_badge->get_name() ); ?></p>
					</span>
				<?php endforeach; ?>
			</div>

		</div>
	<?php endif; ?>

</div>
