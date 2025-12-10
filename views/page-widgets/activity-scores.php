<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<h2 class="prpl-widget-title">
	<?php
	echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'activity-scores',
		\esc_html__( 'Your website activity score', 'progress-planner' )
	);
	?>

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

<div id="prpl-activity-scores-root"></div>
