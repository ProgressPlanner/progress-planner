<?php
/**
 * Tour step view - Settings (About, Contact, FAQ pages).
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

// Get page types for About, Contact, and FAQ.
$prpl_page_types = [
	'about'   => [
		'id'          => 'about',
		'title'       => \esc_html__( 'About page', 'progress-planner' ),
		'description' => \esc_html__( 'Help us understand your site a little better so we can give you more useful recommendations.', 'progress-planner' ),
	],
	'contact' => [
		'id'          => 'contact',
		'title'       => \esc_html__( 'Contact page', 'progress-planner' ),
		'description' => \esc_html__( 'Help us understand your site a little better so we can give you more useful recommendations.', 'progress-planner' ),
	],
	'faq'     => [
		'id'          => 'faq',
		'title'       => \esc_html__( 'FAQ page', 'progress-planner' ),
		'description' => \esc_html__( 'Help us understand your site a little better so we can give you more useful recommendations.', 'progress-planner' ),
	],
];

?>

<!-- Tour step settings -->
<script type="text/template" id="onboarding-step-settings">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Settings', 'progress-planner' ); ?>
			<span class="prpl-settings-progress">1/3</span>
		</h2>
	</div>
	<div class="tour-content">
		<?php foreach ( $prpl_page_types as $prpl_page_type ) : ?>
			<div class="prpl-setting-item" data-page="<?php echo \esc_attr( $prpl_page_type['id'] ); ?>">
				<div class="prpl-setting-header">
					<h3 class="prpl-setting-title"><?php echo \esc_html( $prpl_page_type['title'] ); ?></h3>
					<p><?php echo \esc_html( $prpl_page_type['description'] ); ?></p>
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
		<?php endforeach; ?>
	</div>
</script>
