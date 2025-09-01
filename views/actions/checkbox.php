<label>
	<input type="checkbox" class="prpl-suggested-task-checkbox" onchange="prplSuggestedTask.maybeComplete( <?php echo (int) $prpl_data['id']; ?> );" style="margin: 0; pointer-events: none;"<?php echo ( 'trash' === $prpl_data['status'] || 'pending' === $prpl_data['status'] ) ? ' checked' : ''; ?>>
	<span class="screen-reader-text"><?php echo \esc_html( $prpl_data['title']['rendered'] ); ?>: <?php \esc_html_e( 'Mark as completed', 'progress-planner' ); ?></span>
</label>
