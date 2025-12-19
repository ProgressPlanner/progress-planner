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
	// @phpstan-ignore-next-line requireOnce.fileNotFound
	require_once ABSPATH . 'wp-admin/includes/file.php';
}

if ( ! \function_exists( 'wp_get_available_translations' ) ) {
	// @phpstan-ignore-next-line requireOnce.fileNotFound
	require_once ABSPATH . 'wp-admin/includes/translation-install.php';
}

$prpl_languages    = \get_available_languages();
$prpl_translations = \wp_get_available_translations();
$prpl_locale       = \get_locale();
if ( ! \in_array( $prpl_locale, $prpl_languages, true ) ) {
	$prpl_locale = '';
}
?>

<div class="prpl-onboarding-task">
	<h3 class="prpl-onboarding-task-title">
		<?php echo \esc_html( $task['title'] ); ?>
	</h3>
	<p>
		Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
	</p>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">
		<?php

			/* This is not required field because default locale (selection with empty value) is English US */
			\wp_dropdown_languages(
				[
					'name'                        => 'language',
					'id'                          => 'language',
					'selected'                    => $prpl_locale,
					'languages'                   => $prpl_languages,
					'translations'                => $prpl_translations,
					'show_available_translations' => \current_user_can( 'install_languages' ) && \wp_can_install_language_pack(),
					'echo'                        => true,
				]
			);
			?>
		<button type="button" data-task-id="<?php echo \esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-secondary">
			<?php \esc_html_e( 'Set the locale', 'progress-planner' ); ?>
		</button>
	</form>
</div>
