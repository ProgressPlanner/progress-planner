<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_widgets__suggested_tasks();
$prpl_badge  = \progress_planner()->get_badges()->get_badge( 'monthly-' . gmdate( 'Y' ) . '-m' . (int) gmdate( 'm' ) );
?>
<?php if ( $prpl_badge ) : ?>
<h2 class="prpl-widget-title">
	<?php \esc_html_e( 'Your monthly badge', 'progress-planner' ); ?>
</h2>

	<prpl-gauge background="var(--prpl-background-orange)" color="var(--prpl-color-accent-orange)">
		<progress max="<?php echo (int) \Progress_Planner\Badges\Monthly::TARGET_POINTS; ?>" value="<?php echo (float) $prpl_widget->get_score(); ?>">
		<prpl-badge complete="true" badge-id="<?php echo esc_attr( $prpl_badge->get_id() ); ?>"></prpl-badge>
	</progress>
</prpl-gauge>

<div class="prpl-widget-content-points">
	<span><?php \esc_html_e( 'Progress monthly badge', 'progress-planner' ); ?></span>
	<span class="prpl-widget-content-points-number">
		<?php echo (int) $prpl_widget->get_score(); ?>pt
	</span>
</div>

<hr>
<?php endif; ?>

<div class="prpl-dashboard-widget-suggested-tasks">
	<h2 class="prpl-widget-title">
		<?php \esc_html_e( 'Ravi\'s recommendations', 'progress-planner' ); ?>

		<div class="tooltip-actions">
			<button
				class="prpl-info-icon"
				onclick="this.closest( '.tooltip-actions' ).querySelector( '.prpl-tooltip' ).toggleAttribute( 'data-tooltip-visible' )"
			>
				<span class="icon prpl-info-icon">
					<?php \progress_planner()->the_asset( 'images/icon_info.svg' ); ?>
				</span>
				<span class="screen-reader-text"><?php \esc_html_e( 'More info', 'progress-planner' ); ?></span>
			</button>

			<div class="prpl-tooltip">
				<?php \esc_html_e( 'Collect 7 points by completing the tasks and earn this month\'s badge.', 'progress-planner' ); ?>

				<button type="button" class="prpl-tooltip-close" onclick="this.closest( '.prpl-tooltip' ).removeAttribute( 'data-tooltip-visible' )">
					<span class="dashicons dashicons-no-alt"></span>
					<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
				</button>
			</div>
		</div>
	</h2>

	<ul style="display:none"></ul>
	<ul class="prpl-suggested-tasks-list"></ul>
</div>

<div class="prpl-widget-content">
	<?php if ( 2024 === (int) gmdate( 'Y' ) ) : ?>
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
	\progress_planner()->get_popover()->the_popover( 'monthly-badges' )->render_button(
		'',
		\esc_html__( 'Show all my badges!', 'progress-planner' )
	);
	\progress_planner()->get_popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>
