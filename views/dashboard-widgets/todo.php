<?php
/**
 * Dashboard widget for the to-do list.
 *
 * @package Progress_Planner
 */

?>
<div id="prpl-dashboard-widget-todo-header">
	<img src="<?php echo \esc_attr( PROGRESS_PLANNER_URL . '/assets/images/icon_progress_planner.svg' ); ?>" style="width:2.5em;" alt="" />
	<p><?php \esc_html_e( 'Keep track of all your tasks and make sure your site is up-to-date!', 'progress-planner' ); ?></p>
</div>
<?php

\progress_planner()->get_widgets__todo()->the_todo_list();
