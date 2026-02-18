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

$prpl_total_number_of_steps = 5;
$prpl_current_step_number   = 0;

?>

<!-- Tour step settings -->
<script type="text/template" id="onboarding-step-settings">
	<div class="tour-content">
		<?php foreach ( $prpl_page_types as $prpl_page_type ) : ?>
			<?php ++$prpl_current_step_number; ?>
			<div class="prpl-setting-item" data-page="<?php echo \esc_attr( $prpl_page_type['id'] ); ?>">
				<div class="prpl-columns-wrapper-flex prpl-columns-1-2">
					<div class="prpl-column">
						<div class="prpl-background-content">
							<p><?php echo \esc_html( $prpl_page_type['description'] ); ?></p>
						</div>
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
								<?php
								\progress_planner()->the_view(
									'onboarding/form-inputs/checkbox.php',
									[
										'name'          => 'no_' . \esc_attr( $prpl_page_type['id'] ) . '_page',
										'current_value' => '',
										'options'       => [
											[
												'id'    => 'prpl-no-' . \esc_attr( $prpl_page_type['id'] ) . '-page',
												'label' => \sprintf(
													/* translators: %s: page type title */
													\esc_html__( 'I don\'t have a %s yet', 'progress-planner' ),
													\esc_html( $prpl_page_type['title'] )
												),
												'value' => '1',
											],
										],
									]
								);
								?>
							</div>
						</div>
						<div class="prpl-setting-footer">
							<div class="prpl-setting-note">
								<span class="prpl-setting-note-icon">
									<?php \progress_planner()->the_file( 'assets/images/onboarding/icon_info_solid.svg' ); ?>
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
								<?php
								/* translators: %s: arrow icon */
								printf( \esc_html__( 'Save setting %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
								?>
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
					<div class="prpl-column">
						<div class="prpl-background-content">
							<p>
								<?php \esc_html_e( 'Choose the post types you actively use for your content.', 'progress-planner' ); ?>
							</p>
							<p>
								<?php \esc_html_e( 'We\'ll track and reward progress only on the ones you select.', 'progress-planner' ); ?>
							</p>
						</div>
					</div>
					<div class="prpl-column">
						<div class="prpl-setting-header">
							<h3 class="prpl-setting-title">
								<?php \esc_html_e( 'Settings:', 'progress-planner' ); ?> <?php \esc_html_e( 'Valuable post types', 'progress-planner' ); ?>
								<span class="prpl-settings-progress"><?php echo \esc_html( $prpl_current_step_number ); ?>/<?php echo \esc_html( $prpl_total_number_of_steps ); ?></span>
							</h3>
						</div>

						<div class="prpl-setting-content">
							<div class="prpl-settings-wrapper">
								<p>
									<?php \esc_html_e( 'Which post types do you want us to track?', 'progress-planner' ); ?>
								</p>
								<div id="prpl-post-types-include-wrapper">
									<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
										<?php $prpl_is_checked = \in_array( $prpl_post_type, $prpl_saved_settings, true ); ?>
										<div class="prpl-post-type-toggle-wrapper">
											<label class="prpl-post-type-toggle-label">
												<input
													type="checkbox"
													name="prpl-post-types-include[]"
													value="<?php echo \esc_attr( $prpl_post_type ); ?>"
													class="prpl-post-type-toggle-input"
													<?php \checked( $prpl_is_checked ); ?>
												/>
												<span class="prpl-post-type-toggle-switch">
													<svg class="prpl-toggle-icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
													</svg>
													<svg class="prpl-toggle-icon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
													</svg>
												</span>
												<span class="prpl-post-type-toggle-text"><?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?></span>
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
								<?php
								/* translators: %s: arrow icon */
								printf( \esc_html__( 'Save setting %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
								?>
							</button>
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>
	</div>
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-secondary">
				<?php
				/* translators: %s: arrow icon */
				printf( \esc_html__( 'Next %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
				?>
			</button>
		</div>
	</div>
</script>
