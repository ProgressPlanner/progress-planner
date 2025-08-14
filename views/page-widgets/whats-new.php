<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__whats_new();

?>
<h2 class="prpl-widget-title">
	<?php
	echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'whats-new',
		\esc_html__( 'What\'s new on the Progress Planner blog', 'progress-planner' )
	);
	?>
</h2>

<ul>
	<?php foreach ( $prpl_widget->get_blog_feed() as $prpl_blog_post ) : ?>
		<?php
		$prpl_blog_post_image_url = isset( $prpl_blog_post['featured_media']['media_details']['sizes']['medium_large']['source_url'] )
			? $prpl_blog_post['featured_media']['media_details']['sizes']['medium_large']['source_url']
			: false;
		?>
		<li>
			<h3>
				<a href="<?php echo \esc_url( $prpl_blog_post['link'] ); ?>" target="_blank">
					<?php echo \esc_html( $prpl_blog_post['title']['rendered'] ); ?>
				</a>
			</h3>
			<?php if ( $prpl_blog_post_image_url ) : ?>
				<a href="<?php echo \esc_url( $prpl_blog_post['link'] ); ?>" target="_blank">
					<div class="prpl-blog-post-image" style="background-image:url(<?php echo \esc_url( $prpl_blog_post_image_url ); ?>)"></div>
				</a>
			<?php endif; ?>
			<p><?php echo \esc_html( \wp_trim_words( \wp_strip_all_tags( $prpl_blog_post['content']['rendered'] ), 55 ) ); ?></p>
			<hr />
		</li>
	<?php endforeach; ?>
</ul>
<div class="prpl-widget-footer">
	<a href="https://prpl.fyi/blog" target="_blank">
		<?php \esc_html_e( 'Read all posts', 'progress-planner' ); ?>
	</a>
</div>
