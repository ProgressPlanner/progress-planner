<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget_details = \progress_planner()->get_admin__widgets__badge_streak_content()->get_details( 'content' );
if ( ! $prpl_widget_details ) {
	return;
}
?>

<h2 class="prpl-widget-title">
	<?php
	\esc_html_e( 'Your content badges', 'progress-planner' );
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render_button(
		'',
		'<span class="icon prpl-info-icon">' . \progress_planner()->get_asset( 'images/icon_info.svg' ) . '</span> <span class="screen-reader-text">' . \esc_html__( 'More info', 'progress-planner' ) . '</span>'
	);
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render();
	?>
</h2>

<div class="prpl-latest-badges-wrapper">
	<prpl-gauge background="<?php echo \esc_attr( $prpl_widget_details->get_background() ); ?>" color="var(--prpl-color-accent-orange)">
		<progress max="100" value="<?php echo (float) $prpl_widget_details->get_progress()['progress']; ?>">
			<prpl-badge complete="true" badge-id="<?php echo \esc_attr( $prpl_widget_details->get_id() ); ?>"></prpl-badge>
		</progress>
	</prpl-gauge>
	<div class="prpl-badge-content-wrapper">
		<h3><?php echo \esc_html( $prpl_widget_details->get_name() ); ?></h3>
		<p>
			<?php
			\printf(
				\esc_html(
					/* translators: %s: The remaining number of posts or pages to write. */
					\_n(
						'Write %s new post or page and earn your next badge!',
						'Write %s new posts or pages and earn your next badge!',
						(int) $prpl_widget_details->get_progress()['remaining'],
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( $prpl_widget_details->get_progress()['remaining'] ) )
			)
			?>
		</p>
	</div>
</div>

<h3><?php \esc_html_e( 'Your achievements', 'progress-planner' ); ?></h3>
<div class="prpl-badges-container-achievements">
	<div class="progress-wrapper badge-group-<?php echo \esc_attr( 'content' ); ?>">
		<?php foreach ( \progress_planner()->get_badges()->get_badges( 'content' ) as $prpl_badge ) : ?>
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
