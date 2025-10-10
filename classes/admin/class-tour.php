<?php
/**
 * Handle admin tour.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Tour class.
 */
class Tour {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
	}

	/**
	 * Get an array of steps.
	 *
	 * @return array
	 */
	public function get_steps() {
		return [
			[
				'element' => '#prpl-start-tour-icon-button',
				'popover' => [
					'title'       => \sprintf(
						/* translators: %s: Progress Planner name. */
						\esc_html__( 'Tour of %s', 'progress-planner' ),
						\esc_html( \progress_planner()->get_ui__branding()->get_progress_planner_name() )
					),
					'description' => \esc_html__( "We'll show you around the plugin. You can stop at any time, and restart the tour at any time by clicking this button.", 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '.prpl-widget-wrapper.prpl-activity-scores prpl-gauge',
				'popover' => [
					'title'       => \esc_html__( 'Website activity score', 'progress-planner' ),
					'description' => \esc_html__( "This is the website activity score. It shows how active you've been on your website.", 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '.prpl-widget-wrapper.prpl-activity-scores .prpl-graph-wrapper',
				'popover' => [
					'title'       => \esc_html__( 'Longterm activity score', 'progress-planner' ),
					'description' => \esc_html__( "Here, we show you your longterm activity score. This shows whether you've been active on your website over a longer period of time.", 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '.prpl-widget-wrapper.prpl-todo',
				'popover' => [
					'title'       => \esc_html__( 'Your to-do list', 'progress-planner' ),
					'description' => \esc_html__( 'This is where you can see your to-do list. You can add tasks to your to-do list by clicking the "Add to do" button. You can also see these to-do items on your dashboard.', 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '#prpl-popover-monthly-badges-trigger',
				'popover' => [
					'title'       => \esc_html__( 'Monthly badges', 'progress-planner' ),
					'description' => \esc_html__( 'With this button you can open the monthly badges.', 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '#prpl-popover-monthly-badges',
				'popover' => [
					'title'       => \esc_html__( 'Your badges', 'progress-planner' ),
					'description' => \esc_html__( 'As you progress and are more active on your website, you can earn badges. These badges are displayed here!', 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '.prpl-widget-wrapper.prpl-badge-streak .prpl-info-icon',
				'popover' => [
					'title'       => \esc_html__( 'Your badge progress', 'progress-planner' ),
					'description' => \esc_html__( 'Clicking the info icon will show you more information about your badge progress. You can also learn about streak freezes here.', 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
			[
				'element' => '.prpl-latest-badges-wrapper',
				'popover' => [
					'title'       => \esc_html__( 'Your latest badges', 'progress-planner' ),
					'description' => \esc_html__( 'There are your latest badges. Click on them to share them with your friends!', 'progress-planner' ),
					'side'        => 'top',
					'align'       => 'center',
				],
			],
		];
	}

	/**
	 * Register scripts & styles.
	 *
	 * @param string $hook The current page hook.
	 *
	 * @return void
	 */
	public function register_scripts( $hook ) {
		if ( 'toplevel_page_progress-planner' !== $hook ) {
			return;
		}

		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'tour',
			[
				'name' => 'progressPlannerTour',
				'data' => [
					'steps' => \progress_planner()->get_admin__tour()->get_steps(),
				],
			]
		);

		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/vendor/driver' );
	}
}
