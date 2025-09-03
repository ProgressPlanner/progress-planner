<?php
/**
 * View for an action.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>
<span class="tooltip-action">
	<prpl-tooltip class="prpl-suggested-task-snooze">
		<slot name="open">
			<button type="button" class="prpl-suggested-task-button" data-task-id="<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" data-task-title="<?php echo \esc_attr( $prpl_data['title']['rendered'] ); ?>" data-action="snooze" data-target="snooze" title="<?php \esc_attr_e( 'Snooze', 'progress-planner' ); ?>">
				<span class="prpl-tooltip-action-text"><?php \esc_html_e( 'Snooze', 'progress-planner' ); ?></span>
				<span class="screen-reader-text"><?php \esc_html_e( 'Snooze', 'progress-planner' ); ?></span>
			</button>
		</slot>
		<slot name="content">
			<fieldset>
				<legend>
					<span><?php \esc_html_e( 'Snooze this task?', 'progress-planner' ); ?></span>
					<button type="button" class="prpl-toggle-radio-group" onclick="this.closest( '.prpl-suggested-task-snooze' ).classList.toggle( 'prpl-toggle-radio-group-open' );">
						<span class="prpl-toggle-radio-group-text"><?php \esc_html_e( 'How long?', 'progress-planner' ); ?></span>
						<span class="prpl-toggle-radio-group-arrow">&rsaquo;</span>
					</button>
				</legend>
				<div class="prpl-snooze-duration-radio-group">
					<?php
					foreach (
						[
							'1-week'   => \esc_html__( '1 week', 'progress-planner' ),
							'1-month'  => \esc_html__( '1 month', 'progress-planner' ),
							'3-months' => \esc_html__( '3 months', 'progress-planner' ),
							'6-months' => \esc_html__( '6 months', 'progress-planner' ),
							'1-year'   => \esc_html__( '1 year', 'progress-planner' ),
							'forever'  => \esc_html__( 'forever', 'progress-planner' ),
						] as $prpl_snooze_key => $prpl_snooze_value ) :
						?>
						<label>
							<input type="radio" name="snooze-duration-<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" value="<?php \esc_attr( $prpl_snooze_key ); ?>" onchange="prplSuggestedTask.snooze( <?php echo (int) $prpl_data['id']; ?>, '<?php echo \esc_attr( $prpl_snooze_key ); ?>' );">
							<?php echo \esc_html( $prpl_snooze_value ); ?>
						</label>
					<?php endforeach; ?>
				</div>
			</fieldset>
		</slot>
	</prpl-tooltip>
</span>
