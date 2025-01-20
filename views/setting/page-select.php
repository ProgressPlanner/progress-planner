<?php
/**
 * Template for a `page-select` setting.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_setting_value = isset( $prpl_setting['value'] ) ? $prpl_setting['value'] : '';

// Default values.
$prpl_select_value = 0;
$prpl_radio_value  = ( '_no_page_needed' === $prpl_setting_value ) ? 'not-applicable' : 'no';

if ( is_numeric( $prpl_setting_value ) && 0 < $prpl_setting_value ) {
	$prpl_radio_value  = 'yes';
	$prpl_select_value = (int) $prpl_setting_value;
}

?>
<div
	class="prpl-pages-item prpl-pages-item-<?php echo esc_attr( $prpl_setting['page'] ); ?>"
	data-page-item="<?php echo esc_attr( $prpl_setting['page'] ); ?>"
>
	<div class="item-description">
		<h3>
			<span class="icon icon-check-circle">
				<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
			</span>
			<span class="icon icon-exclamation-circle">
				<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
			</span>
			<span>
				<?php echo esc_html( $prpl_setting['title'] ); ?>
			</span>
		</h3>
		<p><?php echo esc_html( $prpl_setting['description'] ); ?></p>
	</div>
	<div>
		<fieldset id="prpl-setting-fieldset-<?php echo esc_attr( $prpl_setting['id'] ); ?>">
			<div class="radios">
				<?php
				foreach ( [
					'yes'            => esc_html__( 'I have this page', 'progress-planner' ),
					'no'             => esc_html__( 'I don\'t have this page yet', 'progress-planner' ),
					'not-applicable' => esc_html__( 'My site doesn\'t need this page', 'progress-planner' ),
				] as $prpl_r_value => $prpl_r_label ) :
					$prpl_radio_checked = ( 'no' === $prpl_r_value && 'no' === $prpl_setting['isset'] );
					if ( ! $prpl_radio_checked ) {
						$prpl_radio_checked = ( $prpl_radio_value === $prpl_r_value );
					}
					?>
					<div class="prpl-radio-wrapper">
						<label>
							<input
							type="radio"
							id="<?php echo esc_attr( 'pages[' . esc_attr( $prpl_setting['id'] ) . '][have_page]' ); ?>"
							name="<?php echo esc_attr( 'pages[' . esc_attr( $prpl_setting['id'] ) . '][have_page]' ); ?>"
								value="<?php echo esc_attr( $prpl_r_value ); ?>"
								data-page="<?php echo esc_attr( $prpl_setting['page'] ); ?>"
								<?php echo $prpl_radio_checked ? ' checked' : ''; ?>
							>
							<?php echo esc_html( $prpl_r_label ); ?>
						</label>

						<?php if ( 'yes' === $prpl_r_value ) : ?>
							<div class="prpl-select-page">
								<div data-action="select">
									<?php
									wp_dropdown_pages(
										[
											'name'     => 'pages[' . esc_attr( $prpl_setting['id'] ) . '][id]',
											'show_option_none' => '&mdash; ' . esc_html__( 'Select page', 'progress-planner' ) . ' &mdash;',
											'selected' => esc_attr( $prpl_setting['value'] ),
										]
									);
									?>
								</div>
							</div>
						<?php endif; ?>

						<?php if ( 'no' === $prpl_r_value ) : ?>
							<div data-action="create">
								<?php
								/**
								 * TODO: Find a way to assign the term for the new page.
								 */
								?>
								<a
									target="_blank"
									class="prpl-button"
									href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page' ) ); ?>"
								>
									<?php esc_html_e( 'Create this page', 'progress-planner' ); ?>
								</a>
							</div>
						<?php endif; ?>


					</div>
				<?php endforeach; ?>
			</div>
		</fieldset>
	</div>
</div>
