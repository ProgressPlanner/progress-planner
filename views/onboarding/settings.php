<?php
/**
 * Tour step view - Settings (About, Contact, FAQ pages, Post Types, Login Destination).
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

// Get page types for About, Contact, and FAQ.
$prpl_page_types = [
	'homepage' => [
		'id'          => 'homepage',
		'title'       => __( 'Home page', 'progress-planner' ),
		'description' => \esc_html__( 'Help us understand your site a little better so we can give you more useful recommendations. Let\'s start with the home page.', 'progress-planner' ),
		'note'        => __( 'A Home page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
	],
	'about'    => [
		'id'          => 'about',
		'title'       => __( 'About page', 'progress-planner' ),
		'description' => \esc_html__( 'Next up, pick the page you use as your about page.', 'progress-planner' ),
		'note'        => __( 'An About page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
	],
	'contact'  => [
		'id'          => 'contact',
		'title'       => __( 'Contact page', 'progress-planner' ),
		'description' => \esc_html__( 'Now choose the page you use as your contact page.', 'progress-planner' ),
		'note'        => __( 'A Contact page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
	],
	'faq'      => [
		'id'          => 'faq',
		'title'       => __( 'FAQ page', 'progress-planner' ),
		'description' => \esc_html__( 'Next, pick the page you use as your FAQ page.', 'progress-planner' ),
		'note'        => __( 'An FAQ page is important. We\'ll remind you to make one at a later time.', 'progress-planner' ),
	],
];

// Get post types for the post types sub-step.
$prpl_saved_settings = \progress_planner()->get_settings()->get_post_types_names();
$prpl_post_types     = \progress_planner()->get_settings()->get_public_post_types();

// Get redirect on login setting.
$prpl_redirect_on_login = \get_user_meta( \get_current_user_id(), 'prpl_redirect_on_login', true );

$prpl_total_number_of_steps = 5;
$prpl_current_step_number   = 0;

?>

<!-- Tour step settings -->
<script type="text/template" id="onboarding-step-settings">
	<!-- <div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Settings', 'progress-planner' ); ?>
			<span class="prpl-settings-progress">1/5</span>
		</h2>
	</div> -->
	<div class="tour-content">
		<?php foreach ( $prpl_page_types as $prpl_page_type ) : ?>
			<?php ++$prpl_current_step_number; ?>
			<div class="prpl-setting-item" data-page="<?php echo \esc_attr( $prpl_page_type['id'] ); ?>">
				<div class="prpl-columns-wrapper-flex prpl-columns-1-2">
					<div class="prpl-column prpl-column-content">
						<p><?php echo \esc_html( $prpl_page_type['description'] ); ?></p>
					</div>
					<div class="prpl-column">
						<div class="prpl-setting-header">
							<h3 class="prpl-setting-title">
								<?php \esc_html_e( 'Settings:', 'progress-planner' ); ?> <?php echo \esc_html( $prpl_page_type['title'] ); ?>
								<span class="prpl-settings-progress"><?php echo \esc_html( $prpl_current_step_number ); ?>/<?php echo \esc_html( $prpl_total_number_of_steps ); ?></span>
							</h3>
						</div>

						<div class="prpl-setting-content">
							<div class="prpl-select-page">
								<?php
								\wp_dropdown_pages(
									[
										'name'             => 'pages[' . \esc_attr( $prpl_page_type['id'] ) . '][id]',
										'show_option_none' => '&mdash; ' . \esc_html__( 'Select page', 'progress-planner' ) . ' &mdash;',
										'selected'         => '',
										'id'               => 'prpl-select-' . \esc_attr( $prpl_page_type['id'] ),
									]
								);
								?>
							</div>

							<div class="prpl-checkbox-wrapper">
								<label>
									<input
										type="checkbox"
										id="prpl-no-<?php echo \esc_attr( $prpl_page_type['id'] ); ?>-page"
									>
									<?php
									\printf(
										/* translators: %s: page type title */
										\esc_html__( 'I don\'t have a %s yet', 'progress-planner' ),
										\esc_html( $prpl_page_type['title'] )
									);
									?>
								</label>
							</div>
						</div>
						<div class="prpl-setting-footer">
							<div class="prpl-setting-note">
								<span class="prpl-setting-note-icon">
									i
								</span>
								<p>
									<?php echo \esc_html( $prpl_page_type['note'] ); ?>
								</p>
							</div>
							<button
								type="button"
								id="prpl-save-<?php echo \esc_attr( $prpl_page_type['id'] ); ?>-setting"
								class="prpl-btn prpl-save-setting-btn"
								disabled
							>
								<?php \esc_html_e( 'Save setting', 'progress-planner' ); ?>
							</button>
						</div>
					</div>
				</div>
			</div>
		<?php endforeach; ?>

		<!-- Post Types sub-step -->
		<?php if ( ! empty( $prpl_post_types ) ) : ?>
			<?php ++$prpl_current_step_number; ?>
			<div class="prpl-setting-item" data-page="post-types">
				<div class="prpl-columns-wrapper-flex">
					<div class="prpl-column prpl-column-content">
						<p><?php echo \esc_html( $prpl_page_type['description'] ); ?></p>
					</div>
					<div class="prpl-column">
						<div class="prpl-setting-header">
							<h3 class="prpl-setting-title">
								<?php \esc_html_e( 'Settings:', 'progress-planner' ); ?> <?php \esc_html_e( 'Valuable post types', 'progress-planner' ); ?>
								<span class="prpl-settings-progress"><?php echo \esc_html( $prpl_current_step_number ); ?>/<?php echo \esc_html( $prpl_total_number_of_steps ); ?></span>
							</h3>
							<p>
								<?php \esc_html_e( 'Choose the post types you actively use for your content.', 'progress-planner' ); ?>
							</p>
							<p>
								<?php \esc_html_e( 'We\'ll track and reward progress only on the ones you select.', 'progress-planner' ); ?>
							</p>
						</div>

						<div class="prpl-setting-content">
							<div class="prpl-settings-wrapper">
								<p>
									<?php \esc_html_e( 'Which post types do you want us to track?', 'progress-planner' ); ?>
								</p>
								<div id="prpl-post-types-include-wrapper">
									<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
										<div>
											<label>
												<input
													type="checkbox"
													name="prpl-post-types-include[]"
													value="<?php echo \esc_attr( $prpl_post_type ); ?>"
													<?php \checked( \in_array( $prpl_post_type, $prpl_saved_settings, true ) ); ?>
												/>
												<?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?>
											</label>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
						</div>
						<div class="prpl-setting-footer">
							<button
								type="button"
								id="prpl-save-post-types-setting"
								class="prpl-btn prpl-save-setting-btn"
								disabled
							>
								<?php \esc_html_e( 'Save setting', 'progress-planner' ); ?>
							</button>
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>

		<!-- Login Destination sub-step -->
		<?php ++$prpl_current_step_number; ?>
		<div class="prpl-setting-item" data-page="login-destination">
			<div class="prpl-columns-wrapper-flex">
				<div class="prpl-column prpl-column-content">
					<p><?php echo \esc_html( $prpl_page_type['description'] ); ?></p>
				</div>
				<div class="prpl-column">
					<div class="prpl-setting-header">
						<h3 class="prpl-setting-title">
							<?php \esc_html_e( 'Settings:', 'progress-planner' ); ?> <?php \esc_html_e( 'Default login destination', 'progress-planner' ); ?>
							<span class="prpl-settings-progress"><?php echo \esc_html( $prpl_current_step_number ); ?>/<?php echo \esc_html( $prpl_total_number_of_steps ); ?></span>
						</h3>
						<p>
							<?php
							/* translators: %s: Progress Planner name. */
							\printf( \esc_html__( 'Do you want to land on the %s dashboard after logging in? So you can start improving your site straight away!', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
							?>
						</p>
					</div>

					<div class="prpl-setting-content">
						<div class="prpl-settings-wrapper">
							<p>
								<?php \esc_html_e( 'Where do you want to start when you login to your site?', 'progress-planner' ); ?>
							</p>
							<label for="prpl-setting-redirect-on-login">
								<input
									id="prpl-setting-redirect-on-login"
									name="prpl-redirect-on-login"
									type="checkbox"
									<?php \checked( $prpl_redirect_on_login ); ?>
								/>
								<span>
								<?php
								/* translators: %s: Progress Planner name. */
								\printf( \esc_html__( 'Show the %s dashboard after login.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
								?>
								</span>
							</label>
						</div>
					</div>
					<div class="prpl-setting-footer">
						<button
							type="button"
							id="prpl-save-login-destination-setting"
							class="prpl-btn prpl-save-setting-btn"
						>
							<?php \esc_html_e( 'Save setting', 'progress-planner' ); ?>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Next', 'progress-planner' ); ?></button>
		</div>
	</div>
</script>
