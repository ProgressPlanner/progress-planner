<?php
/**
 * Standalone, print-optimized certificate page for the sunset notice.
 *
 * Rendered via admin-post.php, outside the WP admin chrome.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_sunset_notice    = \progress_planner()->get_admin__sunset_notice();
$prpl_completed_badges = $prpl_sunset_notice->get_completed_badges();
$prpl_activation_date  = \progress_planner()->get_activation_date();
$prpl_badge_svg_url    = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=';

// Scale the badges to the available space, so the certificate always fits on a single A4 page.
$prpl_badge_count = \count( $prpl_completed_badges );
if ( $prpl_badge_count <= 8 ) {
	$prpl_badge_size = 24; // mm.
} elseif ( $prpl_badge_count <= 18 ) {
	$prpl_badge_size = 18;
} elseif ( $prpl_badge_count <= 32 ) {
	$prpl_badge_size = 14;
} else {
	$prpl_badge_size = 10;
}

?>
<!DOCTYPE html>
<html <?php \language_attributes(); ?>>
<head>
	<meta charset="<?php \bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php \esc_html_e( 'Progress Planner certificate', 'progress-planner' ); ?></title>
	<style>
		@page {
			size: A4 landscape;
			margin: 0;
		}

		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 2rem;
			background: #f0f0f1;
			font-family: -apple-system, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
			color: #38296d;
		}

		.prpl-certificate {
			width: 296mm;
			height: 209mm;
			margin: 0 auto;
			background: #fff;
			border: 4px solid #38296d;
			outline: 2px solid #f9a310;
			outline-offset: -12px;
			padding: 12mm 18mm;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;
		}

		.prpl-certificate-logo svg,
		.prpl-certificate-logo img {
			max-width: 60mm;
			max-height: 20mm;
			height: auto;
		}

		.prpl-certificate h1 {
			font-size: 9mm;
			margin: 4mm 0 2mm;
		}

		.prpl-certificate .prpl-certificate-site {
			font-size: 6mm;
			margin: 2mm 0;
		}

		.prpl-certificate .prpl-certificate-site a {
			color: #38296d;
			text-decoration: none;
		}

		.prpl-certificate .prpl-certificate-since {
			font-size: 4.5mm;
			color: #50575e;
			margin: 2mm 0 6mm;
		}

		.prpl-certificate-badges {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-content: center;
			gap: 3mm 4mm;
			margin: 0 0 6mm;
			min-height: 0;
		}

		.prpl-certificate-badge {
			width: <?php echo (float) ( $prpl_badge_size * 1.2 ); ?>mm;
		}

		.prpl-certificate-badge img {
			width: <?php echo (float) $prpl_badge_size; ?>mm;
			height: auto;
		}

		.prpl-certificate-badge span {
			display: block;
			font-size: 2.8mm;
			margin-top: 1mm;
		}

		.prpl-certificate-footer {
			font-size: 3.5mm;
			color: #50575e;
			margin: 0;
		}

		.prpl-certificate-print {
			display: block;
			margin: 2rem auto;
			padding: 0.75rem 2rem;
			font-size: 1rem;
			color: #fff;
			background: #dd324f;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		}

		@media print {
			body {
				background: #fff;
				padding: 0;
			}

			.prpl-certificate {
				margin: 0;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
				page-break-inside: avoid;
			}

			.prpl-certificate-print {
				display: none;
			}
		}
	</style>
</head>
<body>
	<div class="prpl-certificate">
		<div class="prpl-certificate-logo">
			<?php \progress_planner()->the_asset( 'images/logo_progress_planner.svg' ); ?>
		</div>

		<h1><?php \esc_html_e( 'Certificate of appreciation', 'progress-planner' ); ?></h1>

		<p class="prpl-certificate-site">
			<?php
			\printf(
				/* translators: %1$s: site name, %2$s: site URL (linked). */
				\esc_html__( 'Proudly presented to %1$s (%2$s)', 'progress-planner' ),
				'<strong>' . \esc_html( \get_bloginfo( 'name' ) ) . '</strong>',
				'<a href="' . \esc_url( \home_url() ) . '">' . \esc_html( \home_url() ) . '</a>'
			);
			?>
		</p>

		<p class="prpl-certificate-since">
			<?php
			\printf(
				/* translators: %s: the date the plugin was activated. */
				\esc_html__( 'For working on this website with Progress Planner since %s.', 'progress-planner' ),
				\esc_html( \date_i18n( (string) \get_option( 'date_format' ), (int) $prpl_activation_date->format( 'U' ) ) )
			);
			?>
		</p>

		<?php if ( ! empty( $prpl_completed_badges ) ) : ?>
			<div class="prpl-certificate-badges">
				<?php foreach ( $prpl_completed_badges as $prpl_badge ) : ?>
					<div class="prpl-certificate-badge">
						<img
							src="<?php echo \esc_url( $prpl_badge_svg_url . $prpl_badge->get_id() ); ?>"
							alt="<?php echo \esc_attr( $prpl_badge->get_name() ); ?>"
							onerror="this.onerror=null;this.src='<?php echo \esc_url( \progress_planner()->get_placeholder_svg( 90, 90 ) ); ?>';"
						>
						<span><?php echo \esc_html( $prpl_badge->get_name() ); ?></span>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<p class="prpl-certificate-footer">
			<?php \esc_html_e( 'Thank you for improving your website with us. — The Progress Planner team', 'progress-planner' ); ?>
		</p>
	</div>

	<button class="prpl-certificate-print" onclick="window.print();">
		<?php \esc_html_e( 'Save as PDF', 'progress-planner' ); ?>
	</button>
</body>
</html>
