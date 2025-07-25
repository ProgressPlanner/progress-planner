<?php
/**
 * Icon.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Badges\Monthly;

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_task_providers = \progress_planner()->get_plugin_upgrade_tasks()->get_newly_added_task_providers();

// We have the task providers, clean them up since we don't need them anymore before the early return.
\progress_planner()->get_plugin_upgrade_tasks()->delete_upgrade_popover_task_providers();

// If there are no task providers, don't show anything.
if ( empty( $prpl_task_providers ) ) {
	return;
}

// Context can be 'onboarding' or 'upgrade'.
$prpl_context = isset( $context ) ? $context : 'upgrade';

$prpl_title = 'onboarding' === $prpl_context
	? \__( "Let's check off what you've already done! We're checking your site now—this will only take a minute...", 'progress-planner' )
	: \__( "We've added new recommendations to the Progress Planner plugin", 'progress-planner' );

$prpl_subtitle = 'onboarding' === $prpl_context
	? ''
	: \__( "Let's check if you've already done those tasks, this will take only a minute...", 'progress-planner' );

$prpl_badge = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );
?>
<div id="prpl-onboarding-tasks">
	<strong class="prpl-onboarding-tasks-title"><?php echo \esc_html( $prpl_title ); ?></strong>

	<?php if ( '' !== $prpl_subtitle ) : ?>
		<span class="prpl-onboarding-tasks-description"><?php echo \esc_html( $prpl_subtitle ); ?></span>
	<?php endif; ?>

	<ul class="prpl-onboarding-tasks-list">
		<?php foreach ( $prpl_task_providers as $prpl_task_provider ) : ?>
			<?php
			$prpl_task_data = [
				'task_id'     => $prpl_task_provider->get_task_id(),
				'provider_id' => $prpl_task_provider->get_provider_id(),
				'category'    => $prpl_task_provider->get_provider_category(),
			];

			// Note: get_post() returns a formatted array (details), not an object.
			$prpl_task = \progress_planner()->get_suggested_tasks_db()->get_post( $prpl_task_data['task_id'] );

			/**
			 * Most tasks are already added, but the "completed" tasks are not - since Tasks::should_add_task() returns false for them.
			 * We need to add them manually.
			 */
			if ( ! $prpl_task ) {
				$prpl_task_post_id = \progress_planner()->get_suggested_tasks_db()->add( $prpl_task_provider->get_task_details( $prpl_task_data ) );

				// Something went wrong, skip this task.
				if ( ! $prpl_task_post_id ) {
					continue;
				}

				// Note: get_post() returns a formatted array (details), not an object.
				$prpl_task = \progress_planner()->get_suggested_tasks_db()->get_post( $prpl_task_post_id );
			}

			// Something went wrong, skip this task.
			if ( ! $prpl_task ) {
				continue;
			}

			$prpl_task_completed = $prpl_task_provider->evaluate_task( $prpl_task_data['task_id'] );

			// If the task is completed, mark it as pending.
			if ( $prpl_task_completed ) {
				// Change the task status to pending.
				\progress_planner()->get_suggested_tasks_db()->update_recommendation( $prpl_task->ID, [ 'post_status' => 'pending' ] );

				// Insert an activity.
				\progress_planner()->get_suggested_tasks()->insert_activity( $prpl_task_data['task_id'] );
			}
			?>
				<li class="prpl-onboarding-task" data-prpl-task-completed="<?php echo $prpl_task_completed ? 'true' : 'false'; ?>">
					<h3><?php echo \esc_html( $prpl_task->post_title ); ?></h3>
					<span class="prpl-onboarding-task-status">
						<span class="prpl-suggested-task-points">
							+<?php echo \esc_html( (string) $prpl_task->points ); ?>
						</span>
						<span class="prpl-suggested-task-loader"></span>
						<span class="icon icon-check-circle">
							<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
						</span>
						<span class="icon icon-exclamation-circle">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
						</span>
					</span>
				</li>
		<?php endforeach; ?>
	</ul>

	<?php // Display badge and the points. ?>
	<?php if ( $prpl_badge ) : ?>
		<div class="prpl-onboarding-tasks-footer">
			<span class="prpl-onboarding-tasks-montly-badge">
				<span class="prpl-onboarding-tasks-montly-badge-image">
					<img
						src="<?php echo \esc_url( \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . \esc_attr( $prpl_badge->get_id() ) ); ?>"
						alt="<?php \esc_attr_e( 'Badge', 'progress-planner' ); ?>"
						onerror="this.onerror=null;this.src='<?php echo \esc_url( \progress_planner()->get_placeholder_svg() ); ?>';"
					/>
				</span>
				<?php \esc_html_e( 'These tasks contribute to your monthly badge—every check completed brings you closer!', 'progress-planner' ); ?>
			</span>
			<span class="prpl-onboarding-tasks-total-points">0pt</span>
		</div>
	<?php endif; ?>

	<button id="prpl-onboarding-continue-button" class="prpl-button-primary prpl-disabled" onclick="prplOnboardRedirect()">
		<?php \esc_html_e( 'Continue', 'progress-planner' ); ?>
	</button>
</div>

