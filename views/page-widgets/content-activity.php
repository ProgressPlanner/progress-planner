<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__content_activity();

$prpl_activity_types = [
	'publish' => [
		'label' => \__( 'Published', 'progress-planner' ),
		'color' => 'var(--prpl-color-accent-green)',
	],
	'update'  => [
		'label' => \__( 'Updated', 'progress-planner' ),
		'color' => 'var(--prpl-color-accent-purple)',
	],
	'delete'  => [
		'label' => \__( 'Deleted', 'progress-planner' ),
		'color' => 'var(--prpl-color-accent-red)',
	],
];

$prpl_tracked_post_types = \progress_planner()->get_activities__content_helpers()->get_post_types_names();
$prpl_activities_count   = [
	'all' => 0,
];

$prpl_chart_data    = [];
$prpl_chart_options = [
	'dataArgs' => [],
	'chartId'  => 'prpl-chart-content-activity',
];
foreach ( $prpl_activity_types as $prpl_activity_type => $prpl_activity_data ) {
	$prpl_chart_data[ $prpl_activity_type ] = \progress_planner()
		->get_ui__chart()
		->get_chart_data(
			$prpl_widget->get_chart_args_content_count(
				$prpl_activity_type,
				$prpl_activity_data['color']
			)
		);

	$prpl_chart_options['dataArgs'][ $prpl_activity_type ] = [
		'color' => $prpl_activity_data['color'],
		'label' => $prpl_activity_data['label'],
	];
}

foreach ( \array_keys( $prpl_activity_types ) as $prpl_activity_type ) {
	// Default count.
	$prpl_activities_count[ $prpl_activity_type ] = 0;

	// Get the activities.
	$prpl_activities = \progress_planner()->get_activities__query()->query_activities(
		[
			'category'   => 'content',
			'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
			'end_date'   => \gmdate( 'Y-m-d' ),
			'type'       => $prpl_activity_type,
		]
	);

	if ( $prpl_activities ) {
		if ( 'delete' !== $prpl_activity_type ) {
			// Filter the activities to only include the tracked post types.
			$prpl_activities = \array_filter(
				$prpl_activities,
				function ( $activity ) use ( $prpl_tracked_post_types ) {
					return \in_array( \get_post_type( $activity->data_id ), $prpl_tracked_post_types, true );
				}
			);
		}

		// Update the count.
		$prpl_activities_count[ $prpl_activity_type ] = \count( $prpl_activities );
	}

	$prpl_activities_count['all'] += $prpl_activities_count[ $prpl_activity_type ];
}
?>

<h2 class="prpl-widget-title">
	<?php \esc_html_e( 'Content activity', 'progress-planner' ); ?>
</h2>
<p>
	<?php \esc_html_e( 'Here are the updates you made to your content last week. Whether you published something new, updated an existing post, or removed outdated content, it all helps you stay on top of your site!', 'progress-planner' ); ?>
</p>

<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_activities_count['all'] ) ); ?>"
	content="<?php \esc_attr_e( 'pieces of content managed', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-blue)"
></prpl-big-counter>

<div class="prpl-graph-wrapper">
	<prpl-chart-line
		data="<?php echo \esc_attr( (string) \wp_json_encode( $prpl_chart_data ) ); ?>"
		data-options="<?php echo \esc_attr( (string) \wp_json_encode( $prpl_chart_options ) ); ?>"
	></prpl-chart-line>
</div>

<table>
	<thead>
		<tr>
			<th><?php \esc_html_e( 'Content managed', 'progress-planner' ); ?></th>
			<th><?php \esc_html_e( 'Last week', 'progress-planner' ); ?></th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ( $prpl_activity_types as $prpl_activity_type => $prpl_activity_data ) : ?>
			<tr>
				<th><?php echo \esc_html( $prpl_activity_data['label'] ); ?></th>
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