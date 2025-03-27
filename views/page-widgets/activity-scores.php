<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new \Progress_Planner\Web_Components\Big_Counter();
new \Progress_Planner\Web_Components\Gauge();

$prpl_widget = \progress_planner()->get_widgets__activity_scores();
$prpl_record = $prpl_widget->personal_record_callback();

?>
<h2 class="prpl-widget-title">
	<?php \esc_html_e( 'Your website activity score', 'progress-planner' ); ?>

	<div class="tooltip-actions">
		<prpl-tooltip>
			<slot name="open-icon">
				<span class="icon prpl-info-icon">
					<?php \progress_planner()->the_asset( 'images/icon_info.svg' ); ?>
					<span class="screen-reader-text"><?php \esc_html_e( 'More info', 'progress-planner' ); ?></span>
				</span>
			</slot>
			<slot name="content">
				<?php \esc_html_e( 'Your website activity score is based on the amount of website maintenance work you have done over the past 30 days.', 'progress-planner' ); ?>
			</slot>
		</prpl-tooltip>
	</div>
</h2>

<div style="--background: var(--prpl-background-orange)">
	<prpl-gauge background="var(--prpl-background-green)" color="<?php echo esc_attr( $prpl_widget->get_gauge_color( $prpl_widget->get_score() ) ); ?>" contentFontSize="var(--prpl-font-size-6xl)">
		<progress max="100" value="<?php echo (float) $prpl_widget->get_score(); ?>">
			<?php echo \esc_html( $prpl_widget->get_score() ); ?>
		</progress>
	</prpl-gauge>
</div>

<hr>

<p><?php \esc_html_e( 'Check out your website activity in the past months:', 'progress-planner' ); ?></p>
<div class="prpl-graph-wrapper">
	<?php
	\progress_planner()->get_chart()->the_chart(
		[
			'type'           => 'bar',
			'items_callback' => function ( $start_date, $end_date ) {
				return \progress_planner()->get_query()->query_activities(
					[
						'start_date' => $start_date,
						'end_date'   => $end_date,
					]
				);
			},
			'dates_params'   => [
				'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $prpl_widget->get_range() ),
				'end_date'   => new \DateTime(),
				'frequency'  => $prpl_widget->get_frequency(),
				'format'     => 'M',
			],
			'count_callback' => function ( $activities, $date ) {
				$score = 0;
				foreach ( $activities as $activity ) {
					$score += $activity->get_points( $date );
				}
				return $score * 100 / Base::SCORE_TARGET;
			},
			'normalized'     => true,
			'color'          => [ $prpl_widget, 'get_color' ],
			'max'            => 100,
		]
	);
	?>
</div>

<hr>

<prpl-big-counter
	number="<?php echo \esc_html( \number_format_i18n( (int) $prpl_record['max_streak'] ) ); ?>"
	content="<?php echo \esc_attr_e( 'personal record', 'progress-planner' ); ?>"
	background-color="var(--prpl-background-green)"
></prpl-big-counter>

<div class="prpl-widget-content">
	<?php
	if ( (int) $prpl_record['max_streak'] === 0 ) {
		\esc_html_e( 'This is the start of your first streak! Add content to your site every week and set a personal record!', 'progress-planner' );
	} elseif ( (int) $prpl_record['max_streak'] <= (int) $prpl_record['current_streak'] ) {
		printf(
			\esc_html(
				/* translators: %s: number of weeks. */
				\_n(
					'Congratulations! You\'re on a streak! You\'ve consistently maintained your website for the past %s week! 🎉',
					'Congratulations! You\'re on a streak! You\'ve consistently maintained your website for the past %s weeks! 🎉',
					(int) $prpl_record['current_streak'],
					'progress-planner'
				)
			),
			\esc_html( \number_format_i18n( $prpl_record['current_streak'] ) )
		);
	} elseif ( 1 <= $prpl_record['current_streak'] ) {
		printf(
			\esc_html(
				/* translators: %1$s: number of weeks for the current streak. %2$s: number of weeks for the maximum streak. %3$s: The number of weeks to go in order to break the record. */
				\_n(
					'Keep it up! You\'ve consistently maintained your website for the past %1$s week. Your longest streak was %2$s weeks, %3$s more to go to break your record!',
					'Keep it up! You\'ve consistently maintained your website for the past %1$s weeks. Your longest streak was %2$s weeks, %3$s more to go to break your record!',
					(int) $prpl_record['current_streak'],
					'progress-planner'
				)
			),
			\esc_html( \number_format_i18n( $prpl_record['current_streak'] ) ),
			\esc_html( \number_format_i18n( $prpl_record['max_streak'] ) ),
			\esc_html( \number_format_i18n( $prpl_record['max_streak'] - $prpl_record['current_streak'] ) )
		);
	} else {
		printf(
			\esc_html(
				/* translators: %1$s: number of weeks for the maximum streak. */
				\_n(
					'Get back to your streak! Your longest streak was %s week. Keep working on those website maintenance tasks every week and break your record!',
					'Get back to your streak! Your longest streak was %s weeks. Keep working on those website maintenance tasks every week and break your record!',
					(int) $prpl_record['max_streak'],
					'progress-planner'
				)
			),
			\esc_html( \number_format_i18n( $prpl_record['max_streak'] ) )
		);
	}
	?>
</div>
