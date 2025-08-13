<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Badges\Monthly;

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget = \progress_planner()->get_admin__widgets__suggested_tasks();
$prpl_badge  = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );
?>

<div class="prpl-dashboard-widget-suggested-tasks">
	<h2 class="prpl-widget-title">
		<?php
		echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			'suggested-tasks',
			\sprintf(
				/* translators: %s: "Ravi" */
				\esc_html__( '%s’s Recommendations', 'progress-planner' ),
				\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
			)
		);
		?>
	</h2>
	<p>
		<?php
		\printf(
			/* translators: %s: "Ravi" */
			\esc_html__( 'Complete a task from %s’s Recommendations to improve your site and earn points toward this month’s badge!', 'progress-planner' ),
			\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
		);
		?>
	</p>

	<ul style="display:none"></ul>
	<ul id="prpl-suggested-tasks-list" class="prpl-suggested-tasks-list"></ul>
	<p class="prpl-suggested-tasks-loading">
		<?php \esc_html_e( 'Loading tasks...', 'progress-planner' ); ?>
	</p>
	<p class="prpl-no-suggested-tasks">
		<?php \esc_html_e( 'You have completed all recommended tasks.', 'progress-planner' ); ?>
		<br>
		<?php \esc_html_e( 'Check back later for new tasks!', 'progress-planner' ); ?>
	</p>
	<hr>
</div>

<?php if ( $prpl_badge ) : ?>
	<h2 class="prpl-widget-title">
		<?php \esc_html_e( 'Your monthly badge', 'progress-planner' ); ?>
	</h2>

	<prpl-gauge
		id="prpl-gauge-ravi"
		background="var(--prpl-background-orange)"
		color="var(--prpl-color-accent-orange)"
		data-max="<?php echo (int) Monthly::TARGET_POINTS; ?>"
		data-value="<?php echo (float) $prpl_widget->get_score()['target_score']; ?>"
		data-badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
	>
		<progress max="<?php echo (int) Monthly::TARGET_POINTS; ?>" value="<?php echo (float) $prpl_widget->get_score()['target_score']; ?>">
			<prpl-badge
				complete="true"
				badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
				branding-id="<?php echo (int) \progress_planner()->get_ui__branding()->get_branding_id(); ?>"
			></prpl-badge>
		</progress>
	</prpl-gauge>

	<div class="prpl-widget-content-points">
		<span><?php \esc_html_e( 'Progress monthly badge', 'progress-planner' ); ?></span>
		<span id="prpl-widget-content-ravi-points-number" class="prpl-widget-content-points-number">
			<?php echo (int) $prpl_widget->get_score()['target_score']; ?>pt
		</span>
	</div>

	<?php if ( ! empty( $prpl_widget->get_previous_incomplete_months_badges() ) ) : ?>
		<hr>

		<?php
		$prpl_remaining_points = $prpl_widget->get_score()['target'] - $prpl_widget->get_score()['target_score'];
		$prpl_days_remaining   = (int) \gmdate( 't' ) - (int) \gmdate( 'j' );
		?>
		<div class="prpl-previous-month-badge-progress-bars-wrapper">
			<h3><?php \esc_html_e( 'Oh no! You missed the previous monthly badge!', 'progress-planner' ); ?></h3>
			<p><?php echo \wp_kses( \__( 'No worries though! <strong>Collect the surplus of points</strong> you earn, and get your badge!', 'progress-planner' ), [ 'strong' => [] ] ); ?></p>
			<?php foreach ( $prpl_widget->get_previous_incomplete_months_badges() as $prpl_previous_incomplete_month_badge ) : ?>
				<?php $prpl_remaining_points += $prpl_previous_incomplete_month_badge->progress_callback()['remaining']; ?>
				<div
					class="prpl-previous-month-badge-progress-bar-wrapper"
					style="padding: 1rem 0; background-color: var(--prpl-background-orange); border-radius: 0.5rem; padding: 1rem;"
					data-badge-id="<?php echo \esc_attr( $prpl_previous_incomplete_month_badge->get_id() ); ?>"
				>
					<prpl-badge-progress-bar
						data-badge-id="<?php echo \esc_attr( $prpl_previous_incomplete_month_badge->get_id() ); ?>"
						data-points="<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['points']; ?>"
						data-max-points="<?php echo (int) Monthly::TARGET_POINTS; ?>"
						data-branding-id="<?php echo (int) \progress_planner()->get_ui__branding()->get_branding_id(); ?>"
					></prpl-badge-progress-bar>

					<div class="prpl-widget-content-points">
						<span class="prpl-widget-previous-ravi-points-number" class="prpl-widget-content-points-number">
							<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['points']; ?>pt
						</span>
						<span class="prpl-previous-month-badge-progress-bar-remaining" data-remaining="<?php echo (int) $prpl_previous_incomplete_month_badge->progress_callback()['remaining']; ?>">
							<?php
							\printf(
								/* translators: %d: The number of points. */
								\esc_html__( '%1$d more points to go in the next %2$d days', 'progress-planner' ),
								(int) $prpl_remaining_points,
								(int) $prpl_days_remaining
							);
							?>
						</span>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<hr>
<?php endif; ?>

<div class="prpl-widget-content">
	<?php if ( 2024 === (int) \gmdate( 'Y' ) ) : ?>
		<?php
		\progress_planner()->the_view(
			'page-widgets/parts/monthly-badges-2024.php',
			[
				'title_tag' => 'h2',
			]
		);
		?>
	<?php else : ?>

		<?php
		\progress_planner()->the_view(
			'page-widgets/parts/monthly-badges.php',
			[
				'title_year' => 2025,
			]
		);
		?>
	<?php endif; ?>
	<?php
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button(
		'',
		\esc_html__( 'Show all my badges!', 'progress-planner' )
	);
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>
