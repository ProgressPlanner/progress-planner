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
		\esc_html__( 'Show all badges', 'progress-planner' )
	);
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>
