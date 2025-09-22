<?php
/**
 * Front end onboarding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Front_End;

/**
 * Front end onboarding.
 */
class Front_End_Onboarding {

	/**
	 * The popover ID for front end onboarding.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'front-end-onboarding';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\add_action( 'wp_footer', [ $this, 'add_popover' ] );

		\add_action( 'wp_footer', [ $this, 'add_popover_style' ] );

		\add_action( 'wp_footer', [ $this, 'add_popover_inline_script' ] );

		// Add admin toolbar item.
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item' ] );

		// Note: AJAX action needs to be registered early (ie wrapping init in is_admin() check will be to late).
		\add_action( 'wp_ajax_progress_planner_tour_complete_task', [ $this, 'ajax_complete_task' ] );
		\add_action( 'wp_ajax_progress_planner_tour_save_progress', [ $this, 'ajax_save_tour_progress' ] );
	}

	/**
	 * Add admin toolbar item.
	 *
	 * @return void
	 */
	public function add_admin_toolbar_item() {
		\add_action( 'admin_bar_menu', [ $this, 'add_admin_toolbar_item_callback' ], 100 );
	}

	/**
	 * Add admin toolbar item callback.
	 *
	 * @param \WP_Admin_Bar $admin_bar The admin bar.
	 * @return void
	 */
	public function add_admin_toolbar_item_callback( $admin_bar ) {
		$admin_bar->add_node(
			[
				'id'    => 'progress-planner-tour',
				'title' => 'Progress Planner Tour',
				'href'  => '#',
				'meta'  => [
					'onclick' => 'prplStartTour(); return false;',
				],
			]
		);
	}

	/**
	 * Save the tour progress.
	 *
	 * @return void
	 */
	public function ajax_save_tour_progress() {
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['state'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'State is required.', 'progress-planner' ) ] );
		}
		$progress = \sanitize_text_field( \wp_unslash( $_POST['state'] ) );

		\error_log( print_r( $progress, true ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r, WordPress.PHP.DevelopmentFunctions.error_log_error_log

		// Save as user meta?
		\update_user_meta( \get_current_user_id(), '_prpl_tour_progress', $progress );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Tour progress saved.', 'progress-planner' ) ] );
	}

	/**
	 * Complete a task.
	 *
	 * @return void
	 */
	public function ajax_complete_task() {

		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task ID is required.', 'progress-planner' ) ] );
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );

		// Note: Completing task will set it it to pending, so user will get celebration.
		// Do we want that?
		$result = \progress_planner()->get_suggested_tasks()->complete_task( $task_id );

		if ( ! $result ) {
			\error_log( 'Task not completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not completed.', 'progress-planner' ) ] );
		}

		\error_log( 'Task completed: ' . $task_id ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		\wp_send_json_success( [ 'message' => \esc_html__( 'Task completed.', 'progress-planner' ) ] );
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>" class="prpl-popover prpl-popover-onboarding" data-prpl-step="0" popover>

			<div class="tour-header">
				<h2 class="tour-title">
					<!-- Tour title will be rendered here -->
				</h2>
			</div>
			<div class="tour-content">
				<!-- Tour content will be rendered here -->
			</div>
			<div class="tour-footer">
				<button class="prpl-tour-prev prpl-btn prpl-btn-primary">Back</button>
				<button class="prpl-tour-next prpl-btn prpl-btn-primary">Next</button>
				<button id="prpl-finish-btn" class="prpl-btn prpl-btn-primary">Finish</button>
			</div>
		</div>
		<?php
	}

	/**
	 * Add the popover style.
	 *
	 * @return void
	 */
	public function add_popover_style() {
		?>
		<style>
			#prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?> {

				padding: 24px 24px 14px 24px;
				box-sizing: border-box;

				background: #fff;
				border: 1px solid #9ca3af;
				border-radius: 8px;
				font-weight: 400;
				max-height: 82vh;
				width: 1200px;
				max-width: 80vw;

				&::backdrop {
					background: rgba(0, 0, 0, 0.5);
				}

				.prpl-btn {
					display: inline-block;
					margin: 1rem 0;
					padding: 0.75rem 1.25rem;
					color: #fff;
					text-decoration: none;
					cursor: pointer;
					font-size: 16px;
					background: #dd3244;
					line-height: 1.25;
					box-shadow: none;
					border: none;
					border-radius: 6px;
					transition: all 0.25s  ease-in-out;
					font-weight: 600;
					text-align: center;
					box-sizing: border-box;
					position: relative;
					z-index: 1;

					&:disabled {
						opacity: 0.5;
						pointer-events: none;
					}

					&:not([disabled]):hover,
					&:not([disabled]):focus {
						background: #cf2441;
					}
				}

				.prpl-complete-task-btn {
					border: none;
					background: none;
					cursor: pointer;
					padding: 0;
					margin: 0;
					font-size: 16px;
					color: #1e40af;
				}

				.prpl-complete-task-btn-completed {
					color: #059669;
				}

				.prpl-complete-task-btn-error {
					color: #9f0712;
				}

				.prpl-complete-task-item {
					margin-bottom: 1rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				#prpl-more-tasks-list {
					list-style: none;
					padding: 0;
					margin: 0;

					li:not(:last-child) {
						margin-bottom: 10px;
					}
				}
			}
		</style>
		<?php
	}

	/**
	 * Add the popover inline script.
	 *
	 * @return void
	 */
	public function add_popover_inline_script() {
		$ravis_recommendations = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => 'user',
						'operator' => 'NOT IN',
					],
				],
			]
		);
		$tasks                 = [];
		foreach ( $ravis_recommendations as $recommendation ) {

			$tasks[] = [
				'task_id'     => $recommendation->task_id,
				'title'       => $recommendation->post_title,
				'url'         => $recommendation->url,
				'provider_id' => $recommendation->get_provider_id(),
				'points'      => $recommendation->points,
			];
		}
		?>
		<script>
			const prplPopoverId = 'prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>';

			// Open popover on page load.
			document.addEventListener( 'DOMContentLoaded', function() {
				const popover = document.getElementById( prplPopoverId );
				if ( popover ) {
					// popover.showPopover();
					// renderStep();

					// popover.addEventListener( 'beforetoggle', ( event ) => {
					// 	if ( event.newState === 'open' ) {
					// 		console.log('Opened');
					// 		renderStep();
					// 	}

					// 	if ( event.newState === 'closed' ) {
					// 		console.log('Closed');
					// 		// TODO: Save progress to server.
					// 		saveProgressToServer({ finished: true });
					// 	}
					// } );
				}
			} );

			function prplStartTour() {
				const popover = document.getElementById(prplPopoverId);
				if ( popover ) {
					popover.showPopover();
					renderStep();
				}
			}

			// Prototyping code.
			ProgressPlannerData = {
				restUrl: '<?php echo \esc_url_raw( rest_url( 'progress-planner/v1/tour-progress' ) ); ?>',
				adminAjaxUrl: '<?php echo \esc_url_raw( admin_url( 'admin-ajax.php' ) ); ?>',
				nonceWpRest: '<?php echo \esc_js( \wp_create_nonce( 'wp_rest' ) ); ?>',
				nonceProgressPlanner: '<?php echo \esc_js( \wp_create_nonce( 'progress_planner' ) ); ?>',
				tasks: <?php echo \wp_json_encode( $tasks ); ?>,
			};

			const prplTourSteps = [
				{
					id: 'welcome',
					title: 'Welcome',
					render: () => document.getElementById('tour-step-welcome').innerHTML,
				},
				{
					id: 'first-task',
					title: 'Complete first task',
					render: () => document.getElementById('tour-step-first-task').innerHTML,
					onMount: (state) => {
						const btn = document.querySelector('#first-task-btn');

						const handler = (e) => {
							const thisBtn = e.target.closest('button');

							fetch(ProgressPlannerData.adminAjaxUrl, {
								method: 'POST',
								body: new URLSearchParams({
									task_id: thisBtn.dataset.taskId,
									nonce: ProgressPlannerData.nonceProgressPlanner,
									action: 'progress_planner_tour_complete_task',
								}),
							}).then(res => {
								if (!res.ok) throw new Error('Request failed: ' + res.status);
								return res.json();
							}).then(data => {
								thisBtn.classList.add('prpl-complete-task-btn-completed');
								state.data.firstTaskCompleted = {
									[ thisBtn.dataset.taskId ]: true,
								};
							}).catch(error => {
								console.error(error);
								thisBtn.classList.add('prpl-complete-task-btn-error');
							});
						};

						btn.addEventListener('click', handler );

						// Cleanup function — automatically removes event listener.
						return () => {
							btn.removeEventListener('click', handler);
						};
					},
					canProceed: (state) => !! state.data.firstTaskCompleted,
				},
				{
					id: 'badges',
					title: 'Our badges are waiting for you',
					render: () => document.getElementById('tour-step-badges').innerHTML,
				},
				{
					id: 'more-tasks',
					title: 'Complete more tasks',
					render: () => document.getElementById('tour-step-more-tasks').innerHTML,
					onMount: (state) => {
						// Set more tasks completed to empty object.
						state.data.moreTasksCompleted = {};

						const handler = (e) => {
							const thisBtn = e.target.closest('button');

							fetch(ProgressPlannerData.adminAjaxUrl, {
								method: 'POST',
								body: new URLSearchParams({
									task_id: thisBtn.dataset.taskId,
									nonce: ProgressPlannerData.nonceProgressPlanner,
									action: 'progress_planner_tour_complete_task',
								}),
							}).then(res => {
								if (!res.ok) throw new Error('Request failed: ' + res.status);
								return res.json();
							}).then(data => {
								thisBtn.classList.add('prpl-complete-task-btn-completed');
								state.data.moreTasksCompleted[ thisBtn.dataset.taskId ] = true;
							}).catch(error => {
								console.error(error);
								thisBtn.classList.add('prpl-complete-task-btn-error');
							});

						};

						const btns = document.querySelectorAll('button[data-task-id]');

						btns.forEach(btn => {
							btn.addEventListener('click', handler );

							// Set more tasks completed to false.
							state.data.moreTasksCompleted[ btn.dataset.taskId ] = false;
						});

						// Cleanup function — automatically removes event listener.
						return () => {
							btns.forEach(btn => {
								btn.removeEventListener('click', handler);
							});
						};
					},
					canProceed: (state) => {
						return Object.keys(state.data.moreTasksCompleted).length > 0 && Object.values(state.data.moreTasksCompleted).every(Boolean);
					},
				},
				{
					id: 'finish',
					title: 'Done',
					render: () => document.getElementById('tour-step-finish').innerHTML,
					onMount: (state) => {
						const btn = document.querySelector('#prpl-finish-btn');
						const handler = () => {
							state.data.finished = true;

							// close the tour
							closeTour();
						};
						btn.addEventListener('click', handler );
						return () => {
							btn.removeEventListener('click', handler);
						};
					},
				}
			];

			// State.
			const prplTourState = {
				currentStep: 0,
				data: {
					moreTasksCompleted: {},
					firstTaskCompleted: false,
					finished: false,
				},
			};

			function renderStep() {
				const step = prplTourSteps[prplTourState.currentStep];
				const popover = document.getElementById(prplPopoverId);
				popover.querySelector('.tour-title').innerHTML = step.title;
				popover.querySelector('.tour-content').innerHTML = step.render();

				// Unmount per-step logic.
				if (prplTourState.cleanup) {
					prplTourState.cleanup();
				}

				// Mount per-step logic.
				if (typeof step.onMount === 'function') {
					prplTourState.cleanup = step.onMount(prplTourState);
				} else {
					prplTourState.cleanup = () => {};
				}

				// Update data-prpl-step attribute.
				popover.dataset.prplStep = prplTourState.currentStep;

				updateNextButton();

				// If we reached last step, show finish button.
				if (prplTourState.currentStep === prplTourSteps.length - 1) {
					// Hide other buttons.
					popover.querySelector('.prpl-tour-prev').style.display = 'none';
					popover.querySelector('.prpl-tour-next').style.display = 'none';

					// Show finish button.
					popover.querySelector('#prpl-finish-btn').style.display = 'inline-block';
				} else {
					// Hide finish button.
					popover.querySelector('#prpl-finish-btn').style.display = 'none';

					// Show other buttons.
					popover.querySelector('.prpl-tour-prev').style.display = 'inline-block';
					popover.querySelector('.prpl-tour-next').style.display = 'inline-block';
				}
			}

			function nextStep() {
				const step = prplTourSteps[prplTourState.currentStep];
				if (step.canProceed && !step.canProceed(prplTourState)) return;

				if (prplTourState.currentStep < prplTourSteps.length - 1) {
					prplTourState.currentStep++;
					saveProgressToServer(prplTourState);
					renderStep();
				} else {
					closeTour();
				}
			}

			function prevStep() {
				if (prplTourState.currentStep > 0) {
					prplTourState.currentStep--;
					renderStep();
				}
			}

			function closeTour() {
				const popover = document.getElementById( prplPopoverId );

				if ( popover ) {
					popover.hidePopover();
				}

				saveProgressToServer( prplTourState );
			}

			// Persistence, save state (if we want to allow user to continue the tour later).
			function saveProgressToServer(state) {

				// Or use browser's localStorage.
				return fetch(ProgressPlannerData.adminAjaxUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						state: JSON.stringify(state),
						nonce: ProgressPlannerData.nonceProgressPlanner,
						action: 'progress_planner_tour_save_progress',
					}),
					credentials: 'same-origin', // ensures cookies (auth) are sent
				}).then(res => {
					if (!res.ok) throw new Error('Request failed: ' + res.status);
					return res.json();
				});
			}

			// Bootstrapping.
			document.addEventListener('DOMContentLoaded', () => {
				const popover = document.getElementById(prplPopoverId);
				popover.querySelector('.prpl-tour-next').addEventListener('click', nextStep);
				popover.querySelector('.prpl-tour-prev').addEventListener('click', prevStep);

				// Fetch saved state (if we want to allow user to continue the tour later).
			});

			// Deep proxy function to watch nested object changes.
			function createDeepProxy(target, callback) {
				return new Proxy(target, {
					set(obj, prop, value) {
						// If the value is an object, make it a deep proxy too
						if (value && typeof value === 'object' && !Array.isArray(value)) {
							value = createDeepProxy(value, callback);
						}

						obj[prop] = value;
						callback();
						return true;
					}
				});
			}

			// Live update whenever state changes (including nested objects).
			prplTourState.data = createDeepProxy( prplTourState.data, updateNextButton );

			function updateNextButton() {
				const step = prplTourSteps[ prplTourState.currentStep ];

				const popover = document.getElementById( prplPopoverId );
				const nextBtn = popover.querySelector( '.prpl-tour-next' );

				if ( step.canProceed ) {
					nextBtn.disabled = ! step.canProceed( prplTourState );
				} else {
					nextBtn.disabled = false;
				}
			}
		</script>

		<!-- Tour step welcome -->
		<script type="text/template" id="tour-step-welcome">
			<p>Welcome to the Progress Planner onboarding.</p>
		</script>

		<!-- Tour step connect -->
		<script type="text/template" id="tour-step-first-task">
			<p>You have pending tasks to complete.</p>
			<?php if ( isset( $tasks[0] ) ) : ?>
			<p class="prpl-complete-task-item">
				<?php echo esc_html( $tasks[0]['title'] ); ?>
				<button id="first-task-btn" data-task-id="<?php echo esc_attr( $tasks[0]['task_id'] ); ?>" class="prpl-complete-task-btn">Complete first task</button>
			</p>
			<div id="first-task-status"></div>
			<?php endif; ?>
		</script>

		<!-- Tour step badges -->
		<script type="text/template" id="tour-step-badges">
			<p>
				Every step you take makes your website better. Progress Planner tracks your progress, celebrating achievements with badges and streaks to keep you motivated and engaged.
			</p>
		</script>

		<!-- Tour step more tasks -->
		<script type="text/template" id="tour-step-more-tasks">
			<p>Check out more tasks to complete:</p>
			<ul id="prpl-more-tasks-list">
				<?php
				for ( $i = 1; $i < 6; $i++ ) :
					if ( ! isset( $tasks[ $i ] ) ) {
						break; }
					?>
					<li class="prpl-complete-task-item">
						<?php echo esc_html( $tasks[ $i ]['title'] ); ?>
						<button id="more-tasks-btn-<?php echo esc_attr( $tasks[ $i ]['task_id'] ); ?>" data-task-id="<?php echo esc_attr( $tasks[ $i ]['task_id'] ); ?>" class="prpl-complete-task-btn">Complete task</button>
					</li>
				<?php endfor; ?>
			</ul>
		</script>

		<!-- Tour step finish -->
		<script type="text/template" id="tour-step-finish">
			<p>Congratulations, setup complete. 🎉</p>
		</script>
		<?php
	}
}
