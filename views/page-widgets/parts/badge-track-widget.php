<?php
/**
 * The streak and content badges widgets.
 *
 * @package Progress_Planner
 *
 * Args: context (maintenance|content).
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_context = isset( $args['context'] ) && 'content' === $args['context'] ? 'content' : 'maintenance';
$prpl_track   = 'content' === $prpl_context
	? \progress_planner()->get_admin__widgets__badge_streak_content()->get_track()
	: \progress_planner()->get_admin__widgets__badge_streak_maintenance()->get_track();

if ( empty( $prpl_track['badges'] ) ) {
	return;
}

// The gauge shows progress towards the next badge, or the last one once all are earned.
$prpl_current     = $prpl_track['next'] ?? \end( $prpl_track['badges'] );
$prpl_gauge_value = \min( $prpl_track['value'], $prpl_current['target'] );
$prpl_popover_id  = 'badge-streak-' . $prpl_context;

if ( 'content' === $prpl_context ) {
	$prpl_title       = \__( 'Your content badges', 'progress-planner' );
	$prpl_intro       = \__( 'The more you work on meaningful content, the sooner you unlock new badges.', 'progress-planner' );
	$prpl_color       = 'var(--prpl-color-content-badge)';
	$prpl_value_label = \_n( 'post', 'posts', $prpl_track['value'], 'progress-planner' );
} else {
	$prpl_title       = \__( 'Your streak badges', 'progress-planner' );
	$prpl_intro       = \__( 'Execute at least one website maintenance task every week.', 'progress-planner' );
	$prpl_color       = 'var(--prpl-color-streak)';
	$prpl_value_label = \_n( 'week', 'weeks', $prpl_track['value'], 'progress-planner' );
}
?>

<?php
// The brand can replace the title; brand titles come from the branding server as HTML.
$prpl_title_html = \progress_planner()->get_ui__branding()->get_widget_title( 'badge-streak-' . $prpl_context, \esc_html( $prpl_title ) );
?>
<h2 class="prpl-widget-title">
	<?php echo $prpl_title_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</h2>

<p><?php echo \esc_html( $prpl_intro ); ?></p>

<div class="prpl-latest-badges-wrapper">
	<prpl-gauge
		background="<?php echo \esc_attr( $prpl_current['badge']->get_background() ); ?>"
		color="<?php echo \esc_attr( $prpl_color ); ?>"
		data-max="<?php echo (int) $prpl_current['target']; ?>"
		data-value="<?php echo (int) $prpl_gauge_value; ?>"
	>
		<prpl-badge
			complete="true"
			badge-id="<?php echo \esc_attr( $prpl_current['badge']->get_id() ); ?>"
			badge-name="<?php echo \esc_attr( $prpl_current['badge']->get_name() ); ?>"
			branding-id="<?php echo (int) \progress_planner()->get_ui__branding()->get_branding_id(); ?>"
		></prpl-badge>
	</prpl-gauge>
	<div class="prpl-badge-content-wrapper">
		<p class="prpl-badge-track-progress">
			<span>
				<?php
				\printf(
					/* translators: %s: The badge name. */
					\esc_html__( 'Progress %s', 'progress-planner' ),
					\esc_html( $prpl_current['badge']->get_name() )
				);
				?>
			</span>
			<span class="prpl-badge-track-value">
				<span class="prpl-badge-track-number"><?php echo \esc_html( \number_format_i18n( $prpl_track['value'] ) ); ?></span>
				<?php echo \esc_html( $prpl_value_label ); ?>
			</span>
		</p>
	</div>
</div>

<hr>

<div class="prpl-badges-container-achievements">
	<div class="progress-wrapper badge-group-<?php echo \esc_attr( $prpl_context ); ?>">
		<?php foreach ( $prpl_track['badges'] as $prpl_item ) : ?>
			<span
				class="prpl-badge"
				data-value="<?php echo \esc_attr( $prpl_item['earned'] ? '100' : '0' ); ?>"
			>
				<prpl-badge
					complete="<?php echo $prpl_item['earned'] ? 'true' : 'false'; ?>"
					badge-id="<?php echo \esc_attr( $prpl_item['badge']->get_id() ); ?>"
					badge-name="<?php echo \esc_attr( $prpl_item['badge']->get_name() ); ?>"
					branding-id="<?php echo (int) \progress_planner()->get_ui__branding()->get_branding_id(); ?>"
				></prpl-badge>
				<p><?php echo \esc_html( $prpl_item['badge']->get_name() ); ?></p>
			</span>
		<?php endforeach; ?>
	</div>
</div>

<?php if ( 'maintenance' === $prpl_context ) : ?>
	<p class="prpl-streak-freeze-line">
		<span class="prpl-streak-freeze-icon"><?php \progress_planner()->the_asset( 'images/icon_snowflake.svg' ); ?></span>
		<span>
			<?php
			if ( $prpl_track['freeze_used'] ) {
				echo \wp_kses( \__( 'You’ve already used your <strong>streak freeze</strong>.', 'progress-planner' ), [ 'strong' => [] ] );
			} else {
				echo \wp_kses( \__( 'You have one <strong>streak freeze</strong>.', 'progress-planner' ), [ 'strong' => [] ] );
			}
			?>
		</span>
	</p>
<?php endif; ?>

<?php
\progress_planner()->get_ui__popover()->the_popover( $prpl_popover_id )->render_button(
	'',
	\esc_html__( 'How can I collect these badges?', 'progress-planner' )
);
\progress_planner()->get_ui__popover()->the_popover( $prpl_popover_id )->render();
