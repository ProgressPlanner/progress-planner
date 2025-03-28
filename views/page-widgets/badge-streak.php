<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget                 = \progress_planner()->get_admin__widgets__badge_streak();
$prpl_widget_context_details = [];
if ( $prpl_widget->get_details( 'content' ) ) {
	$prpl_widget_context_details['content'] = [
		'text' => sprintf(
			\esc_html(
				/* translators: %s: The remaining number of posts or pages to write. */
				\_n(
					'Write %s new post or page and earn your next badge!',
					'Write %s new posts or pages and earn your next badge!',
					(int) $prpl_widget->get_details( 'content' )->get_progress()['remaining'],
					'progress-planner'
				)
			),
			\esc_html( \number_format_i18n( $prpl_widget->get_details( 'content' )->get_progress()['remaining'] ) )
		),
	];
}
if ( $prpl_widget->get_details( 'maintenance' ) ) {
	$prpl_widget_context_details['maintenance'] = [
		'text' => sprintf(
			\esc_html(
				/* translators: %s: The remaining number of weeks. */
				\_n(
					'%s week to go to complete this streak!',
					'%s weeks to go to complete this streak!',
					(int) $prpl_widget->get_details( 'maintenance' )->get_progress()['remaining'],
					'progress-planner'
				)
			),
			\esc_html( \number_format_i18n( $prpl_widget->get_details( 'maintenance' )->get_progress()['remaining'] ) )
		),
	];
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

<div class="prpl-latest-badges-wrapper">
	<?php
	$prpl_current_context = 0;
	$prpl_contexts_count  = count( array_keys( $prpl_widget_context_details ) );
	?>
	<?php foreach ( $prpl_widget_context_details as $prpl_context => $prpl_details ) : ?>
		<?php ++$prpl_current_context; ?>
		<prpl-gauge background="<?php echo \esc_attr( $prpl_widget->get_details( $prpl_context )->get_background() ); ?>" color="var(--prpl-color-accent-orange)">
			<progress max="100" value="<?php echo (float) $prpl_widget->get_details( $prpl_context )->get_progress()['progress']; ?>">
				<prpl-badge complete="true" badge-id="<?php echo esc_attr( $prpl_widget->get_details( $prpl_context )->get_id() ); ?>"></prpl-badge>
			</progress>
		</prpl-gauge>
		<div class="prpl-badge-content-wrapper">
			<h3><?php echo \esc_html( $prpl_widget->get_details( $prpl_context )->get_name() ); ?></h3>
			<p><?php echo \esc_html( $prpl_details['text'] ); ?></p>
		</div>
		<?php if ( $prpl_current_context < $prpl_contexts_count ) : ?>
			<hr>
		<?php endif; ?>
	<?php endforeach; ?>
</div>

<h3><?php esc_html_e( 'Your achievements', 'progress-planner' ); ?></h3>
<div class="prpl-badges-container-achievements">
	<?php
	foreach ( [ 'content', 'maintenance' ] as $prpl_badge_group ) :
		$prpl_group_badges = \progress_planner()->get_badges()->get_badges( $prpl_badge_group );
		?>
		<div class="progress-wrapper badge-group-<?php echo \esc_attr( $prpl_badge_group ); ?>">
			<?php foreach ( $prpl_group_badges as $prpl_badge ) : ?>
				<?php
				$prpl_badge_progress  = $prpl_badge->get_progress();
				$prpl_badge_completed = 100 === (int) $prpl_badge_progress['progress'];
				?>
				<span
					class="prpl-badge"
					data-value="<?php echo \esc_attr( $prpl_badge_progress['progress'] ); ?>"
				>
					<prpl-badge
						complete="<?php echo $prpl_badge_completed ? 'true' : 'false'; ?>"
						badge-id="<?php echo esc_attr( $prpl_badge->get_id() ); ?>"
					></prpl-badge>
					<p><?php echo \esc_html( $prpl_badge->get_name() ); ?></p>
				</span>
			<?php endforeach; ?>
		</div>
	<?php endforeach; ?>
</div>
