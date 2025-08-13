<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

// Get the latest completed badge.
$prpl_latest_badge = \progress_planner()->get_badges()->get_latest_completed_badge();

?>
<h2 class="prpl-widget-title">
	<?php
	echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'latest-badge',
		\esc_html__( 'Latest new badge!', 'progress-planner' )
	);
	?>
</h2>
<?php if ( ! $prpl_latest_badge ) : ?>
	<p><?php \esc_html_e( 'You haven\'t unlocked any badges yet. Hang on, you\'ll get there!', 'progress-planner' ); ?></p>
<?php else : ?>
	<p>
		<?php if ( \str_starts_with( $prpl_latest_badge->get_id(), 'monthly-' ) ) : ?>
			<?php \esc_html_e( 'Wooohoooo! Congratulations! You have earned a new badge.', 'progress-planner' ); ?>
		<?php else : ?>
			<?php
			\printf(
				/* translators: %s: The badge name. */
				\esc_html__( 'Wooohoooo! Congratulations! You have earned a new badge. You are now a %s.', 'progress-planner' ),
				'<strong>' . \esc_html( $prpl_latest_badge->get_name() ) . '</strong>'
			);
			?>
		<?php endif; ?>
	</p>
	<img
		src="<?php echo \esc_url( \progress_planner()->get_admin__widgets__latest_badge()->endpoint . $prpl_latest_badge->get_id() ); ?>"
		alt="<?php echo \esc_attr( $prpl_latest_badge->get_name() ); ?>"
		width="1200"
		height="675"
		onerror="this.onerror=null;this.src='<?php echo \esc_url( \progress_planner()->get_placeholder_svg() ); ?>';"
	/>
	<?php if ( 'no-license' !== \get_option( 'progress_planner_license_key', 'no-license' ) && ! \progress_planner()->is_local_site() ) : ?>
		<?php
		// Generate the share badge URL.
		$prpl_share_badge_url = \add_query_arg(
			[
				'badge' => $prpl_latest_badge->get_id(),
				'url'   => \home_url(),
			],
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/share-badge'
		);
		?>
		<div class="share-badge-wrapper">
			<a class="prpl-button-share-badge" href="<?php echo \esc_url( $prpl_share_badge_url ); ?>" target="_blank">
				<span class="dashicons dashicons-share"></span>
				<span class="prpl-button-share-badge-text">
					<?php \esc_html_e( 'Share', 'progress-planner' ); ?>
				</span>
			</a>
		</div>
	<?php elseif ( ! \progress_planner()->is_local_site() ) : ?>
		<?php
		\progress_planner()->get_ui__popover()->the_popover( 'subscribe-form' )->render_button(
			'',
			\esc_html__( 'Subscribe to share your badge!', 'progress-planner' )
		);
		?>
	<?php endif; ?>
<?php endif; ?>
