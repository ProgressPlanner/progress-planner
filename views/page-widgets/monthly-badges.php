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

$prpl_widget = \progress_planner()->get_admin__widgets__monthly_badges();
$prpl_badge  = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );

?>
<?php if ( $prpl_badge ) : ?>
	<h2 class="prpl-widget-title">
		<?php \esc_html_e( 'Your monthly badge', 'progress-planner' ); ?>
	</h2>

	<prpl-gauge
		id="prpl-gauge-ravi"
		background="var(--prpl-background-orange)"
		color="var(--prpl-color-accent-orange)"
		data-max="<?php echo (int) Monthly::TARGET_POINTS; ?>"
		data-value="<?php echo (float) $prpl_widget->get_score()['target_score']; ?>"
		data-badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
	>
		<progress max="<?php echo (int) Monthly::TARGET_POINTS; ?>" value="<?php echo (float) $prpl_widget->get_score()['target_score']; ?>">
			<prpl-badge complete="true" badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"></prpl-badge>
		</progress>
	</prpl-gauge>

	<div class="prpl-widget-content-points">
		<span><?php \esc_html_e( 'Progress monthly badge', 'progress-planner' ); ?></span>
		<span id="prpl-widget-content-ravi-points-number" class="prpl-widget-content-points-number">
			<?php echo (int) $prpl_widget->get_score()['target_score']; ?>pt
		</span>
	</div>

	<hr>
<?php endif; ?>



<div class="prpl-widget-content">
	<?php if ( 2024 === (int) \gmdate( 'Y' ) ) : ?>
		<?php
		\progress_planner()->the_view(
			'page-widgets/parts/monthly-badges-2024.php',
			[
				'title_tag' => 'h2',
			]
		);
		?>
	<?php else : ?>

		<?php
		\progress_planner()->the_view(
			'page-widgets/parts/monthly-badges.php',
			[
				'title_year' => 2025,
			]
		);
		?>
	<?php endif; ?>
	<?php
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button(
		'',
		\esc_html__( 'Show all my badges!', 'progress-planner' )
	);
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>

<?php if ( ! empty( $prpl_widget->get_previous_incomplete_months_badges() ) ) : ?>
	<hr>

	<?php
	$prpl_remaining_points = $prpl_widget->get_score()['target'] - $prpl_widget->get_score()['target_score'];
	$prpl_days_remaining   = (int) \gmdate( 't' ) - (int) \gmdate( 'j' );
	?>
	<div class="prpl-previous-month-badge-progress-bars-wrapper">
		<h3><?php \esc_html_e( 'Oh no! You missed the previous monthly badge!', 'progress-planner' ); ?></h3>
		<p class="prpl-previous-month-badge-progress-bars-wrapper-description"><?php echo \wp_kses( \__( 'No worries though! <strong>Collect the surplus of points</strong> you earn, and get your badge!', 'progress-planner' ), [ 'strong' => [] ] ); ?></p>
		<?php foreach ( $prpl_widget->get_previous_incomplete_months_badges() as $prpl_previous_incomplete_month_badge ) : ?>
			<?php $prpl_remaining_points += $prpl_previous_incomplete_month_badge->progress_callback()['remaining']; ?>
			<div
				class="prpl-previous-month-badge-progress-bar-wrapper"
				style="padding: 1rem 0; border-radius: 0.5rem; padding: 0.75rem 1rem;"
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
							\esc_html( _n( '%1$d more points to go - %2$d day left', '%1$d more points to go - %2$d days left', (int) $prpl_days_remaining, 'progress-planner' ) ),
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
