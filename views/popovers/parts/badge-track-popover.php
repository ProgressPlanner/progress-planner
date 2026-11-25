<?php
/**
 * The streak and content badges popovers.
 *
 * Args: context (maintenance|content).
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_context = isset( $args['context'] ) && 'content' === $args['context'] ? 'content' : 'maintenance';
$prpl_widget  = 'content' === $prpl_context
	? \progress_planner()->get_admin__widgets__badge_streak_content()
	: \progress_planner()->get_admin__widgets__badge_streak_maintenance();
$prpl_track   = $prpl_widget->get_track( $prpl_context );

if ( empty( $prpl_track['badges'] ) ) {
	return;
}

$prpl_is_streak     = 'maintenance' === $prpl_context;
$prpl_all_collected = null === $prpl_track['next'];
$prpl_next_to_go    = null === $prpl_track['next'] ? 0 : (int) $prpl_track['next']['remaining'];
$prpl_max_target    = (int) \end( $prpl_track['badges'] )['target'];
$prpl_branding_id   = (int) \progress_planner()->get_ui__branding()->get_branding_id();

// Where a number sits on the track, as a percentage.
$prpl_position = fn( $number ) => \min( 100, \max( 0, 100 * (int) $number / \max( 1, $prpl_max_target ) ) );

/**
 * The "N … to go" text for a badge.
 *
 * @param int $remaining The number of weeks or posts left.
 *
 * @return string
 */
$prpl_to_go = function ( $remaining ) use ( $prpl_is_streak ) {
	return \sprintf(
		$prpl_is_streak
			/* translators: %s: The number of weeks. */
			? \_n( '%s week to go', '%s weeks to go', $remaining, 'progress-planner' )
			/* translators: %s: The number of posts or pages. */
			: \_n( '%s post/page to go', '%s posts/pages to go', $remaining, 'progress-planner' ),
		\number_format_i18n( $remaining )
	);
};
?>
<h2 class="screen-reader-text">
	<?php
	echo \esc_html(
		$prpl_is_streak
			? \__( 'Your streak badges', 'progress-planner' )
			: \__( 'Your content badges', 'progress-planner' )
	);
	?>
</h2>

<div class="prpl-badge-track-popover prpl-badge-track-<?php echo \esc_attr( $prpl_context ); ?>">
	<div class="prpl-badges-summary">
		<div class="prpl-badges-summary-intro">
			<?php if ( $prpl_is_streak ) : ?>
				<p><strong><?php \esc_html_e( 'Don’t break your streak!', 'progress-planner' ); ?></strong></p>
				<p><?php \esc_html_e( 'Consistent action is the key to a better website. Complete at least one recommended task every week to steadily improve your site’s performance.', 'progress-planner' ); ?></p>
			<?php else : ?>
				<p><strong><?php \esc_html_e( 'Keep adding posts and pages', 'progress-planner' ); ?></strong></p>
				<p><?php \esc_html_e( 'The more you write, the sooner you unlock new badges. You can earn level 1 of this badge immediately after installing the plugin if you have written 20 or more blog posts.', 'progress-planner' ); ?></p>
			<?php endif; ?>
		</div>

		<div class="prpl-badges-stat">
			<?php if ( $prpl_all_collected ) : ?>
				<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_track['earned'] ) ); ?></span>
				<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'badge earned', 'badges earned', $prpl_track['earned'], 'progress-planner' ) ); ?></span>
			<?php else : ?>
				<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_next_to_go ) ); ?></span>
				<span class="prpl-badges-stat-label">
					<?php
					echo \esc_html(
						$prpl_is_streak
							? \_n( 'week to go till your next badge', 'weeks to go till your next badge', $prpl_next_to_go, 'progress-planner' )
							: \_n( 'post or page to go till your next badge', 'posts or pages to go till your next badge', $prpl_next_to_go, 'progress-planner' )
					);
					?>
				</span>
			<?php endif; ?>
		</div>

		<div class="prpl-badges-stat">
			<?php $prpl_card_number = $prpl_is_streak ? $prpl_track['streak'] : $prpl_track['value']; ?>
			<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_card_number ) ); ?></span>
			<span class="prpl-badges-stat-label">
				<?php
				echo \esc_html(
					$prpl_is_streak
						? \_n( 'week streak!', 'week streak!', $prpl_card_number, 'progress-planner' )
						: \_n( 'post or page written', 'posts or pages written', $prpl_card_number, 'progress-planner' )
				);
				?>
			</span>
		</div>
	</div>

	<p class="prpl-badge-track-message">
		<?php
		if ( $prpl_all_collected ) {
			echo \wp_kses(
				\sprintf(
					$prpl_is_streak
						/* translators: %d: The number of badges. */
						? \__( '<strong>Well done!</strong> You’ve collected all %d streak badges!', 'progress-planner' )
						/* translators: %d: The number of badges. */
						: \__( '<strong>Well done!</strong> You’ve collected all %d content badges!', 'progress-planner' ),
					\count( $prpl_track['badges'] )
				),
				[ 'strong' => [] ]
			);
		} else {
			\esc_html_e( 'Every week of hard work brings you closer to your next milestone!', 'progress-planner' );
		}
		?>
	</p>

	<div
		class="prpl-badge-track-bar"
		style="--badge-track-value: <?php echo \esc_attr( (string) ( $prpl_all_collected ? 100 : $prpl_position( $prpl_track['value'] ) ) ); ?>%;"
	>
		<?php if ( ! $prpl_all_collected ) : ?>
			<span class="prpl-badge-track-current">
				<span class="prpl-badge-track-current-number"><?php echo \esc_html( \number_format_i18n( $prpl_track['value'] ) ); ?></span>
				<?php
				echo \esc_html(
					$prpl_is_streak
						? \_n( 'week', 'weeks', $prpl_track['value'], 'progress-planner' )
						: \_n( 'post/page', 'posts/pages', $prpl_track['value'], 'progress-planner' )
				);
				?>
			</span>
		<?php endif; ?>

		<span class="prpl-badge-track-line"><span class="prpl-badge-track-fill"></span></span>

		<?php if ( $prpl_is_streak && $prpl_track['freeze_used'] && null !== $prpl_track['freeze_week'] ) : ?>
			<span
				class="prpl-badge-track-freeze"
				style="--badge-track-at: <?php echo \esc_attr( (string) $prpl_position( $prpl_track['freeze_week'] ) ); ?>%;"
				title="<?php \esc_attr_e( 'Streak freeze used', 'progress-planner' ); ?>"
			><?php \progress_planner()->the_asset( 'images/icon_snowflake.svg' ); ?></span>
		<?php endif; ?>

		<?php foreach ( $prpl_track['badges'] as $prpl_item ) : ?>
			<span
				class="prpl-badge-track-milestone<?php echo $prpl_item['earned'] ? ' is-earned' : ''; ?>"
				style="--badge-track-at: <?php echo \esc_attr( (string) $prpl_position( $prpl_item['target'] ) ); ?>%;"
			>
				<?php if ( $prpl_item['earned'] ) : ?>
					<prpl-badge
						complete="true"
						badge-id="<?php echo \esc_attr( $prpl_item['badge']->get_id() ); ?>"
						badge-name="<?php echo \esc_attr( $prpl_item['badge']->get_name() ); ?>"
						branding-id="<?php echo (int) $prpl_branding_id; ?>"
					></prpl-badge>
					<span class="prpl-badge-earned-check" aria-hidden="true"></span>
				<?php else : ?>
					<?php echo \esc_html( \number_format_i18n( $prpl_item['target'] ) ); ?>
				<?php endif; ?>
			</span>
		<?php endforeach; ?>
	</div>

	<div class="prpl-badge-track-badges">
		<?php foreach ( $prpl_track['badges'] as $prpl_item ) : ?>
			<span
				class="prpl-badge prpl-badge-track-badge"
				<?php if ( ! $prpl_item['earned'] ) : ?>
					data-state="to-go"
					tabindex="0"
				<?php endif; ?>
			>
				<span class="prpl-badge-image">
					<prpl-badge
						complete="<?php echo $prpl_item['earned'] ? 'true' : 'false'; ?>"
						badge-id="<?php echo \esc_attr( $prpl_item['badge']->get_id() ); ?>"
						badge-name="<?php echo \esc_attr( $prpl_item['badge']->get_name() ); ?>"
						branding-id="<?php echo (int) $prpl_branding_id; ?>"
					></prpl-badge>
				</span>
				<span class="prpl-badge-track-badge-text">
					<?php if ( $prpl_item['earned'] ) : ?>
						<span class="prpl-badge-earned-check"><span class="screen-reader-text"><?php \esc_html_e( 'Earned', 'progress-planner' ); ?></span></span>
					<?php else : ?>
						<span class="prpl-badge-to-go"><?php echo \esc_html( $prpl_to_go( $prpl_item['remaining'] ) ); ?></span>
					<?php endif; ?>
					<span class="prpl-badge-track-badge-goal">
						<?php
						if ( $prpl_is_streak ) {
							echo \wp_kses(
								\sprintf(
									/* translators: %s: The number of weeks, in bold. */
									\__( '%s week streak', 'progress-planner' ),
									'<strong>' . \esc_html( \number_format_i18n( $prpl_item['target'] ) ) . '</strong>'
								),
								[ 'strong' => [] ]
							);
						} elseif ( 'content-curator' === $prpl_item['badge']->get_id() ) {
							echo \wp_kses(
								\sprintf(
									/* translators: 1: The number of existing posts, 2: the number of new posts, both in bold. */
									\__( '%1$s existing or %2$s new posts/pages', 'progress-planner' ),
									'<strong>' . \esc_html( \number_format_i18n( 20 ) ) . '</strong>',
									'<strong>' . \esc_html( \number_format_i18n( $prpl_item['target'] ) ) . '</strong>'
								),
								[ 'strong' => [] ]
							);
						} else {
							echo \wp_kses(
								\sprintf(
									/* translators: %s: The number of posts or pages, in bold. */
									\__( '%s new posts/pages', 'progress-planner' ),
									'<strong>' . \esc_html( \number_format_i18n( $prpl_item['target'] ) ) . '</strong>'
								),
								[ 'strong' => [] ]
							);
						}
						?>
					</span>
					<span class="prpl-badge-track-badge-name"><?php echo \esc_html( $prpl_item['badge']->get_name() ); ?></span>
				</span>
			</span>
		<?php endforeach; ?>
	</div>

	<?php if ( $prpl_is_streak ) : ?>
		<div class="prpl-streak-freeze">
			<span class="prpl-streak-freeze-icon"><?php \progress_planner()->the_asset( 'images/icon_snowflake.svg' ); ?></span>
			<div>
				<p><strong><?php \esc_html_e( 'Streak freeze', 'progress-planner' ); ?></strong></p>
				<p>
					<?php
					if ( $prpl_track['freeze_used'] ) {
						\esc_html_e( 'You’ve already used your streak freeze.', 'progress-planner' );
					} else {
						\esc_html_e( 'Not able to work on your site? You can skip your website maintenance for a maximum of one week. Your streak will continue afterward.', 'progress-planner' );
					}
					?>
				</p>
			</div>
		</div>
	<?php endif; ?>
</div>
