<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Badges\Monthly;

?>
<div class="prpl-dashboard-widget">
	<div>
		<prpl-gauge background="#fff" color="var(--prpl-color-accent-orange)" contentFontSize="var(--prpl-font-size-4xl)" contentPadding="var(--prpl-padding)" marginBottom="0">
			<progress max="<?php echo (int) Monthly::TARGET_POINTS; ?>" value="<?php echo (float) \progress_planner()->get_widgets__suggested_tasks()->get_score(); ?>">
				<prpl-badge
					complete="true"
					badge-id="<?php echo esc_attr( Monthly::get_badge_id_from_date( new \DateTime() ) ); ?>"
				></prpl-badge>
			</progress>
		</prpl-gauge>
		<?php \esc_html_e( 'Monthly badge', 'progress-planner' ); ?>
	</div>

	<div>
		<prpl-gauge background="#fff" color="<?php echo esc_attr( \progress_planner()->get_widgets__activity_scores()->get_gauge_color( \progress_planner()->get_widgets__activity_scores()->get_score() ) ); ?>" contentFontSize="var(--prpl-font-size-5xl)" contentPadding="var(--prpl-padding)" marginBottom="0">
			<progress max="100" value="<?php echo (float) \progress_planner()->get_widgets__activity_scores()->get_score(); ?>">
				<?php echo \esc_html( \progress_planner()->get_widgets__activity_scores()->get_score() ); ?>
			</progress>
		</prpl-gauge>
		<?php \esc_html_e( 'Website activity score', 'progress-planner' ); ?>
	</div>
</div>

<hr style="margin: 1rem 0">

<h3><?php \esc_html_e( 'Ravi\'s Recommendations', 'progress-planner' ); ?></h3>
<ul style="display:none"></ul>
<ul class="prpl-suggested-tasks-list"></ul>

<?php if ( \current_user_can( 'manage_options' ) ) : ?>
	<div class="prpl-dashboard-widget-footer">
		<img src="<?php echo \esc_attr( PROGRESS_PLANNER_URL . '/assets/images/icon_progress_planner.svg' ); ?>" style="width:1.85em;" alt="" />
		<a href="<?php echo \esc_url( \get_admin_url( null, 'admin.php?page=progress-planner' ) ); ?>">
			<?php
			$prpl_pending_celebration_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by_status( 'pending_celebration' );
			if ( $prpl_pending_celebration_tasks ) {

				$prpl_notification_count = \count( $prpl_pending_celebration_tasks );

				printf(
					/* translators: %s: Number of pending celebration tasks. */
					esc_html( _n( 'Good job! You\'ve successfully finished %s task! Click here to celebrate your achievement!', 'Good job! You\'ve successfully finished %s tasks! Click here to celebrate your achievement!', $prpl_notification_count, 'progress-planner' ) ),
					esc_html( number_format_i18n( $prpl_notification_count ) )
				);

			} else {
				\esc_html_e( 'Check out all your stats and recommendations', 'progress-planner' );
			}

			?>
		</a>
	</div>
<?php endif; ?>
