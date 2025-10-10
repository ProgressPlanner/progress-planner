<?php
/**
 * View for the welcome widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

if ( false !== \get_option( 'progress_planner_license_key', false ) ) {
	return;
}

// Enqueue styles.
\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/welcome' );
\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/onboard' );
?>
<div class="prpl-welcome">
	<div class="welcome-header">
		<h1>
		<?php
		\printf(
			/* translators: %s: Progress Planner name. */
			\esc_html__( 'Welcome to the %s plugin!', 'progress-planner' ),
			\esc_html( \progress_planner()->get_ui__branding()->get_progress_planner_name() )
		);
		?>
		</h1>
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
							<?php /* translators: %1$s: <strong> tag, %2$s: </strong> tag */ ?>
							<?php \printf( \esc_html__( '%1$s Personalized to-dos %2$s to keep your site in great shape.', 'progress-planner' ), '<strong>', '</strong>' ); ?>
						</li>
						<li>
							<?php /* translators: %1$s: <strong> tag, %2$s: </strong> tag */ ?>
							<?php \printf( \esc_html__( '%1$s Activity stats %2$s so you can track your progress.', 'progress-planner' ), '<strong>', '</strong>' ); ?>
						</li>
						<li>
							<?php /* translators: %1$s: <strong> tag, %2$s: </strong> tag */ ?>
							<?php \printf( \esc_html__( '%1$s Helpful nudges %2$s to stay consistent with your website goals.', 'progress-planner' ), '<strong>', '</strong>' ); ?>
						</li>
					</ul>
					<?php
					\printf(
						/* translators: %s: progressplanner.com link */
						\esc_html__( 'To send these updates, we will create an account for you on %s.', 'progress-planner' ),
						'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/home' ) ) . '" target="_blank">progressplanner.com</a>'
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
							<?php \esc_html_e( 'No, I do not want emails right now.', 'progress-planner' ); ?>
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
						\printf(
							/* translators: %s: progressplanner.com/privacy-policy link */
							\esc_html__( 'I agree to the %s.', 'progress-planner' ),
							'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ) ) . '" target="_blank">Privacy policy</a>'
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
					\printf(
						/* translators: %s: progressplanner.com link */
						\esc_html__( 'Success! We saved your data on %s so we can email you every week.', 'progress-planner' ),
						'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/home' ) ) . '">ProgressPlanner.com</a>'
					);
					?>
				</p>
				<p id="prpl-account-not-created-message" style="display:none;">
					<?php
					printf(
						/* translators: %s: Progress Planner name. */
						\esc_html__( 'Success! Enjoy using the %s plugin!', 'progress-planner' ),
						\esc_html( \progress_planner()->get_ui__branding()->get_progress_planner_name() )
					);
					?>
				</p>
			</div>
		</div>
		<div class="right">
			<img
				src="<?php echo \esc_url( \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/image_onboaring_block.png' ); ?>"
				alt=""
				class="onboarding"
			/>
		</div>
	</div>
</div>
