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

$prpl_activities_count = [
	'publish' => count(
		\progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'content',
				'type'       => 'publish',
				'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
				'end_date'   => \gmdate( 'Y-m-d' ),
			]
		)
	),
	'update'  => count(
		\progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'content',
				'type'       => 'update',
				'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
				'end_date'   => \gmdate( 'Y-m-d' ),
			]
		)
	),
	'delete'  => count(
		\progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'content',
				'type'       => 'delete',
				'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
				'end_date'   => \gmdate( 'Y-m-d' ),
			]
		)
	),
];

?>

<h2 class="prpl-widget-title">
	<?php \esc_html_e( 'Content activity', 'progress-planner' ); ?>
</h2>

<div class="prpl-graph-wrapper">
	<?php \progress_planner()->get_ui__chart()->the_chart( $prpl_widget->get_chart_args_content_count() ); ?>
</div>

<p><?php \esc_html_e( 'Overall content activity', 'progress-planner' ); ?></p>

<!-- Published content. -->
<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_activities_count['publish'] ) ); ?>"
	content="<?php \esc_attr_e( 'content published', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-purple)"
></prpl-big-counter>

<div class="prpl-widget-content">
	<p>
		<?php if ( 0 === $prpl_activities_count['publish'] ) : ?>
			<?php \esc_html_e( 'You didn\'t publish new content last week. You can do better!', 'progress-planner' ); ?>
		<?php else : ?>
			<?php
			printf(
				\esc_html(
					/* translators: %1$s: number of posts/pages published this week + "pieces". */
					\_n(
						'Nice! You published %1$s piece of new content last week. Keep up the good work!',
						'Nice! You published %1$s pieces of new content last week. Keep up the good work!',
						(int) $prpl_activities_count['publish'],
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( (int) $prpl_activities_count['publish'] ) ),
			);
			?>
		<?php endif; ?>
	</p>
</div>

<!-- Updated content. -->
<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_activities_count['update'] ) ); ?>"
	content="<?php \esc_attr_e( 'content updated', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-purple)"
></prpl-big-counter>

<div class="prpl-widget-content">
	<p>
		<?php if ( 0 === $prpl_activities_count['update'] ) : ?>
			<?php \esc_html_e( 'You didn\'t update any content last week. You can do better!', 'progress-planner' ); ?>
		<?php else : ?>
			<?php
			printf(
				\esc_html(
					/* translators: %1$s: number of posts/pages updated this week. */
					\_n(
						'Nice! You updated %1$d piece of content last week. Keep up the good work!',
						'Nice! You updated %1$d pieces of content last week. Keep up the good work!',
						(int) $prpl_activities_count['update'],
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( (int) $prpl_activities_count['update'] ) ),
			);
			?>
		<?php endif; ?>
	</p>
</div>

<!-- Deleted content. -->
<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_activities_count['delete'] ) ); ?>"
	content="<?php \esc_attr_e( 'content deleted', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-purple)"
></prpl-big-counter>

<div class="prpl-widget-content">
	<p>
		<?php if ( 0 === $prpl_activities_count['delete'] ) : ?>
			<?php \esc_html_e( 'You didn\'t delete any content last week. You can do better!', 'progress-planner' ); ?>
		<?php else : ?>
			<?php
			printf(
				\esc_html(
					/* translators: %1$s: number of posts/pages updated this week. */
					\_n(
						'Nice! You deleted %1$d piece of content last week. Keep up the good work!',
						'Nice! You deleted %1$d pieces of content last week. Keep up the good work!',
						(int) $prpl_activities_count['delete'],
						'progress-planner'
					)
				),
				\esc_html( \number_format_i18n( (int) $prpl_activities_count['delete'] ) ),
			);
			?>
		<?php endif; ?>
	</p>
</div>

