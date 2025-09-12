<?php
/**
 * Template for the set date format task.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filters the default date formats.
 *
 * @param string[] $default_date_formats Array of default date formats.
 */
$prpl_date_formats = array_unique( \apply_filters( 'date_formats', [ __( 'F j, Y' ), 'F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y', 'd.m.Y' ] ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound, WordPress.WP.I18n.MissingArgDomain -- WP core filter & we want to add the default date format

$prpl_custom = true;
?>
<div class="radios">
	<fieldset>
		<?php foreach ( $prpl_date_formats as $prpl_format ) : ?>
		<div class="prpl-radio-wrapper">
			<label class="prpl-custom-radio"><input type="radio" name="date_format" value="<?php echo \esc_attr( $prpl_format ); ?>"
				<?php
				if ( \get_option( 'date_format' ) === $prpl_format ) { // checked() uses "==" rather than "===".
					echo " checked='checked'";
					$prpl_custom = false;
				}
				?>
				/>
				<span class="prpl-custom-control"></span>
				<span class="date-time-text format-i18n"><?php echo \esc_html( \date_i18n( $prpl_format ) ); ?></span>
				<code><?php echo \esc_html( $prpl_format ); ?></code>
			</label>
		</div>
		<?php endforeach; ?>

		<?php /* Custom date format. */ ?>
		<div class="prpl-radio-wrapper">
			<label class="prpl-custom-radio">
				<input type="radio" name="date_format" id="date_format_custom_radio" value="\c\u\s\t\o\m" <?php checked( $prpl_custom ); ?>/>
				<span class="prpl-custom-control"></span> <span class="date-time-text date-time-custom-text">
					<?php \esc_html_e( 'Custom:', 'progress-planner' ); ?>
					<span class="screen-reader-text">
					<?php
						/* translators: Hidden accessibility text. */
						\esc_html_e( 'enter a custom date format in the following field', 'progress-planner' );
					?>
					</span>
				</span>
			</label>
			<label for="date_format_custom" class="screen-reader-text">
			<?php
			/* translators: Hidden accessibility text. */
			\esc_html_e( 'Custom date format:', 'progress-planner' );
			?>
			</label>
			<input type="text" name="date_format_custom" id="date_format_custom" value="<?php echo \esc_attr( \get_option( 'date_format' ) ); ?>" class="small-text" />
		</div>

		<?php /* Preview. */ ?>
		<p>
			<strong><?php \esc_html_e( 'Preview:', 'progress-planner' ); ?></strong>
			<span class="example"><?php echo \esc_html( \date_i18n( \get_option( 'date_format' ) ) ); ?></span>
			<span class="spinner"></span>
		</p>
	</fieldset>
</div>
<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
	<?php \esc_html_e( 'Set date format', 'progress-planner' ); ?>
</button>
