<?php
/**
 * Progress_Planner widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Badges;

/**
 * Badge content widget.
 */
final class Badge_Content extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-content';

	/**
	 * Whether we should render the widget or not.
	 *
	 * @return bool
	 */
	protected function should_render() {
		$details = $this->get_badge_details();
		if (
			'awesome-author' === $details['badge']['id']
			&& 100 === (int) $details['progress']['progress']
		) {
			return false;
		}
		return true;
	}

	/**
	 * Render the widget content.
	 *
	 * @return void
	 */
	protected function the_content() {
		$details = $this->get_badge_details();
		?>
		<div class="prpl-badges-columns-wrapper">
			<div class="prpl-badge-wrapper">
				<span
					class="prpl-badge"
					data-value="<?php echo \esc_attr( $details['progress']['progress'] ); ?>"
				>
					<div
						class="prpl-badge-gauge"
						style="
							--value:<?php echo (float) ( $details['progress']['progress'] / 100 ); ?>;
							--max: 360deg;
							--start: 180deg;
						">
						<?php require $details['badge']['icons-svg']['complete']['path']; ?>
					</div>
				</span>
				<span class="progress-percent"><?php echo \esc_attr( $details['progress']['progress'] ); ?>%</span>
			</div>
			<div class="prpl-badge-content-wrapper">
				<h2 class="prpl-widget-title">
					<?php echo \esc_html( $details['badge']['name'] ); ?>
				</h2>
				<p>
					<?php
					printf(
						esc_html(
							/* translators: %s: The remaining number of posts or pages to write. */
							_n(
								'Write %s new post or page and earn your next badge!',
								'Write %s new posts or pages and earn your next badge!',
								(int) $details['progress']['remaining'],
								'progress-planner'
							)
						),
						\esc_html( \number_format_i18n( $details['progress']['remaining'] ) )
					);
					?>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Get the badge.
	 *
	 * @return array
	 */
	public function get_badge_details() {
		static $result = [];
		if ( ! empty( $result ) ) {
			return $result;
		}
		$badges = [ 'wonderful-writer', 'bold-blogger', 'awesome-author' ];

		// Get the badge to display.
		foreach ( $badges as $badge ) {
			$progress = Badges::get_badge_progress( $badge );
			if ( 100 > $progress['progress'] ) {
				break;
			}
		}
		$result['progress'] = $progress;
		$result['badge']    = Badges::get_badge( $badge );

		$result['color'] = 'var(--prpl-color-accent-red)';
		if ( $result['progress']['progress'] > 50 ) {
			$result['color'] = 'var(--prpl-color-accent-orange)';
		}
		if ( $result['progress']['progress'] > 75 ) {
			$result['color'] = 'var(--prpl-color-accent-green)';
		}
		return $result;
	}
}
