<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget     = \progress_planner()->get_admin__widgets__content_managed();
$prpl_stats      = $prpl_widget->get_stats();
$prpl_sum_weekly = array_sum( $prpl_stats['weekly'] );
?>
<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) array_sum( $prpl_stats['weekly'] ) ) ); ?>"
	content="<?php echo \esc_attr_e( 'content published', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-purple)"
></prpl-big-counter>

<div class="prpl-widget-content">
	<p>
		<?php if ( 0 === $prpl_sum_weekly ) : ?>
			<?php \esc_html_e( 'You didn\'t publish new content last week. You can do better!', 'progress-planner' ); ?>
		<?php else : ?>
			<?php
			printf(
				\esc_html(
					/* translators: %1$s: number of posts/pages published this week + "pieces". %2$s: Total number of posts. */
					\_n(
						'Nice! You published %1$s piece of new content last week. You now have %2$s in total. Keep up the good work!',
						'Nice! You published %1$s pieces of new content last week. You now have %2$s in total. Keep up the good work!',
						$prpl_sum_weekly,
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( $prpl_sum_weekly ) ),
				\esc_html( \number_format_i18n( array_sum( $prpl_stats['all'] ) ) )
			);
			?>
		<?php endif; ?>
	</p>
</div>
<div class="prpl-graph-wrapper">
	<?php \progress_planner()->get_ui__chart()->the_chart( $prpl_widget->get_chart_args_content_count() ); ?>
</div>