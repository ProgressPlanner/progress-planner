<?php
/**
 * View for the welcome widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Badges\Monthly;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( false !== \get_option( 'progress_planner_license_key', false ) ) {
	return;
}

// Enqueue welcome styles.
\wp_enqueue_style(
	'progress-planner-welcome',
	PROGRESS_PLANNER_URL . '/assets/css/welcome.css',
	[],
	\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/welcome.css' )
);

// Enqueue onboarding styles.
\wp_enqueue_style(
	'progress-planner-onboard',
	PROGRESS_PLANNER_URL . '/assets/css/onboard.css',
	[],
	\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/onboard.css' )
);


?>
<div class="prpl-welcome">
	<div class="welcome-header">
		<h1><?php \esc_html_e( 'Welcome to the Progress Planner plugin!', 'progress-planner' ); ?></h1>
		<span class="welcome-header-icon">
			<span class="slant"></span>
			<?php \progress_planner()->the_asset( 'images/icon_progress_planner.svg' ); ?>
		</span>
	</div>
	<div class="inner-content">
		<div class="left">
			<form id="prpl-onboarding-form">
				<div class="prpl-form-notice">
					<strong class="prpl-form-notice-title"><?php \esc_html_e( 'Stay on track with weekly updates', 'progress-planner' ); ?></strong>
					<ul>
						<li>
						<?php
						/* translators: %s: <strong> tag */
						printf( \esc_html__( '%1$s Personalized to-do’s %2$s to keep your site in great shape.', 'progress-planner' ), '<strong>', '</strong>' );
						?>
						</li>
						<li>
						<?php
						/* translators: %s: <strong> tag */
						printf( \esc_html__( '%1$s Activity stats %2$s so you can track your progress.', 'progress-planner' ), '<strong>', '</strong>' );
						?>
						</li>
						<li>
						<?php
						/* translators: %s: <strong> tag */
						printf( \esc_html__( '%1$s Helpful nudges %2$s to stay consistent with your website goals.', 'progress-planner' ), '<strong>', '</strong>' );
						?>
						</li>
					</ul>
					<?php
					printf(
						/* translators: %s: progressplanner.com link */
						\esc_html__( 'To send these updates, we’ll create an account for you on %s.', 'progress-planner' ),
						'<a href="https://prpl.fyi/home" target="_blank">progressplanner.com</a>'
					)
					?>
				</div>
				<br>
				<strong><?php \esc_html_e( 'Choose your preference:', 'progress-planner' ); ?></strong>
				<div class="prpl-onboard-form-radio-select">
					<label>
						<input type="radio" name="with-email" value="yes" checked>
						<span class="prpl-label-content">
							<?php \esc_html_e( 'Yes, send me weekly updates!', 'progress-planner' ); ?>
						</span>
					</label>
					<label>
						<input type="radio" name="with-email" value="no">
						<span class="prpl-label-content">
							<?php \esc_html_e( 'No, I don’t want emails right now.', 'progress-planner' ); ?>
						</span>
					</label>
				</div>
				<br>
				<div class="prpl-form-fields">
					<label>
						<span class="prpl-label-content">
							<?php \esc_html_e( 'First name', 'progress-planner' ); ?>
						</span>
						<input
							type="text"
							name="name"
							class="prpl-input"
							required
							value="<?php echo \esc_attr( \get_user_meta( \wp_get_current_user()->ID, 'first_name', true ) ); // @phpstan-ignore-line argument.type ?>"
						>
					</label>
					<label>
						<span class="prpl-label-content">
							<?php \esc_html_e( 'Email', 'progress-planner' ); ?>
						</span>
						<input
							type="email"
							name="email"
							class="prpl-input"
							required
							value="<?php echo \esc_attr( \wp_get_current_user()->user_email ); ?>"
						>
					</label>
					<input
						type="hidden"
						name="site"
						value="<?php echo \esc_attr( \set_url_scheme( \site_url() ) ); ?>"
					>
					<input
						type="hidden"
						name="timezone_offset"
						value="<?php echo (float) ( \wp_timezone()->getOffset( new \DateTime( 'midnight' ) ) / 3600 ); ?>"
					>
				</div>
				<br>
				<div class="prpl-form-notice">
					<label>
						<input
							type="checkbox"
							name="privacy-policy"
							class="prpl-input"
							required="required"
							value="1"
						>
						<?php
						printf(
						/* translators: %s: progressplanner.com/privacy-policy link */
							\esc_html__( 'I agree to the %s.', 'progress-planner' ),
							'<a href="https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy" target="_blank">Privacy policy</a>'
						);
						?>
					</label>
				</div>
				<br>
				<div id="prpl-onboarding-submit-wrapper" class="prpl-disabled">
					<div id="prpl-onboarding-submit-grid-wrapper">
						<span>
							<input
								type="submit"
								value="<?php \esc_attr_e( 'Get going and send me weekly emails', 'progress-planner' ); ?>"
								class="prpl-button-primary"
							>
						</span>
					</div>
					<input
						type="submit"
						value="<?php \esc_attr_e( 'Continue without emailing me', 'progress-planner' ); ?>"
						class="prpl-button-secondary prpl-button-secondary--no-email prpl-hidden"
					>
				</div>
			</form>

			<div>
				<p id="prpl-account-created-message" style="display:none;">
					<?php
					printf(
						/* translators: %s: progressplanner.com link */
						\esc_html__( 'Success! We saved your data on %s so we can email you every week.', 'progress-planner' ),
						'<a href="https://prpl.fyi/home">ProgressPlanner.com</a>'
					);
					?>
				</p>
				<p id="prpl-account-not-created-message" style="display:none;">
					<?php
					printf(
						\esc_html__( 'Success! Enjoy using the Progress Planner plugin!', 'progress-planner' ),
					);
					?>
				</p>
				<?php
				// WIP: This is a temporary solution to display the completed tasks during onboarding.
				$prpl_task_providers = \progress_planner()->get_plugin_upgrade_handler()->get_onboarding_task_providers();
				if ( ! empty( $prpl_task_providers ) ) :

					$prpl_badge  = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );
					?>
				<div id="prpl-onboarding-tasks" style="display:none;">
					<strong class="prpl-onboarding-tasks-title"><?php \esc_html_e( "Let's check off what you've already done! We're checking your site now—this will only take a minute...", 'progress-planner' ); ?></strong>
					<ul class="prpl-onboarding-tasks-list">
					<?php
					foreach ( $prpl_task_providers as $prpl_task_provider ) {
						$prpl_task_details = $prpl_task_provider['task_provider']->get_task_details();

						if ( $prpl_task_provider['completed'] ) {
							// Change the task status to pending celebration.
							\progress_planner()->get_suggested_tasks()->mark_task_as_pending_celebration( $prpl_task_details['task_id'] );

							// Insert an activity.
							\progress_planner()->get_suggested_tasks()->insert_activity( $prpl_task_details['task_id'] );
						}
						?>
							<li class="prpl-onboarding-task" data-prpl-task-completed="<?php echo $prpl_task_provider['completed'] ? 'true' : 'false'; ?>">
								<span class="prpl-onboarding-task-title"><?php echo \esc_html( $prpl_task_details['title'] ); ?></span>
								<span class="prpl-onboarding-task-meta">
									<span class="prpl-suggested-task-points">
										+<?php echo \esc_html( $prpl_task_details['points'] ); ?>
									</span>
									<span class="prpl-suggested-task-points-loader"></span>
									<span class="icon icon-check-circle">
										<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
									</span>
									<span class="icon icon-exclamation-circle">
										<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
									</span>
								</span>
							</li>
						<?php
					}
					?>
					</ul>
					<div class="prpl-onboarding-tasks-footer">
						<span class="prpl-onboarding-tasks-montly-badge">
							<span class="prpl-onboarding-tasks-montly-badge-image">
								<img
									src="<?php echo \progress_planner()->get_remote_server_root_url(); ?>/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
									alt="Badge"
								onerror="this.onerror=null;this.src='<?php echo \progress_planner()->get_placeholder_svg(); ?>';"
								/>
							</span>
							<?php \esc_html_e( 'These tasks contribute to your monthly badge—every check completed brings you closer!', 'progress-planner' ); ?>
						</span>
						<span class="prpl-onboarding-tasks-total-points">
							0pt
						</span>
					</div>
				</div>
				<?php endif; ?>

				<div id="progress-planner-scan-progress" style="display:none;">
					<progress value="0" max="100"></progress>
				</div>
			</div>
		</div>
		<div class="right">
			<img
				src="<?php echo \esc_url( PROGRESS_PLANNER_URL . '/assets/images/image_onboaring_block.png' ); ?>"
				alt=""
				class="onboarding"
			/>
		</div>
	</div>
</div>
