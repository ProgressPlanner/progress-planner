<?php
/**
 * Tour Launcher Widget Component
 *
 * Renders a UI component that displays available tours and allows users to start them.
 * This is for hosting partner installations, distinct from the plugin onboarding.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Guided_Tour;

/**
 * Renders tour launcher UI components.
 */
class Tour_Launcher {

	/**
	 * Guided tour instance.
	 *
	 * @var Guided_Tour
	 */
	private Guided_Tour $tour;

	/**
	 * Constructor.
	 *
	 * @param Guided_Tour $tour Tour instance.
	 */
	public function __construct( Guided_Tour $tour ) {
		$this->tour = $tour;
	}

	/**
	 * Render the tour launcher widget.
	 *
	 * @param array $args Widget arguments.
	 */
	public function render( array $args = [] ): void {
		$args = wp_parse_args(
			$args,
			[
				'title'       => __( 'Guided Tours', 'progress-planner' ),
				'description' => __( 'Get started with interactive walkthroughs.', 'progress-planner' ),
				'show_all'    => true,
				'tour_ids'    => [], // Specific tours to show, empty = all.
			]
		);

		$available_tours = $this->tour->get_available_tours();

		// Filter to specific tours if requested.
		if ( ! empty( $args['tour_ids'] ) ) {
			$available_tours = array_intersect_key(
				$available_tours,
				array_flip( $args['tour_ids'] )
			);
		}

		if ( empty( $available_tours ) ) {
			return;
		}

		?>
		<div class="pp-guided-tour-launcher">
			<h3 class="pp-guided-tour-launcher-title"><?php echo esc_html( $args['title'] ); ?></h3>
			<p class="pp-guided-tour-launcher-description"><?php echo esc_html( $args['description'] ); ?></p>

			<ul class="pp-guided-tour-launcher-list">
				<?php foreach ( $available_tours as $tour_id => $tour ) : ?>
					<li class="pp-guided-tour-launcher-item">
						<div class="pp-guided-tour-launcher-item-info">
							<div class="pp-guided-tour-launcher-item-title">
								<?php echo esc_html( $tour['title'] ); ?>
							</div>
							<div class="pp-guided-tour-launcher-item-meta">
								<?php
								printf(
									/* translators: %d: number of steps */
									esc_html( _n( '%d step', '%d steps', $tour['stepCount'], 'progress-planner' ) ),
									(int) $tour['stepCount']
								);
								?>
							</div>
						</div>
						<button
							type="button"
							class="pp-guided-tour-launcher-start-btn"
							data-start-tour="<?php echo esc_attr( $tour_id ); ?>"
						>
							<?php esc_html_e( 'Start', 'progress-planner' ); ?>
						</button>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
	}

	/**
	 * Render a single tour button.
	 *
	 * @param string $tour_id Tour identifier.
	 * @param array  $args    Button arguments.
	 */
	public function render_button( string $tour_id, array $args = [] ): void {
		$available_tours = $this->tour->get_available_tours();

		if ( ! isset( $available_tours[ $tour_id ] ) ) {
			return;
		}

		$tour = $available_tours[ $tour_id ];
		$args = wp_parse_args(
			$args,
			[
				'text'  => sprintf(
					/* translators: %s: tour title */
					__( 'Take the %s tour', 'progress-planner' ),
					$tour['title']
				),
				'class' => 'button button-secondary',
			]
		);

		?>
		<button
			type="button"
			class="<?php echo esc_attr( $args['class'] ); ?>"
			data-start-tour="<?php echo esc_attr( $tour_id ); ?>"
		>
			<?php echo esc_html( $args['text'] ); ?>
		</button>
		<?php
	}

	/**
	 * Check if a tour is available (not completed).
	 *
	 * @param string $tour_id Tour identifier.
	 * @return bool True if available.
	 */
	public function is_tour_available( string $tour_id ): bool {
		$available_tours = $this->tour->get_available_tours();
		return isset( $available_tours[ $tour_id ] );
	}

	/**
	 * Maybe show tour prompt for first-time users.
	 *
	 * @param string $tour_id Tour identifier.
	 * @param array  $args    Prompt arguments.
	 */
	public function maybe_show_prompt( string $tour_id, array $args = [] ): void {
		// Check if this is a new user who should see the prompt.
		$user_id       = get_current_user_id();
		$dismissed_key = 'pp_guided_tour_prompt_dismissed_' . $tour_id;

		if ( get_user_meta( $user_id, $dismissed_key, true ) ) {
			return;
		}

		if ( ! $this->is_tour_available( $tour_id ) ) {
			return;
		}

		$available_tours = $this->tour->get_available_tours();
		$tour            = $available_tours[ $tour_id ];

		$args = wp_parse_args(
			$args,
			[
				'title'       => sprintf(
					/* translators: %s: tour title */
					__( 'New here? Try the %s tour!', 'progress-planner' ),
					$tour['title']
				),
				'description' => $tour['description'],
				'dismissible' => true,
			]
		);

		?>
		<div class="pp-guided-tour-prompt notice notice-info is-dismissible" data-tour-prompt="<?php echo esc_attr( $tour_id ); ?>">
			<p>
				<strong><?php echo esc_html( $args['title'] ); ?></strong><br>
				<?php echo esc_html( $args['description'] ); ?>
			</p>
			<p>
				<button
					type="button"
					class="button button-primary"
					data-start-tour="<?php echo esc_attr( $tour_id ); ?>"
				>
					<?php esc_html_e( 'Start Tour', 'progress-planner' ); ?>
				</button>
			</p>
		</div>
		<script>
		( function() {
			const prompt = document.querySelector( '[data-tour-prompt="<?php echo esc_js( $tour_id ); ?>"]' );
			if ( ! prompt ) return;

			const dismissBtn = prompt.querySelector( '.notice-dismiss' );
			if ( dismissBtn ) {
				dismissBtn.addEventListener( 'click', function() {
					fetch( '<?php echo esc_js( admin_url( 'admin-ajax.php' ) ); ?>', {
						method: 'POST',
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body: new URLSearchParams( {
							action: 'pp_dismiss_guided_tour_prompt',
							tour_id: '<?php echo esc_js( $tour_id ); ?>',
							nonce: '<?php echo esc_js( wp_create_nonce( 'pp_dismiss_guided_tour_prompt' ) ); ?>'
						} )
					} );
				} );
			}
		} )();
		</script>
		<?php
	}
}
