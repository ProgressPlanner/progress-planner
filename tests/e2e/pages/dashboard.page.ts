import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Selectors for the Progress Planner dashboard.
 * Centralized here for easy maintenance.
 */
const SELECTORS = {
	// Todo lists
	todoList: 'ul#todo-list',
	todoItem: 'ul#todo-list > li',
	todoCompletedList: 'ul#todo-list-completed',
	todoCompletedItem: 'ul#todo-list-completed > li',
	todoCompletedDetails: 'details#todo-list-completed-details',

	// Todo form
	newTodoInput: '#new-todo-content',

	// Task elements
	taskItemText: 'h3 > span',
	taskCheckbox: '.prpl-suggested-task-checkbox',
	taskCheckboxLabel: 'label',
	taskActionsWrapper: '.prpl-suggested-task-actions-wrapper',
	taskTrashButton: '.trash',
	taskMoveUpButton: '.prpl-suggested-task-button.move-up',
	taskMoveDownButton: '.prpl-suggested-task-button.move-down',
	taskSnoozeButton: 'button[data-action="snooze"]',

	// Suggested tasks
	suggestedTasksList: '#prpl-suggested-tasks-list',
	suggestedTaskCheckbox:
		'#prpl-suggested-tasks-list .prpl-suggested-task-checkbox:not(:disabled)',

	// Widgets
	widgetWrapper: '.prpl-widget-wrapper.prpl-suggested-tasks',
	suggestedTasksListWidget:
		'.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list',

	// Onboarding
	onboardingPopover: '#prpl-popover-onboarding',
	privacyCheckboxLabel: 'label[for="prpl-privacy-checkbox"]',
	tourNextButton: '.prpl-tour-next',
	tourCloseButton: '#prpl-tour-close-btn',

	// Snooze
	snoozeRadioGroup: 'button.prpl-toggle-radio-group',
	snoozeDurationRadio:
		'.prpl-snooze-duration-radio-group input[type="radio"]',

	// Tour (Driver.js based)
	tourStartButton: '#prpl-start-tour-icon-button',
	tourPopover: '.driver-popover',
	tourNextBtn: '.driver-popover-next-btn',
	tourPrevBtn: '.driver-popover-prev-btn',
	tourCloseBtn: '.driver-popover-close-btn',
} as const;

export class DashboardPage extends BasePage {
	// Locators (lazy-initialized for performance)
	readonly todoList: Locator;
	readonly todoCompletedList: Locator;
	readonly newTodoInput: Locator;
	readonly suggestedTasksList: Locator;
	readonly onboardingPopover: Locator;
	readonly tourPopover: Locator;

	constructor( page: Page ) {
		super( page );
		this.todoList = page.locator( SELECTORS.todoList );
		this.todoCompletedList = page.locator( SELECTORS.todoCompletedList );
		this.newTodoInput = page.locator( SELECTORS.newTodoInput );
		this.suggestedTasksList = page.locator( SELECTORS.suggestedTasksList );
		this.onboardingPopover = page.locator( SELECTORS.onboardingPopover );
		this.tourPopover = page.locator( SELECTORS.tourPopover );
	}

	async goto( options?: {
		showAllRecommendations?: boolean;
	} ): Promise< void > {
		const url = options?.showAllRecommendations
			? '/wp-admin/admin.php?page=progress-planner&prpl_show_all_recommendations'
			: '/wp-admin/admin.php?page=progress-planner';

		await this.page.goto( url );
		await this.waitForReady();
	}

	override async waitForReady(): Promise< void > {
		await this.page.waitForLoadState( 'networkidle' );
		// Wait for the main dashboard widget to be visible
		await this.page.locator( SELECTORS.widgetWrapper ).waitFor( {
			state: 'visible',
			timeout: 10000,
		} );
	}

	// ==================
	// Todo CRUD Operations
	// ==================

	async createTodo(
		text: string
	): Promise< { taskId: string; element: Locator } > {
		await this.newTodoInput.fill( text );
		await this.page.keyboard.press( 'Enter' );
		await this.page.waitForTimeout( 500 );

		// Find the newly created task
		const todoItem = this.page.locator( SELECTORS.todoItem ).first();
		await todoItem.waitFor( { state: 'visible' } );

		const taskId = await todoItem.getAttribute( 'data-task-id' );
		if ( ! taskId ) {
			throw new Error( 'Created todo has no task ID' );
		}

		return { taskId, element: todoItem };
	}

	async getTodoItems(): Promise< Locator[] > {
		return await this.page.locator( SELECTORS.todoItem ).all();
	}

	async getTodoByText( text: string ): Promise< Locator > {
		return this.page.locator( SELECTORS.todoItem ).filter( {
			has: this.page.locator( SELECTORS.taskItemText, { hasText: text } ),
		} );
	}

	async getTodoById( taskId: string ): Promise< Locator > {
		return this.page.locator( `li[data-task-id="${ taskId }"]` );
	}

	async getTodoText( item: Locator ): Promise< string > {
		return (
			( await item.locator( SELECTORS.taskItemText ).textContent() ) ?? ''
		);
	}

	async deleteTodo( item: Locator ): Promise< void > {
		await this.scrollToAndWait( item );
		await item.hover();

		const trashButton = item.locator(
			`${ SELECTORS.taskActionsWrapper } ${ SELECTORS.taskTrashButton }`
		);
		await trashButton.waitFor( { state: 'visible' } );
		await trashButton.click();
		await this.page.waitForTimeout( 1500 );
	}

	async completeTodo( item: Locator ): Promise< void > {
		const label = item.locator( SELECTORS.taskCheckboxLabel );
		await label.click();
		await this.page.waitForTimeout( 1000 );
	}

	async moveTodoDown( item: Locator ): Promise< void > {
		await item.hover();
		const moveDownButton = item.locator( SELECTORS.taskMoveDownButton );
		await moveDownButton.waitFor( { state: 'visible' } );
		await moveDownButton.click();
		await this.page.waitForTimeout( 1500 );
	}

	async moveTodoUp( item: Locator ): Promise< void > {
		await item.hover();
		const moveUpButton = item.locator( SELECTORS.taskMoveUpButton );
		await moveUpButton.waitFor( { state: 'visible' } );
		await moveUpButton.click();
		await this.page.waitForTimeout( 1500 );
	}

	// ==================
	// Completed Tasks
	// ==================

	async openCompletedTasks(): Promise< void > {
		const details = this.page.locator( SELECTORS.todoCompletedDetails );

		// Check if details element exists and is visible
		const isVisible = await details.isVisible().catch( () => false );
		if ( ! isVisible ) {
			return;
		}

		// Check if already open
		const isOpen = await details.getAttribute( 'open' );
		if ( isOpen !== null ) {
			return;
		}

		await details.click();
		await this.page
			.locator( SELECTORS.todoCompletedItem )
			.first()
			.waitFor( {
				state: 'visible',
				timeout: 5000,
			} )
			.catch( () => {
				// No completed items, that's fine
			} );
	}

	async getCompletedItems(): Promise< Locator[] > {
		return await this.page.locator( SELECTORS.todoCompletedItem ).all();
	}

	// ==================
	// Suggested Tasks
	// ==================

	async getSuggestedTasksCount(): Promise< number > {
		return await this.page
			.locator( SELECTORS.suggestedTaskCheckbox )
			.count();
	}

	async completeSuggestedTask(): Promise< {
		taskId: string | null;
		previousCount: number;
	} > {
		const initialCount = await this.getSuggestedTasksCount();

		if ( initialCount === 0 ) {
			return { taskId: null, previousCount: 0 };
		}

		const firstCheckbox = this.page
			.locator( SELECTORS.suggestedTaskCheckbox )
			.first();
		const taskItem = firstCheckbox.locator( 'xpath=ancestor::li[1]' );
		const taskId = await taskItem.getAttribute( 'data-task-id' );

		// Click the label (parent of checkbox)
		const label = firstCheckbox.locator( '..' );
		await label.click();

		// Wait for animation
		await this.page.waitForTimeout( 3000 );

		return { taskId, previousCount: initialCount };
	}

	// ==================
	// Task Snooze
	// ==================

	async snoozeTask(
		taskId: string,
		duration: '1-day' | '1-week' | '2-weeks' | '1-month'
	): Promise< void > {
		const taskItem = await this.getTodoById( taskId );
		await taskItem.hover();

		// Click snooze button
		const snoozeButton = taskItem.locator( SELECTORS.taskSnoozeButton );
		await snoozeButton.click();

		// Open radio group
		const radioGroup = taskItem.locator( SELECTORS.snoozeRadioGroup );
		await radioGroup.click();

		// Select duration using page.evaluate like the original test
		await this.page.evaluate(
			( { id, dur } ) => {
				const radio = document.querySelector(
					`li[data-task-id="${ id }"] .prpl-snooze-duration-radio-group input[type="radio"][value="${ dur }"]`
				) as HTMLInputElement;
				const label = radio?.closest( 'label' );
				label?.click();
			},
			{ id: taskId, dur: duration }
		);

		await this.page.waitForLoadState( 'networkidle' );
		await this.page.waitForTimeout( 1000 );
	}

	// ==================
	// Onboarding
	// ==================

	async isOnboardingVisible(): Promise< boolean > {
		return await this.onboardingPopover.isVisible();
	}

	async completeOnboarding(): Promise< void > {
		await expect( this.onboardingPopover ).toBeVisible( {
			timeout: 10000,
		} );

		// Accept privacy policy
		const privacyLabel = this.page.locator(
			SELECTORS.privacyCheckboxLabel
		);
		await privacyLabel.click();

		// Start onboarding
		const startButton = this.onboardingPopover.locator(
			SELECTORS.tourNextButton
		);
		await startButton.click();

		// Wait for step to advance
		await expect( this.onboardingPopover ).toHaveAttribute(
			'data-prpl-step',
			/^[1-9]/,
			{
				timeout: 15000,
			}
		);

		// Close onboarding
		const closeButton = this.page.locator( SELECTORS.tourCloseButton );
		await closeButton.click();

		await expect( this.onboardingPopover ).toBeHidden( { timeout: 5000 } );
	}

	// ==================
	// Tour (Driver.js)
	// ==================

	async startTour(): Promise< void > {
		const tourButton = this.page.locator( SELECTORS.tourStartButton );
		await tourButton.click();

		await expect( this.tourPopover ).toBeVisible( { timeout: 5000 } );
	}

	async isTourVisible(): Promise< boolean > {
		return await this.tourPopover.isVisible();
	}

	async getTourStepsCount(): Promise< number > {
		return await this.page.evaluate( () => {
			const tour = (
				window as unknown as {
					progressPlannerTour?: { steps?: unknown[] };
				}
			 ).progressPlannerTour;
			return tour?.steps?.length ?? 0;
		} );
	}

	async clickTourNext(): Promise< void > {
		const nextButton = this.page.locator( SELECTORS.tourNextBtn );
		await nextButton.click();
	}

	async getTourNextButtonText(): Promise< string > {
		const nextButton = this.page.locator( SELECTORS.tourNextBtn );
		return ( await nextButton.textContent() ) ?? '';
	}

	async completeTour(): Promise< void > {
		// Start the tour if not already visible
		if ( ! ( await this.isTourVisible() ) ) {
			await this.startTour();
		}

		const stepsCount = await this.getTourStepsCount();

		for ( let i = 0; i < stepsCount - 1; i++ ) {
			await expect( this.tourPopover ).toBeVisible();
			await this.clickTourNext();
		}

		// Verify final step has "Finish" button
		const buttonText = await this.getTourNextButtonText();
		if ( buttonText.toLowerCase() !== 'finish' ) {
			throw new Error(
				`Expected "Finish" button, got "${ buttonText }"`
			);
		}

		// Click finish
		await this.clickTourNext();

		// Verify tour is closed
		await expect( this.tourPopover ).not.toBeVisible( { timeout: 5000 } );
	}

	// ==================
	// Cleanup
	// ==================

	async deleteAllTodos(): Promise< void > {
		// Verify page is still accessible
		try {
			await this.page.waitForLoadState( 'domcontentloaded', {
				timeout: 2000,
			} );
		} catch {
			console.warn( '[Cleanup] Page not accessible, skipping cleanup' );
			return;
		}

		// Delete active tasks
		const todoItems = this.page.locator( SELECTORS.todoItem );
		while ( ( await todoItems.count() ) > 0 ) {
			const firstItem = todoItems.first();
			const trash = firstItem.locator(
				`${ SELECTORS.taskActionsWrapper } ${ SELECTORS.taskTrashButton }`
			);

			try {
				await firstItem.scrollIntoViewIfNeeded();
				await firstItem.hover();
				await trash.waitFor( { state: 'visible', timeout: 3000 } );
				await trash.click();
				await this.page.waitForTimeout( 1500 );
			} catch ( err ) {
				console.warn(
					'[Cleanup] Failed to delete active todo item:',
					( err as Error ).message
				);
				break;
			}
		}

		// Delete completed tasks
		const completedDetails = this.page.locator(
			SELECTORS.todoCompletedDetails
		);
		if ( await completedDetails.isVisible().catch( () => false ) ) {
			await completedDetails.click();
			await this.page.waitForTimeout( 500 );

			const completedItems = this.page.locator(
				SELECTORS.todoCompletedItem
			);
			while ( ( await completedItems.count() ) > 0 ) {
				const firstCompleted = completedItems.first();
				const trash = firstCompleted.locator(
					'.prpl-suggested-task-points-wrapper .trash'
				);

				try {
					await firstCompleted.scrollIntoViewIfNeeded();
					await firstCompleted.hover();
					await trash.waitFor( { state: 'visible', timeout: 3000 } );
					await trash.click();
					await this.page.waitForTimeout( 1500 );
				} catch ( err ) {
					console.warn(
						'[Cleanup] Failed to delete completed todo item:',
						( err as Error ).message
					);
					break;
				}
			}
		}
	}
}
