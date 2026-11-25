<?php
/**
 * Monthly badges popover.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_stats       = \progress_planner()->get_admin__widgets__monthly_badges()->get_popover_stats();
$prpl_branding_id = (int) \progress_planner()->get_ui__branding()->get_branding_id();

// Newest year first.
$prpl_years = $prpl_stats['years'];
\krsort( $prpl_years );
?>
<h2 class="screen-reader-text"><?php \esc_html_e( 'Your badges', 'progress-planner' ); ?></h2>

<div class="prpl-monthly-badges-popover">
	<div class="prpl-badges-summary">
		<div class="prpl-badges-summary-intro">
			<p><strong><?php \esc_html_e( 'You can find the results of your hard work here!', 'progress-planner' ); ?></strong></p>
			<p>
				<?php
				echo \wp_kses(
					\sprintf(
						/* translators: %s: The number of months, for example "17 months", in bold. */
						\esc_html__( 'You’ve worked on your site with Progress Planner for %s now.', 'progress-planner' ),
						'<strong>' . \sprintf(
							/* translators: %s: The number of months. */
							\esc_html( \_n( '%s month', '%s months', $prpl_stats['months'], 'progress-planner' ) ),
							\number_format_i18n( $prpl_stats['months'] )
						) . '</strong>'
					),
					[ 'strong' => [] ]
				);
				?>
			</p>
		</div>
		<div class="prpl-badges-stat">
			<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_stats['badges'] ) ); ?></span>
			<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'badge earned in total', 'badges earned in total', $prpl_stats['badges'], 'progress-planner' ) ); ?></span>
		</div>
		<div class="prpl-badges-stat">
			<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_stats['tasks'] ) ); ?></span>
			<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'task completed in total', 'tasks completed in total', $prpl_stats['tasks'], 'progress-planner' ) ); ?></span>
		</div>
	</div>

	<?php foreach ( $prpl_years as $prpl_badges_year => $prpl_year_stats ) : ?>
		<section class="prpl-badges-year">
			<h3 class="prpl-badges-year-title">
				<?php
				\printf(
					/* translators: %d: year */
					\esc_html__( 'Monthly badges %d', 'progress-planner' ),
					(int) $prpl_badges_year
				);
				?>
			</h3>
			<div class="prpl-badges-year-content">
				<div class="prpl-badges-year-grid badge-group-monthly">
					<?php foreach ( $prpl_year_stats['items'] as $prpl_item ) : ?>
						<?php
						$prpl_badge          = $prpl_item['badge'];
						$prpl_badge_progress = $prpl_item['progress'];
						$prpl_badge_state    = $prpl_item['state'];
						$prpl_is_complete    = 100 === (int) $prpl_badge_progress['progress'];
						?>
						<span
							class="prpl-badge prpl-badge-<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
							data-value="<?php echo \esc_attr( $prpl_badge_progress['progress'] ); ?>"
							data-monthly-is-missed="<?php echo 'missed' === $prpl_badge_state ? 'true' : 'false'; ?>"
							<?php if ( '' !== $prpl_badge_state ) : ?>
								data-state="<?php echo \esc_attr( $prpl_badge_state ); ?>"
								tabindex="0"
							<?php endif; ?>
						>
							<span class="prpl-badge-image">
								<prpl-badge
									complete="<?php echo $prpl_is_complete ? 'true' : 'false'; ?>"
									badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
									badge-name="<?php echo \esc_attr( $prpl_badge->get_name() ); ?>"
									branding-id="<?php echo (int) $prpl_branding_id; ?>"
								></prpl-badge>
								<?php if ( 'missed' === $prpl_badge_state ) : ?>
									<span class="prpl-badge-points-to-go">
										<span class="prpl-badge-points-to-go-icon" aria-hidden="true">!</span>
										<?php
										\printf(
											/* translators: %s: The number of points. */
											\esc_html( \_n( '%s point to go', '%s points to go', (int) $prpl_badge_progress['remaining'], 'progress-planner' ) ),
											\esc_html( \number_format_i18n( (int) $prpl_badge_progress['remaining'] ) )
										);
										?>
									</span>
								<?php endif; ?>
							</span>
							<p class="prpl-badge-name">
								<span class="prpl-badge-name-default"><?php echo \esc_html( $prpl_badge->get_name() ); ?></span>
								<?php if ( 'in-progress' === $prpl_badge_state ) : ?>
									<span class="prpl-badge-name-hover"><?php \esc_html_e( 'In progress', 'progress-planner' ); ?></span>
								<?php endif; ?>
							</p>
						</span>
					<?php endforeach; ?>
				</div>
				<div class="prpl-badges-year-stats">
					<div class="prpl-badges-stat">
						<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_year_stats['badges'] ) ); ?></span>
						<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'badge earned', 'badges earned', $prpl_year_stats['badges'], 'progress-planner' ) ); ?></span>
					</div>
					<div class="prpl-badges-stat">
						<span class="prpl-badges-stat-number"><?php echo \esc_html( \number_format_i18n( $prpl_year_stats['tasks'] ) ); ?></span>
						<span class="prpl-badges-stat-label"><?php echo \esc_html( \_n( 'task completed', 'tasks completed', $prpl_year_stats['tasks'], 'progress-planner' ) ); ?></span>
					</div>
				</div>
			</div>
		</section>
	<?php endforeach; ?>

	<?php
	/*
	 * The content and streak badges stay here until they get their own
	 * popovers (pro#190); the streak and content widgets still open this one.
	 */
	$prpl_badges_groups = [
		'content'     => \__( 'Content badges', 'progress-planner' ),
		'maintenance' => \__( 'Streak badges', 'progress-planner' ),
	];
	?>
	<div class="prpl-widgets-container in-popover">
		<?php foreach ( $prpl_badges_groups as $prpl_badge_group => $prpl_widget_title ) : ?>
			<div class="prpl-widget-wrapper prpl-widget-wrapper-<?php echo \esc_attr( $prpl_badge_group ); ?> in-popover  prpl-badge-streak">
				<h3 class="prpl-widget-title">
					<?php echo \esc_html( $prpl_widget_title ); ?>
				</h3>
				<div class="prpl-badges-container-achievements">
					<?php $prpl_group_badges = \progress_planner()->get_badges()->get_badges( $prpl_badge_group ); ?>
					<div class="progress-wrapper badge-group-<?php echo \esc_attr( $prpl_badge_group ); ?>">
						<?php foreach ( $prpl_group_badges as $prpl_badge ) : ?>
							<?php $prpl_badge_progress = $prpl_badge->get_progress(); ?>
							<span
								class="prpl-badge"
								data-value="<?php echo \esc_attr( $prpl_badge_progress['progress'] ); ?>"
							>
								<prpl-badge
									complete="<?php echo 100 === (int) $prpl_badge_progress['progress'] ? 'true' : 'false'; ?>"
									badge-id="<?php echo \esc_attr( $prpl_badge->get_id() ); ?>"
									badge-name="<?php echo \esc_attr( $prpl_badge->get_name() ); ?>"
									branding-id="<?php echo (int) $prpl_branding_id; ?>"
								></prpl-badge>
								<p><?php echo \esc_html( $prpl_badge->get_name() ); ?></p>
							</span>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
		<?php \do_action( 'progress_planner_popover_after_badge_groups' ); ?>
	</div>
</div>
