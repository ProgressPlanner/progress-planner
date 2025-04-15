<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget     = \progress_planner()->get_admin__widgets__published_content();
$prpl_stats      = $prpl_widget->get_stats();
$prpl_sum_weekly = array_sum( $prpl_stats['weekly'] );

\progress_planner()->the_view(
	'page-widgets/parts/content-section.php',
	[
		'prpl_big_counter_args' => [
			'number'           => $prpl_stats['weekly'],
			'content'          => __( 'content published', 'progress-planner' ),
			'background-color' => 'var(--prpl-background-purple)',
		],
		'prpl_sum_weekly'       => [
			'number'  => $prpl_sum_weekly,
			'content' => [
				__( 'You didn\'t publish new content last week. You can do better!', 'progress-planner' ),
				sprintf(
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
				),
			],
		],
		'prpl_chart_args'       => $prpl_widget->get_chart_args_content_count(),
		'prpl_stats'            => $prpl_stats,
	]
);
