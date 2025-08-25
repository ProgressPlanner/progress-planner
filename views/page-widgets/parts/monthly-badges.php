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
		$prpl_badges_per_row         = 3;
		$prpl_badges_count           = \count( $prpl_badges );
		$prpl_scroll_to_row          = 1;
		$prpl_current_month_badge_id = Monthly::get_badge_id_from_date( new \DateTime() );
		if ( 'popover' !== $prpl_location ) {
			$prpl_total_rows = (int) \ceil( $prpl_badges_count / $prpl_badges_per_row );

			// We need to know current month badge position.
			$prpl_current_month_position = 1;

			foreach ( $prpl_badges as $prpl_badge ) {
				++$prpl_current_month_position;
				if ( $prpl_current_month_badge_id === $prpl_badge->get_id() ) {
					break;
				}
			}

			$prpl_scroll_to_row = (int) \ceil( $prpl_current_month_position / $prpl_badges_per_row );

			// Always display the previous row, so user can see already completed badges.
			if ( 1 < $prpl_scroll_to_row ) {
				--$prpl_scroll_to_row;
			}

			// If we're in the first row, the top arrow should be disabled.
			$prpl_top_arrow_disabled = 1 === $prpl_scroll_to_row;

			// If we're in the row before last, the bottom arrow should be disabled (since we have 2 rows visible at a time).
			$prpl_bottom_arrow_disabled = ( $prpl_total_rows - 1 ) === $prpl_scroll_to_row;
		}
		?>

		<div class="progress-wrapper badge-group-monthly">
			<?php if ( 'popover' !== $prpl_location && 2 * $prpl_badges_per_row < $prpl_badges_count ) : ?>
				<div class="prpl-badge-row-button-wrapper <?php echo $prpl_top_arrow_disabled ? 'prpl-badge-row-button-disabled' : ''; ?>">
					<button class="prpl-badge-row-button prpl-badge-row-button-up">
						<span class="dashicons dashicons-arrow-up-alt2"></span>
					</button>
				</div>
			<?php endif; ?>

			<div class="prpl-badge-row-wrapper">
				<div class="prpl-badge-row-wrapper-inner" style="--prpl-current-row: <?php echo \esc_attr( (string) $prpl_scroll_to_row ); ?>">
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
			<?php if ( 'popover' !== $prpl_location && 2 * $prpl_badges_per_row < $prpl_badges_count ) : ?>
				<div class="prpl-badge-row-button-wrapper <?php echo $prpl_bottom_arrow_disabled ? 'prpl-badge-row-button-disabled' : ''; ?>">
					<button class="prpl-badge-row-button prpl-badge-row-button-down">
						<span class="dashicons dashicons-arrow-down-alt2"></span>
					</button>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

</div>
