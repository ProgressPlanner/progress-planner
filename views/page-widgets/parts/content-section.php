<?php
/**
 * Content section.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) array_sum( $prpl_big_counter_args['number'] ) ) ); ?>"
	content="<?php echo \esc_attr( $prpl_big_counter_args['content'] ); ?>"
	background-color="<?php echo \esc_attr( $prpl_big_counter_args['background-color'] ); ?>"
></prpl-big-counter>

<div class="prpl-widget-content">
	<p>
		<?php if ( 0 === $prpl_sum_weekly['number'] ) : ?>
			<?php echo \esc_html( $prpl_sum_weekly['content'][0] ); ?>
		<?php else : ?>
			<?php echo \esc_html( $prpl_sum_weekly['content'][1] ); ?>
		<?php endif; ?>
	</p>
</div>
<div class="prpl-graph-wrapper">
	<?php \progress_planner()->get_ui__chart()->the_chart( $prpl_chart_args ); ?>
</div>