<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget_details = \progress_planner()->get_admin__widgets__badge_streak_content()->get_details( 'maintenance' );
if ( ! $prpl_widget_details ) {
	return;
}
?>

<h2 class="prpl-widget-title">
	<?php
	\esc_html_e( 'Your streak badges', 'progress-planner' );
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render_button(
		'',
		'<span class="icon prpl-info-icon">' . \progress_planner()->get_asset( 'images/icon_info.svg' ) . '</span> <span class="screen-reader-text">' . \esc_html__( 'More info', 'progress-planner' ) . '</span>'
	);
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render();
	?>
</h2>

<p><?php \esc_html_e( 'Execute at least one website maintenance task every week.', 'progress-planner' ); ?></p>

<div class="prpl-latest-badges-wrapper">
	<prpl-gauge background="<?php echo \esc_attr( $prpl_widget_details->get_background() ); ?>" color="var(--prpl-color-accent-orange)">
		<progress max="100" value="<?php echo (float) $prpl_widget_details->get_progress()['progress']; ?>">
			<prpl-badge complete="true" badge-id="<?php echo \esc_attr( $prpl_widget_details->get_id() ); ?>"></prpl-badge>
		</progress>
	</prpl-gauge>
	<div class="prpl-badge-content-wrapper">
		<p style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:0;">
			<?php echo \esc_html( $prpl_widget_details->get_name() ); ?>
			<span style="font-weight:600;font-size:1.5rem;"><?php echo (float) $prpl_widget_details->get_progress()['progress']; ?>%</span>
		</p>

		<p style="margin-top:0;">
			<?php
			\printf(
				\esc_html(
					/* translators: %s: The remaining number of weeks. */
					\_n(
						'%s week to go to complete this streak!',
						'%s weeks to go to complete this streak!',
						(int) $prpl_widget_details->get_progress()['remaining'],
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( $prpl_widget_details->get_progress()['remaining'] ) )
			);
			?>
		</p>
	</div>
</div>

<hr>

<h3><?php \esc_html_e( 'Your achievements', 'progress-planner' ); ?></h3>
<div class="prpl-badges-container-achievements">
	<div class="progress-wrapper badge-group-<?php echo \esc_attr( 'maintenance' ); ?>">
		<?php foreach ( \progress_planner()->get_badges()->get_badges( 'maintenance' ) as $prpl_badge ) : ?>
			<span
				class="prpl-badge"
				data-value="<?php echo \esc_attr( $prpl_badge->get_progress()['progress'] ); ?>"
			>
				<prpl-badge
					complete="<?php echo 100 === (int) $prpl_badge->get_progress()['progress'] ? 'true' : 'false'; ?>"
					badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
				></prpl-badge>
				<p><?php echo \esc_html( $prpl_badge->get_name() ); ?></p>
			</span>
		<?php endforeach; ?>
	</div>
</div>

<?php
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button(
	'',
	\esc_html__( 'Show all badges', 'progress-planner' )
);
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
?>
