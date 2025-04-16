<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__published_content();

\progress_planner()->the_view(
	'page-widgets/parts/content-section.php',
	[
		'prpl_big_counter_args' => [
			'number'           => $prpl_widget->get_stats()['weekly'],
			'content'          => __( 'content published', 'progress-planner' ),
			'background-color' => 'var(--prpl-background-purple)',
		],
		'prpl_sum_weekly'       => [
			'number'  => array_sum( $prpl_widget->get_stats()['weekly'] ),
			'content' => [
				__( 'You didn\'t publish new content last week. You can do better!', 'progress-planner' ),
				sprintf(
					\esc_html(
						/* translators: %1$s: number of posts/pages published this week + "pieces". %2$s: Total number of posts. */
						\_n(
							'Nice! You published %1$s piece of new content last week. You now have %2$s in total. Keep up the good work!',
							'Nice! You published %1$s pieces of new content last week. You now have %2$s in total. Keep up the good work!',
							array_sum( $prpl_widget->get_stats()['weekly'] ),
							'progress-planner'
						)
					),
					\esc_html( \number_format_i18n( array_sum( $prpl_widget->get_stats()['weekly'] ) ) ),
					\esc_html( \number_format_i18n( array_sum( $prpl_widget->get_stats()['all'] ) ) )
				),
			],
		],
		'prpl_chart_args'       => $prpl_widget->get_chart_args_content_count( 'publish' ),
	]
);

$prpl_updated_content_count = count(
	\progress_planner()->get_activities__query()->query_activities(
		[
			'category'   => 'content',
			'type'       => 'update',
			'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
			'end_date'   => \gmdate( 'Y-m-d' ),
		]
	)
);

\progress_planner()->the_view(
	'page-widgets/parts/content-section.php',
	[
		'prpl_big_counter_args' => [
			'number'           => $prpl_updated_content_count,
			'content'          => __( 'content updated', 'progress-planner' ),
			'background-color' => 'var(--prpl-background-purple)',
		],
		'prpl_sum_weekly'       => [
			'number'  => $prpl_updated_content_count,
			'content' => [
				__( 'You did not update any content last week. You can do better!', 'progress-planner' ),
				sprintf(
					\esc_html(
						/* translators: %1$s: number of posts/pages updated this week. */
						\_n(
							'Nice! You updated %1$d piece of content last week. Keep up the good work!',
							'Nice! You updated %1$d pieces of content last week. Keep up the good work!',
							$prpl_updated_content_count,
							'progress-planner'
						)
					),
					\esc_html( \number_format_i18n( $prpl_updated_content_count ) )
				),
			],
		],
		'prpl_chart_args'       => $prpl_widget->get_chart_args_content_count( 'update' ),
	]
);

$prpl_deleted_content_count = count(
	\progress_planner()->get_activities__query()->query_activities(
		[
			'category'   => 'content',
			'type'       => 'delete',
			'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
			'end_date'   => \gmdate( 'Y-m-d' ),
		]
	)
);

\progress_planner()->the_view(
	'page-widgets/parts/content-section.php',
	[
		'prpl_big_counter_args' => [
			'number'           => $prpl_deleted_content_count,
			'content'          => __( 'content deleted', 'progress-planner' ),
			'background-color' => 'var(--prpl-background-purple)',
		],
		'prpl_sum_weekly'       => [
			'number'  => $prpl_deleted_content_count,
			'content' => [
				__( 'You did not delete any content last week. You can do better!', 'progress-planner' ),
				sprintf(
					\esc_html(
						/* translators: %1$s: number of posts/pages updated this week. */
						\_n(
							'Nice! You deleted %1$d piece of content last week. Keep up the good work!',
							'Nice! You deleted %1$d pieces of content last week. Keep up the good work!',
							$prpl_deleted_content_count,
							'progress-planner'
						)
					),
					\esc_html( \number_format_i18n( $prpl_deleted_content_count ) )
				),
			],
		],
		'prpl_chart_args'       => $prpl_widget->get_chart_args_content_count( 'delete' ),
	]
);
