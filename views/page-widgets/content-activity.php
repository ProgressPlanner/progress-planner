<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__content_activity();

$prpl_activities_count = [
	'all' => 0,
];
foreach ( [ 'publish', 'update', 'delete' ] as $prpl_activity_type ) {
	$prpl_activities_count[ $prpl_activity_type ] = count(
		\progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'content',
				'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
				'end_date'   => \gmdate( 'Y-m-d' ),
				'type'       => $prpl_activity_type,
			]
		)
	);
	$prpl_activities_count['all']                += $prpl_activities_count[ $prpl_activity_type ];
}
?>

<h2 class="prpl-widget-title">
	<?php \esc_html_e( 'Content activity', 'progress-planner' ); ?>
</h2>

<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_activities_count['all'] ) ); ?>"
	content="<?php \esc_attr_e( 'content managed', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-blue)"
></prpl-big-counter>

<h3><?php \esc_html_e( 'Content published', 'progress-planner' ); ?></h3>
<div class="prpl-graph-wrapper">
	<?php
	\progress_planner()->get_ui__chart()->the_chart(
		$prpl_widget->get_chart_args_content_count(
			'publish',
			'var(--prpl-color-accent-green)'
		)
	);
	?>
</div>

<h3><?php \esc_html_e( 'Content updated', 'progress-planner' ); ?></h3>
<div class="prpl-graph-wrapper">
	<?php
	\progress_planner()->get_ui__chart()->the_chart(
		$prpl_widget->get_chart_args_content_count(
			'update',
			'var(--prpl-color-accent-purple)'
		)
	);
	?>
</div>

<h3><?php \esc_html_e( 'Content deleted', 'progress-planner' ); ?></h3>
<div class="prpl-graph-wrapper">
	<?php
	\progress_planner()->get_ui__chart()->the_chart(
		$prpl_widget->get_chart_args_content_count(
			'delete',
			'var(--prpl-color-accent-red)'
		)
	);
	?>
</div>

<table>
	<thead>
		<tr>
			<th><?php \esc_html_e( 'Content managed', 'progress-planner' ); ?></th>
			<th><?php \esc_html_e( 'Last week', 'progress-planner' ); ?></th>
		</tr>
	</thead>
	<tbody>
		<?php
		foreach ( [
			'publish' => __( 'Content published', 'progress-planner' ),
			'update'  => __( 'Content updated', 'progress-planner' ),
			'delete'  => __( 'Content deleted', 'progress-planner' ),
		] as $prpl_activity_type => $prpl_activity_label ) :
			?>
			<tr>
				<th><?php echo \esc_html( $prpl_activity_label ); ?></th>
				<td><?php echo \esc_html( \number_format_i18n( $prpl_activities_count[ $prpl_activity_type ] ) ); ?></td>
			</tr>
		<?php endforeach; ?>
	</tbody>
	<tfoot>
		<tr>
			<th><?php \esc_html_e( 'Total', 'progress-planner' ); ?></th>
			<td><?php echo \esc_html( \number_format_i18n( $prpl_activities_count['all'] ) ); ?></td>
		</tr>
	</tfoot>
</table>