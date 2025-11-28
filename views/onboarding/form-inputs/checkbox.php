<?php
/**
 * Checkboxes template.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="prpl-custom-inputs-wrapper">
	<div class="prpl-checkbox-wrapper">
		<?php if ( isset( $options ) ) : ?>
			<?php foreach ( $options as $prpl_option ) : ?>
			<label for="<?php echo \esc_attr( $prpl_option['id'] ); ?>" class="prpl-custom-checkbox">
				<input
					type="checkbox"
					id="<?php echo \esc_attr( $prpl_option['id'] ); ?>"
					<?php if ( isset( $prpl_option['name'] ) ) : ?>
						name="<?php echo \esc_attr( $prpl_option['name'] ); ?>"
					<?php endif; ?>
					<?php if ( isset( $prpl_option['value'] ) ) : ?>
						value="<?php echo \esc_attr( $prpl_option['value'] ); ?>"
					<?php endif; ?>
					<?php if ( isset( $prpl_option['current_value'] ) && isset( $prpl_option['value'] ) ) : ?>
						<?php \checked( $prpl_option['current_value'], $prpl_option['value'] ); ?>
					<?php endif; ?>
				>
				<span class="prpl-custom-control"></span>
				<span class="prpl-custom-control-text">
					<?php echo $prpl_option['label']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Option should already be escaped. ?>
				</span>
			</label>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</div>
