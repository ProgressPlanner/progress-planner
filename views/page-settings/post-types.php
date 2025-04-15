<?php
/**
 * Settings popover.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_saved_settings = \progress_planner()->get_settings()->get_post_types_names();
$prpl_post_types     = \array_filter( \get_post_types( [ 'public' => true ] ), 'is_post_type_viewable' );
unset( $prpl_post_types['attachment'] );
unset( $prpl_post_types['elementor_library'] ); // Elementor templates are not a post type we want to track.
?>

<div class="prpl-column">
	<div class="prpl-widget-wrapper">
		<h2 class="prpl-settings-section-title">
			<span class="icon">
				<?php \progress_planner()->the_asset( 'images/icon_pages.svg' ); ?>
			</span>
			<span>
				<?php esc_html_e( 'Valuable post types', 'progress-planner' ); ?>
			</span>
		</h2>
		<p>
			<?php esc_html_e( 'Let us know which post types are valuable to you.', 'progress-planner' ); ?>
		</p>
		<div id="prpl-post-types-include">
		<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
			<label>
				<input
					type="checkbox"
					name="prpl-post-types-include[]"
					value="<?php echo \esc_attr( $prpl_post_type ); ?>"
					<?php checked( \in_array( $prpl_post_type, $prpl_saved_settings, true ) ); ?>
				/>
				<?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?>
			</label>
		<?php endforeach; ?>
	</div>
	</div>
</div>
