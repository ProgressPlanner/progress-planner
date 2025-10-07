<?php
/**
 * Onboarding task, set site locale.
 *
 * @package Progress_Planner
 *
 * @var array $task
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! \function_exists( 'request_filesystem_credentials' ) ) {
	require_once ABSPATH . 'wp-admin/includes/file.php'; // @phpstan-ignore requireOnce.fileNotFound
}

if ( ! \function_exists( 'wp_get_available_translations' ) ) {
	require_once ABSPATH . 'wp-admin/includes/translation-install.php'; // @phpstan-ignore requireOnce.fileNotFound
}

$prpl_languages    = \get_available_languages();
$prpl_translations = \wp_get_available_translations();
$prpl_locale       = \get_locale();
if ( ! \in_array( $prpl_locale, $prpl_languages, true ) ) {
	$prpl_locale = '';
}
?>

<div class="prpl-onboarding-task">
	<div class="tour-content">
		<div>
			<h3 class="prpl-onboarding-task-title">
				<?php echo esc_html( $task['title'] ); ?>
			</h3>
			<p>
				Lorem ipsum dolor sit amet consectetur adipiscing elit, eget interdum nostra tortor vestibulum ultrices, quisque congue nibh ullamcorper sapien natoque.
			</p>

			<p>
				Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
			</p>
		</div>
		<form class="prpl-onboarding-task-form" onsubmit="return false;">
			<?php
				ob_start();
				\wp_dropdown_languages(
					[
						'name'                        => 'language',
						'id'                          => 'language',
						'selected'                    => $prpl_locale,
						'languages'                   => $prpl_languages,
						'translations'                => $prpl_translations,
						'show_available_translations' => \current_user_can( 'install_languages' ) && \wp_can_install_language_pack(),
						'echo'                        => false,
					]
				);
				$prpl_dropdown_html = ob_get_clean();

				// Add data-validate attribute to the select element.
				$prpl_dropdown_html = str_replace(
					'<select',
					'<select data-validate="required"',
					$prpl_dropdown_html
				);

				echo $prpl_dropdown_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			<button type="button" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary">
				<?php \esc_html_e( 'Set the locale', 'progress-planner' ); ?>
			</button>
		</form>
	</div>
</div>
