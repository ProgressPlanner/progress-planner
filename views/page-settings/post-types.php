<?php
/**
 * Settings popover.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_saved_settings = \progress_planner()->get_settings()->get_post_types_names();
$prpl_post_types     = \progress_planner()->get_settings()->get_public_post_types();

// Early exit if there are no public post types.
if ( empty( $prpl_post_types ) ) {
	return;
}

// We use it in order to change grid layout when there are more than 5 valuable post types.
$prpl_data_attributes = 5 < \count( $prpl_post_types ) ? 'data-has-many-valuable-post-types' : '';
?>

<div class="prpl-column prpl-column-post-types" <?php echo \esc_attr( $prpl_data_attributes ); ?>>
	<div class="prpl-widget-wrapper">
		<h2 class="prpl-settings-section-title">
			<span class="icon">
				<?php \progress_planner()->the_asset( 'images/icon_copywriting.svg' ); ?>
			</span>
			<span>
				<?php \esc_html_e( 'Valuable post types', 'progress-planner' ); ?>
			</span>
		</h2>
		<p>
			<?php \esc_html_e( 'You\'re in control of what counts as valuable content. We\'ll track and reward activity only for the post types you select here.', 'progress-planner' ); ?>
		</p>
		<div id="prpl-post-types-include-wrapper">
		<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
			<label>
				<input
					type="checkbox"
					name="prpl-post-types-include[]"
					value="<?php echo \esc_attr( $prpl_post_type ); ?>"
					<?php \checked( \in_array( $prpl_post_type, $prpl_saved_settings, true ) ); ?>
				/>
				<?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?>
			</label>
		<?php endforeach; ?>
	</div>
	</div>
</div>
