<?php
/**
 * Dashboard widget for the to-do list.
 *
 * @package Progress_Planner
 */

?>
<div id="prpl-dashboard-widget-todo-header">
	<span style="display:inline-flex;width:2.5em;height:2.5em;"><?php echo \progress_planner()->get_ui__branding()->get_admin_menu_icon( true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG markup. ?></span>
	<p><?php \esc_html_e( 'Keep track of all your tasks and make sure your site is up-to-date!', 'progress-planner' ); ?></p>
</div>
<?php

\progress_planner()->get_admin__widgets__todo()->the_todo_list();
