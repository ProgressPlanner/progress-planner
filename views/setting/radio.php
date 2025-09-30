<?php
/**
 * Template for a `radio` setting.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>
<fieldset id="prpl-setting-fieldset-<?php echo \esc_attr( $prpl_setting['id'] ); ?>">
	<legend><?php echo \wp_kses_post( $prpl_setting['title'] ); ?></legend>
	<div class="radios">
		<?php foreach ( $prpl_setting['options'] as $prpl_option_value => $prpl_option_label ) : ?>
			<label>
				<input
					type="radio"
					id="prpl-setting-<?php echo \esc_attr( $prpl_setting['id'] ); ?>"
					name="<?php echo \esc_attr( $prpl_setting['id'] ); ?>"
					value="<?php echo \esc_attr( $prpl_option_value ); ?>"
					<?php if ( isset( $prpl_setting['page'] ) && $prpl_setting['page'] ) : ?>
						data-page="<?php echo \esc_attr( $prpl_setting['page'] ); ?>"
					<?php endif; ?>
					<?php echo ( (string) $prpl_option_value === (string) $prpl_setting['value'] ) ? ' checked' : ''; ?>
				>
				<?php echo \wp_kses_post( $prpl_option_label ); ?>
			</label>
		<?php endforeach; ?>
	</div>
</fieldset>
