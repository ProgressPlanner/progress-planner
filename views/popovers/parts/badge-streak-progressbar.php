<?php
/**
 * Template part.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

// Badge data is now handled in React via REST API.
// This template is kept for backward compatibility but renders empty.
// Badge display is handled by React components.
$prpl_badges = [];

// @phpstan-ignore-next-line empty.variable
if ( empty( $prpl_badges ) ) {
	return;
}
// This code is unreachable since $prpl_badges is always empty.
// Kept for backward compatibility.
?>
<div class="progress-badges">
	<span class="badges-popover-progress-total">
		<?php
		// @phpstan-ignore-next-line deadCode.unreachable
		$prpl_last_badge = \end( $prpl_badges );
		?>
		<span style="width: <?php echo $prpl_last_badge ? (int) $prpl_last_badge->get_progress()['progress'] : 0; ?>%"></span>
	</span>
	<div class="indicators">
		<?php foreach ( $prpl_badges as $prpl_badge ) : ?>
			<div class="indicator">
				<?php $prpl_badge_progress = $prpl_badge->get_progress(); ?>
				<span class="indicator-label">
					<?php if ( 0 === (int) $prpl_badge_progress['remaining'] ) : ?>
						✔️
					<?php else : ?>
						<?php
						\printf(
							'content' === $prpl_context // @phpstan-ignore-line variable.undefined
								? \esc_html(
									/* translators: The number of weeks remaining to complete the badge. */
									\_n(
										'%s post to go',
										'%s posts to go',
										(int) $prpl_badge_progress['remaining'],
										'progress-planner'
									)
								) : \esc_html(
									/* translators: The number of weeks remaining to complete the badge. */
									\_n(
										'%s week to go',
										'%s weeks to go',
										(int) $prpl_badge_progress['remaining'],
										'progress-planner'
									)
								),
							'<span class="number">' . \esc_html( \number_format_i18n( $prpl_badge_progress['remaining'] ) ) . '</span>'
						)
						?>
					<?php endif; ?>
				</span>
			</div>
		<?php endforeach; ?>
	</div>
</div>
<?php
