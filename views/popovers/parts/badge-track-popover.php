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

$prpl_is_streak = ! ( isset( $args['context'] ) && 'content' === $args['context'] );
$prpl_track     = $prpl_is_streak
	? \progress_planner()->get_admin__widgets__badge_streak_maintenance()->get_track()
	: \progress_planner()->get_admin__widgets__badge_streak_content()->get_track();

if ( empty( $prpl_track['badges'] ) ) {
	return;
}

$prpl_all_collected = null === $prpl_track['next'];
$prpl_next_to_go    = null === $prpl_track['next'] ? 0 : (int) $prpl_track['next']['remaining'];
$prpl_badge_count   = \count( $prpl_track['badges'] );
$prpl_max_target    = (int) \end( $prpl_track['badges'] )['target'];
$prpl_branding_id   = (int) \progress_planner()->get_ui__branding()->get_branding_id();

// Where a number sits on the track, as a percentage.
$prpl_position = fn( $number ) => \min( 100, \max( 0, 100 * (int) $number / \max( 1, $prpl_max_target ) ) );

// Wrap a number in <strong>, formatted for the site's locale.
$prpl_strong = fn( $number ) => '<strong>' . \esc_html( \number_format_i18n( (int) $number ) ) . '</strong>';

/*
 * The texts that differ between the streak and the content popover. Texts
 * with a number are functions of that number, so they use the right plural.
 */
$prpl_text = $prpl_is_streak
	? [
		'title'       => \__( 'Your streak badges', 'progress-planner' ),
		'intro_title' => \__( 'Don’t break your streak!', 'progress-planner' ),
		'intro'       => \__( 'Consistent action is the key to a better website. Complete at least one recommended task every week to steadily improve your site’s performance.', 'progress-planner' ),
		/* translators: Shown under a number of weeks. */
		'next'        => fn( $n ) => \_n( 'week to go till your next badge', 'weeks to go till your next badge', $n, 'progress-planner' ),
		/* translators: Shown under a number of weeks. */
		'card'        => fn( $n ) => \_n( 'week streak!', 'week streak!', $n, 'progress-planner' ),
		/* translators: %d: The number of badges. */
		'all'         => fn( $n ) => \_n( '<strong>Well done!</strong> You’ve collected %d streak badge!', '<strong>Well done!</strong> You’ve collected all %d streak badges!', $n, 'progress-planner' ),
		/* translators: Shown after a number of weeks. */
		'unit'        => fn( $n ) => \_n( 'week', 'weeks', $n, 'progress-planner' ),
		/* translators: %s: The number of weeks. */
		'to_go'       => fn( $n ) => \_n( '%s week to go', '%s weeks to go', $n, 'progress-planner' ),
		/* translators: %s: The number of weeks, in bold. */
		'goal'        => fn( $n ) => \_n( '%s week streak', '%s week streak', $n, 'progress-planner' ),
	]
	: [
		'title'       => \__( 'Your content badges', 'progress-planner' ),
		'intro_title' => \__( 'Keep adding posts and pages', 'progress-planner' ),
		'intro'       => \__( 'The more you write, the sooner you unlock new badges. You can earn level 1 of this badge immediately after installing the plugin if you have written 20 or more blog posts.', 'progress-planner' ),
		/* translators: Shown under a number of posts or pages. */
		'next'        => fn( $n ) => \_n( 'post or page to go till your next badge', 'posts or pages to go till your next badge', $n, 'progress-planner' ),
		/* translators: Shown under a number of posts or pages. */
		'card'        => fn( $n ) => \_n( 'post or page written', 'posts or pages written', $n, 'progress-planner' ),
		/* translators: %d: The number of badges. */
		'all'         => fn( $n ) => \_n( '<strong>Well done!</strong> You’ve collected %d content badge!', '<strong>Well done!</strong> You’ve collected all %d content badges!', $n, 'progress-planner' ),
		/* translators: Shown after a number of posts or pages. */
		'unit'        => fn( $n ) => \_n( 'post/page', 'posts/pages', $n, 'progress-planner' ),
		/* translators: %s: The number of posts or pages. */
		'to_go'       => fn( $n ) => \_n( '%s post/page to go', '%s posts/pages to go', $n, 'progress-planner' ),
		/* translators: %s: The number of posts or pages, in bold. */
		'goal'        => fn( $n ) => \_n( '%s new post/page', '%s new posts/pages', $n, 'progress-planner' ),
	];

// The streak card shows the current streak; the content card the posts written.
$prpl_card_number = $prpl_is_streak ? $prpl_track['streak'] : $prpl_track['value'];
?>
<h2 class="screen-reader-text"><?php echo \esc_html( $prpl_text['title'] ); ?></h2>

<div class="prpl-badge-track-popover prpl-badge-track-<?php echo $prpl_is_streak ? 'maintenance' : 'content'; ?>">
	<div class="prpl-badges-summary">
		<div class="prpl-badges-summary-intro">
			<p><strong><?php echo \esc_html( $prpl_text['intro_title'] ); ?></strong></p>
			<p><?php echo \esc_html( $prpl_text['intro'] ); ?></p>
		</div>

		<div class="prpl-badges-stat">
			<?php if ( $prpl_all_collected ) : ?>
				<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_track['earned'] ) ); ?></span>
				<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'badge earned', 'badges earned', $prpl_track['earned'], 'progress-planner' ) ); ?></span>
			<?php else : ?>
				<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_next_to_go ) ); ?></span>
				<span class="prpl-badges-stat-label"><?php echo \esc_html( $prpl_text['next']( $prpl_next_to_go ) ); ?></span>
			<?php endif; ?>
		</div>

		<div class="prpl-badges-stat">
			<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_card_number ) ); ?></span>
			<span class="prpl-badges-stat-label"><?php echo \esc_html( $prpl_text['card']( $prpl_card_number ) ); ?></span>
		</div>
	</div>

	<p class="prpl-badge-track-message">
		<?php
		if ( $prpl_all_collected ) {
			echo \wp_kses( \sprintf( $prpl_text['all']( $prpl_badge_count ), $prpl_badge_count ), [ 'strong' => [] ] );
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
				<?php echo \esc_html( $prpl_text['unit']( $prpl_track['value'] ) ); ?>
			</span>
		<?php endif; ?>

		<span class="prpl-badge-track-line"><span class="prpl-badge-track-fill"></span></span>

		<?php if ( null !== $prpl_track['freeze_week'] ) : ?>
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
			<?php
			$prpl_badge = $prpl_item['badge'];
			if ( 'content-curator' === $prpl_badge->get_id() ) {
				$prpl_goal = \sprintf(
					/* translators: 1: The number of existing posts, 2: the number of new posts, both in bold. */
					\__( '%1$s existing or %2$s new posts/pages', 'progress-planner' ),
					$prpl_strong( \Progress_Planner\Badges\Content\Content_Curator::TARGET_EXISTING ),
					$prpl_strong( $prpl_item['target'] )
				);
			} else {
				$prpl_goal = \sprintf( $prpl_text['goal']( $prpl_item['target'] ), $prpl_strong( $prpl_item['target'] ) );
			}
			?>
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
						badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
						badge-name="<?php echo \esc_attr( $prpl_badge->get_name() ); ?>"
						branding-id="<?php echo (int) $prpl_branding_id; ?>"
					></prpl-badge>
				</span>
				<span class="prpl-badge-track-badge-text">
					<?php if ( $prpl_item['earned'] ) : ?>
						<span class="prpl-badge-earned-check"><span class="screen-reader-text"><?php \esc_html_e( 'Earned', 'progress-planner' ); ?></span></span>
					<?php else : ?>
						<span class="prpl-badge-to-go"><?php echo \esc_html( \sprintf( $prpl_text['to_go']( $prpl_item['remaining'] ), \number_format_i18n( $prpl_item['remaining'] ) ) ); ?></span>
					<?php endif; ?>
					<span class="prpl-badge-track-badge-goal"><?php echo \wp_kses( $prpl_goal, [ 'strong' => [] ] ); ?></span>
					<span class="prpl-badge-track-badge-name"><?php echo \esc_html( $prpl_badge->get_name() ); ?></span>
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
