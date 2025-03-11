<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<h2 class="prpl-widget-title">
	<span class="icon">
		<svg baseProfile="tiny" version="1.2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M32.1,47.9H7c-3.8,0-6.9-3.1-6.9-6.9V15.9c0-3.8,3.1-6.9,6.9-6.9h11.3c.8,0,1.5.7,1.5,1.5s-.7,1.5-1.5,1.5H7c-2.1,0-3.9,1.7-3.9,3.9v25.1c0,2.1,1.7,3.9,3.9,3.9h25.1c2.1,0,3.9-1.7,3.9-3.9v-11.3c0-.8.7-1.5,1.5-1.5s1.5.7,1.5,1.5v11.3c0,3.8-3.1,6.9-6.9,6.9ZM8.8,40.7c-.4,0-.8-.2-1.1-.4s-.5-1-.4-1.5l1.9-6.4c.6-1.9,1.6-3.7,3.1-5.2L37.7,1.9c1.1-1.1,2.6-1.7,4.2-1.7s3.1.6,4.2,1.7c1.1,1.1,1.7,2.6,1.7,4.2s-.6,3.1-1.7,4.2l-25.3,25.3c-1.4,1.4-3.2,2.5-5.2,3.1l-6.4,1.9c-.1,0-.3,0-.4,0ZM34.7,9.1L14.4,29.3c-1.1,1.1-1.9,2.4-2.3,3.9l-1.1,3.8,3.8-1.1c1.5-.4,2.8-1.2,3.9-2.3l20.3-20.3-4.2-4.2ZM36.8,7l4.2,4.2,3-3c.6-.6.9-1.3.9-2.1s-.3-1.5-.9-2.1c-1.1-1.1-3.1-1.1-4.2,0l-3,3Z" fill="#f43f5e"/><text transform="translate(3.2 -14.2)" font-family="MyriadPro-Regular, 'Myriad Pro'" font-size="12"><tspan x="0" y="0">44,75px / lijn 3px</tspan></text></svg>
	</span>
	<span><?php \esc_html_e( 'My to-do list', 'progress-planner' ); ?></span>
</h2>

<p><?php \esc_html_e( 'Write down all your website maintenance tasks you want to get done!', 'progress-planner' ); ?></p>
<?php \progress_planner()->get_widgets__todo()->the_todo_list(); ?>
