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

$prpl_saved_settings_post_types = \progress_planner()->get_activities__content_helpers()->get_post_types_names();
$prpl_saved_settings_widgets    = [];
foreach ( \progress_planner()->get_admin__page()->get_widgets_filtered() as $prpl_admin_widget ) {
	$prpl_saved_settings_widgets[] = $prpl_admin_widget->get_id();
}
$prpl_post_types     = \array_filter( \get_post_types( [ 'public' => true ] ), 'is_post_type_viewable' );
unset( $prpl_post_types['attachment'] );
unset( $prpl_post_types['elementor_library'] ); // Elementor templates are not a post type we want to track.
?>

<h2><?php \esc_html_e( 'Settings', 'progress-planner' ); ?></h2>

<form id="prpl-settings-form">
	<h3><?php \esc_html_e( 'Post Types', 'progress-planner' ); ?></h3>
	<p><?php \esc_html_e( 'Select the post types you want to include in activity scores. This setting will affect which post-type activities get tracked.', 'progress-planner' ); ?></p>
	<div id="prpl-settings-post-types-include">
		<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
			<label>
				<input
					type="checkbox"
					name="prpl-settings-post-types-include[]"
					value="<?php echo \esc_attr( $prpl_post_type ); ?>"
					<?php checked( \in_array( $prpl_post_type, $prpl_saved_settings_post_types, true ) ); ?>
				/>
				<?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?>
			</label>
		<?php endforeach; ?>
	</div>

	<div id="prpl-settings-widgets-display">
		<h3><?php \esc_html_e( 'Widgets', 'progress-planner' ); ?></h3>
		<p><?php \esc_html_e( 'Select the widgets you want to display on the Progress Planner page.', 'progress-planner' ); ?></p>
		<div id="prpl-settings-widgets-display-list">
			<?php foreach ( \progress_planner()->get_admin__page()->get_widgets() as $prpl_admin_widget ) : ?>
				<label>
					<input
						type="checkbox"
						name="prpl-settings-widgets-display[]"
						value="<?php echo \esc_attr( $prpl_admin_widget->get_id() ); ?>"
						<?php checked( \in_array( $prpl_admin_widget->get_id(), $prpl_saved_settings_widgets, true ) ); ?>
					/>
					<?php echo \esc_html( $prpl_admin_widget->get_title() ); // @phpstan-ignore-line property.nonObject ?>
				</label>
			<?php endforeach; ?>
		</div>
	</div>
	<button id="submit-include-post-types" class="button button-primary"><?php \esc_html_e( 'Save', 'progress-planner' ); ?></button>
</form>
