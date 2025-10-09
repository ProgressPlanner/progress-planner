<?php
/**
 * Popover for the email-sending task.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

?>

<prpl-improve-pdf-handling-popup
	popover-id="<?php echo \esc_attr( 'prpl-popover-' . $prpl_popover_id ); ?>"
	provider-id="<?php echo \esc_attr( $prpl_provider_id ); ?>"
>
	<?php /* First step */ ?>
	<div class="prpl-columns-wrapper-flex prpl-task-step" id="prpl-improve-pdf-handling-first-step">
		<div class="prpl-column prpl-column-content">
			<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Improve your site\'s PDF handling', 'progress-planner' ); ?></h2>
			<p class="prpl-interactive-task-description"><?php \esc_html_e( 'We have detected that your site has quite a few PDF files.', 'progress-planner' ); ?></p>
			<p class="prpl-interactive-task-description"><?php \esc_html_e( 'It would be great if you could improve the way your site handles them.', 'progress-planner' ); ?></p>
		</div>
		<div class="prpl-column">
			<p class="prpl-interactive-task-description"><?php \esc_html_e( 'Do you need to show a folder structure with the files to make them more discoverable?', 'progress-planner' ); ?></p>
			<p><?php \esc_html_e( 'If so, you can improve the way your site handles them by adding a folder structure.', 'progress-planner' ); ?></p>
			<p>
				<a href="https://barn2.com/blog/wordpress-pdf-library-plugin/" target="_blank"><?php \esc_html_e( 'Learn more about the PDF Library plugin', 'progress-planner' ); ?></a>
			</p>

			<div class="prpl-steps-nav-wrapper">
				<button class="prpl-button prpl-button-step" data-action="showPdfXmlSitemapStep">
					<?php /* translators: %s is a forward arrow icon. */ ?>
					<?php \printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' ); ?>
				</button>
			</div>
		</div>
	</div>

	<?php /* Email sent, asking user if they received it */ ?>
	<div class="prpl-columns-wrapper-flex prpl-task-step" id="prpl-improve-pdf-handling-pdf-xml-sitemap-step" style="display: none;">
		<div class="prpl-column prpl-column-content">
			<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Do you want these PDFs to be found in search engines better?', 'progress-planner' ); ?></h2>
			<p class="prpl-interactive-task-description">
				<?php \esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel nisi consequat, imperdiet magna nec, commodo ipsum. Fusce nec venenatis diam. Curabitur ac laoreet risus. Vivamus non interdum elit. Nunc sed arcu eget dolor dapibus suscipit. Morbi euismod volutpat egestas. Duis mi ipsum, hendrerit eu accumsan ut, placerat id nulla. ', 'progress-planner' ); ?>
			</p>
		</p>

		</div>

		<div class="prpl-column">
			<p class="prpl-interactive-task-description">
				<?php \esc_html_e( 'XML Sitemap for PDFs for Yoast SEO', 'progress-planner' ); ?>
			</p>
			<p><?php \esc_html_e( 'This plugin adds an XML sitemap for PDFs. It adds this XML sitemap to the sitemap_index.xml that Yoast SEO generates.', 'progress-planner' ); ?></p>
			<div>
				<?php if ( ! \is_multisite() && \current_user_can( 'install_plugins' ) ) : ?>
					<prpl-install-plugin
						data-plugin-name="XML Sitemap for PDFs for Yoast SEO"
						data-plugin-slug="pdf-sitemap"
						data-action="<?php echo \progress_planner()->get_plugin_installer()->is_plugin_installed( 'pdf-sitemap' ) ? 'activate' : 'install'; ?>"
						data-complete-task="false"
						data-provider-id="<?php echo \esc_attr( $prpl_provider_id ); ?>"
					></prpl-install-plugin>
				<?php endif; ?>
			</div>

			<div class="prpl-steps-nav-wrapper">
				<button class="prpl-button prpl-button-step" data-action="showSuccess">
					<?php
					/* translators: %s is an arrow icon. */
					\printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
					?>
				</button>
			</div>
		</div>
	</div>

	<?php /* Showing success message */ ?>
	<div class="prpl-columns-wrapper-flex prpl-task-step" id="prpl-improve-pdf-handling-success-step" style="display: none;">
		<div class="prpl-column prpl-column-content">
			<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Your PDF handling is improved!', 'progress-planner' ); ?></h2>
			<?php \esc_html_e( 'Great, you improved the way your site handles PDFs! This indicates PDF handling is set up properly on your website.', 'progress-planner' ); ?>
		</div>

		<div class="prpl-column">
			<p><?php \esc_html_e( 'Celebrate this achievement!', 'progress-planner' ); ?></p>

			<div class="prpl-steps-nav-wrapper">
				<button class="prpl-button prpl-button-step" data-action="completeTask"><?php \esc_html_e( 'Collect your point!', 'progress-planner' ); ?></button>
			</div>
		</div>
	</div>

	<button class="prpl-popover-close" data-action="closePopover">
		<span class="dashicons dashicons-no-alt"></span>
		<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
	</button>

</prpl-improve-pdf-handling-popup>
