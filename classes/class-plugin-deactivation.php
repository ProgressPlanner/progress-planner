<?php
/**
 * Plugin deactivation class.
 *
 * Adds a form to request the reason for deactivation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Plugin deactivation class.
 */
class Plugin_Deactivation {

	/**
	 * The plugin slug.
	 *
	 * This is used to identify and catch the deactivation trigger.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'progress-planner';

	/**
	 * The remote API URL to send the deactivation reason to.
	 *
	 * @var string
	 */
	const REMOTE_URL = 'https://progressplanner.com';

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'admin_footer', [ $this, 'maybe_add_script' ] );
	}

	/**
	 * Maybe add the script to the admin footer.
	 *
	 * @return void
	 */
	public function maybe_add_script() {
		// Check if we're in the plugins page.
		if ( ! \function_exists( 'get_current_screen' ) || ! \get_current_screen() || 'plugins' !== \get_current_screen()->id ) {
			return;
		}
		$this->the_popover();
		$this->the_inline_script();
		$this->the_inline_style();
	}

	/**
	 * The popover.
	 *
	 * @return void
	 */
	protected function the_popover() {
		$reasons = [
			[
				'id'                   => 'unexpected-behavior',
				'label'                => \__( 'The plugin did not work as expected', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What did you expect?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'wrong-feature',
				'label'                => \__( "It's not what I was looking for", 'progress-planner' ),
				'feedback_placeholder' => \__( 'What were you looking for?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'not-working',
				'label'                => \__( 'The plugin is not working', 'progress-planner' ),
				'feedback_placeholder' => \__( 'Kindly share what didn\'t work so we can fix it for future users...', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'found-better-plugin',
				'label'                => \__( 'I found a better plugin', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What\'s the plugin\'s name?', 'progress-planner' ),
				'feedback_type'        => 'text',
			],
			[
				'id'                   => 'missing-feature',
				'label'                => \__( 'The plugin is great, but I need specific feature that you don\'t support', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What feature?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'hard-to-understand',
				'label'                => \__( 'I couldn\'t understand how to make it work', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What did you not understand?', 'progress-planner' ),
				'feedback_type'        => 'text',
			],
			[
				'id'                   => 'temporary-deactivation',
				'label'                => \__( 'It\'s a temporary deactivation - I\'m troubleshooting an issue', 'progress-planner' ),
				'feedback_type'        => false,
				'feedback_placeholder' => false,
			],
		];

		// Randomize the order of the reasons.
		\shuffle( $reasons );

		// Add the "other" reason at the end.
		$reasons[] = [
			'id'                   => 'other',
			'label'                => \__( 'Other', 'progress-planner' ),
			'feedback_placeholder' => false,
			'feedback_type'        => false,
		];

		?>
		<div id="<?php echo \esc_attr( self::PLUGIN_SLUG ); ?>-popover" popover>
			<h1><?php \esc_html_e( "We're sorry to see you go", 'progress-planner' ); ?></h1>
			<p><?php \esc_html_e( 'If you have a moment, please let us know why you are deactivating this plugin:', 'progress-planner' ); ?></p>
			<form>
				<?php foreach ( $reasons as $reason ) : ?>
					<div class="reason-wrapper" data-reason="<?php echo \esc_attr( $reason['id'] ); ?>">
						<span class="radio-wrapper">
							<input
								id="deactivate-plugin-reason-<?php echo \esc_attr( $reason['id'] ); ?>"
								type="radio"
								name="reason"
								value="<?php echo \esc_attr( $reason['id'] ); ?>"
							>
							<label for="deactivate-plugin-reason-<?php echo \esc_attr( $reason['id'] ); ?>">
								<?php echo \esc_html( $reason['label'] ); ?>
							</label>
						</span>
						<?php if ( $reason['feedback_type'] ) : ?>
							<div class="feedback-wrapper">
								<?php if ( 'textarea' === $reason['feedback_type'] ) : ?>
									<textarea
										id="deactivate-plugin-reason-<?php echo \esc_attr( $reason['id'] ); ?>-feedback"
										name="feedback"
										placeholder="<?php echo \esc_attr( $reason['feedback_placeholder'] ); ?>"
									></textarea>
								<?php else : ?>
									<input
										id="deactivate-plugin-reason-<?php echo \esc_attr( $reason['id'] ); ?>-feedback"
										type="text"
										name="feedback"
										placeholder="<?php echo \esc_attr( $reason['feedback_placeholder'] ); ?>"
									>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>

				<div class="actions">
					<button type="button" class="submit"><?php \esc_html_e( 'Submit & Deactivate', 'progress-planner' ); ?></button>
					<button type="button" class="dismiss"><?php \esc_html_e( 'Skip & Deactivate', 'progress-planner' ); ?></button>
				</div>
			</form>
		</div>
		<?php
	}

	/**
	 * The inline script.
	 *
	 * @return void
	 */
	protected function the_inline_script() {
		?>
		<script>
			// A helper function to make AJAX requests.
			const deactivatePluginFeedbackAjaxRequest = ( { url, data, action } ) => {
				const http = new XMLHttpRequest();
				http.open( 'POST', url, true );
				http.onreadystatechange = () => {
					let response;
					try {
						response = JSON.parse( http.response );
					} catch ( e ) {}
					return action( response );
				};
				const dataForm = new FormData();
				for ( let [ key, value ] of Object.entries( data ) ) {
					dataForm.append( key, value );
				}
				http.send( dataForm );
			}

			// Add an event listener to the deactivate button.
			const deactivateButton = document.getElementById( 'deactivate-<?php echo \esc_attr( self::PLUGIN_SLUG ); ?>' );
			const deactivationPopover = document.getElementById( '<?php echo \esc_attr( self::PLUGIN_SLUG ); ?>-popover' );
			if ( deactivateButton && deactivationPopover ) {
				deactivateButton.addEventListener( 'click', function( e ) {
					e.preventDefault();
					deactivationPopover.showPopover();
				} );

				// Show/hide the feedback fields based on the selected reason.
				deactivationPopover.querySelectorAll( '.reason-wrapper' ).forEach( function( reasonWrapper ) {
					reasonWrapper.addEventListener( 'click', function( changeEvent ) {
						const feedbackWrapper = reasonWrapper.querySelector( '.feedback-wrapper' );
						// Hide any existing feedback fields.
						deactivationPopover.querySelectorAll( '.feedback-wrapper' ).forEach( function( feedbackWrapper ) {
							feedbackWrapper.style.display = 'none';
						} );
						if ( feedbackWrapper ) {
							reasonWrapper.querySelector( '.feedback-wrapper' ).style.display = 'block';
						}
					} );
				} );

				// Handle clicking on the dismiss button.
				deactivationPopover.querySelector( 'button.dismiss' ).addEventListener( 'click', function( dismissEvent ) {
					dismissEvent.preventDefault();
					window.location.href = deactivateButton.href;
				} );

				// Handle clicking on the submit button.
				deactivationPopover.querySelector( 'button.submit' ).addEventListener( 'click', function( submitEvent ) {
					submitEvent.preventDefault();
					const requestData = {
						action: 'plugin_deactivation',
						plugin: '<?php echo \esc_attr( self::PLUGIN_SLUG ); ?>',
						site: '<?php echo \esc_attr( get_site_url() ); ?>',
					};
					console.log( requestData );
					deactivatePluginFeedbackAjaxRequest( {
						// Get a nonce from the remote server.
						url: '<?php echo \esc_url( self::REMOTE_URL ); ?>/?rest_route=/deactivation-feedback-server/v1/get-nonce',
						data: requestData,
						action: ( response ) => {
							// Add the nonce to the request data, and build the data object for the feedback.
							requestData.nonce = response.nonce;
							const formData = new FormData( deactivationPopover.querySelector( 'form' ) );
							requestData.reason = formData.get( 'reason' );
							requestData.feedback = document.getElementById( `deactivate-plugin-reason-${requestData.reason}-feedback` ).value;

							console.log( requestData );
							// Make the request to the remote server to submit the feedback.
							deactivatePluginFeedbackAjaxRequest( {
								url: '<?php echo \esc_url( self::REMOTE_URL ); ?>/?rest_route=/deactivation-feedback-server/v1/submit-feedback',
								data: requestData,
								action: ( response ) => {
									window.location.href = deactivateButton.href;
								},
							} );
						},
					} );

					// Submit the form.
					deactivationPopover.hidePopover();
				} );
			}
		</script>
		<?php
	}

	/**
	 * The inline style.
	 *
	 * @return void
	 */
	protected function the_inline_style() {
		?>
		<style>
			#<?php echo \esc_attr( self::PLUGIN_SLUG ); ?>-popover {
				border: 1px solid #ccc;
				padding: 2rem;
				border-radius: 8px;

				form {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					.reason-wrapper {
						display: flex;
						gap: 1rem;
						flex-direction: column;

						.feedback-wrapper {
							display: none;

							textarea, input {
								width: 100%;
								border: 1px solid #ccc;
								border-radius: 4px;
								padding: 0.5rem;
							}
						}
					}

					.actions {
						display: flex;
						gap: 1rem;
					}

					button {
						padding: 0.5rem 1rem;
						border-radius: 4px;
						border: 1px solid #ccc;
						background-color: green;
						cursor: pointer;
						color: #fff;
						margin: 0;

						&.dismiss {
							background-color: #fff;
							cursor: pointer;
							color: #000;
						}
					}
				}
			}
		</style>
		<?php
	}
}
