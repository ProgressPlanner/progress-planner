<span class="tooltip-action">
	<prpl-tooltip>
		<slot name="open">
			<button type="button" class="prpl-suggested-task-button" data-task-id="<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" data-task-title="<?php echo \esc_attr( $prpl_data['title']['rendered'] ); ?>" data-action="info" data-target="info" title="<?php \esc_html_e( 'Info', 'progress-planner' ); ?>">
				<span class="prpl-tooltip-action-text"><?php \esc_html_e( 'Info', 'progress-planner' ); ?></span>
				<span class="screen-reader-text"><?php \esc_html_e( 'Info', 'progress-planner' ); ?></span>
			</button>
		</slot>
		<slot name="content"><?php echo \wp_kses_post( $prpl_data['content']['rendered'] ); ?></slot>
	</prpl-tooltip>
</span>
