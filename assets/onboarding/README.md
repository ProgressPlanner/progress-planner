# Onboarding Wizard

This directory contains the onboarding wizard implementation for Progress Planner.

## Architecture

The onboarding wizard uses a component-based architecture where each step is a separate JavaScript class that extends the base `OnboardingStep` class.

### Directory Structure

```
assets/onboarding/
├── css/
│   └── onboarding.css          # Main styles for the onboarding wizard
├── fonts/                       # Custom fonts (Gilroy)
├── images/                      # Images used in onboarding
├── js/
│   ├── onboarding.js           # Main wizard controller
│   └── steps/                  # Step components
│       ├── OnboardingStep.js   # Base class for all steps
│       ├── WelcomeStep.js      # Welcome step component
│       ├── FirstTaskStep.js    # First task step component
│       ├── BadgesStep.js       # Badges explanation step component
│       └── MoreTasksStep.js    # More tasks step component
└── README.md                    # This file
```

## Components

### Base Component: OnboardingStep

The `OnboardingStep` class is the base class that all step components extend. It provides:

- **Template rendering**: Loads HTML content from template elements
- **Lifecycle hooks**: `onMount()` and `onUnmount()` for setup and cleanup
- **Validation**: `canProceed()` to control step progression
- **State management**: Access to wizard state through Proxy API
- **Utility methods**: Helper methods for common operations

#### Key Methods

- `render()`: Returns the step's HTML content from a template
- `onMount(state)`: Called when step is mounted to DOM, returns cleanup function
- `canProceed(state)`: Returns true if user can proceed to next step
- `getNextButtonText()`: Returns custom text for the "Next" button
- `onUnmount()`: Called when step is about to be unmounted
- `updateState(key, value)`: Updates wizard state
- `nextStep()`: Advances to the next step

### Step Components

#### WelcomeStep
- **Purpose**: Displays welcome message and Progress Planner logo
- **Validation**: Always allows proceeding
- **Template ID**: `tour-step-welcome`

#### FirstTaskStep
- **Purpose**: User completes their first task
- **Validation**: Requires task completion before proceeding
- **Features**:
  - Handles form submission
  - Automatically advances to next step when task is completed
  - Updates state with completion status
- **Template ID**: `tour-step-first-task`

#### BadgesStep
- **Purpose**: Explains the badge system to users
- **Validation**: Always allows proceeding
- **Template ID**: `tour-step-badges`

#### MoreTasksStep
- **Purpose**: User completes additional onboarding tasks
- **Validation**: Requires all tasks to be completed before proceeding
- **Features**:
  - Tracks multiple tasks
  - Integrates with `PopoverTask` for sub-popovers
  - Listens for `taskCompleted` events
- **Template ID**: `tour-step-more-tasks`

## Main Wizard Controller

The `ProgressPlannerOnboardWizard` class manages the overall onboarding flow:

- **Step navigation**: Controls moving between steps
- **State management**: Uses JavaScript Proxy API for reactive state updates
- **Popover control**: Handles opening/closing the popover
- **Progress persistence**: Saves progress to server
- **Event handling**: Manages user interactions

### State Management

The wizard uses the JavaScript Proxy API to create a reactive state system similar to Alpine.js:

```javascript
this.state = {
  currentStep: 0,
  data: {
    moreTasksCompleted: {},
    firstTaskCompleted: false,
    finished: false,
  },
  cleanup: null,
};
```

State changes automatically trigger DOM updates through the `updateDOM()` method.

## Creating a New Step

To add a new step to the onboarding flow:

1. **Create the step component** in `assets/onboarding/js/steps/`:

```javascript
class MyNewStep extends OnboardingStep {
  constructor() {
    super({
      id: 'my-new-step',
      templateId: 'tour-step-my-new-step',
    });
  }

  onMount(state) {
    // Setup event listeners, initialize step logic
    const handler = () => {
      // Handle user interaction
    };

    this.popover.addEventListener('click', handler);

    // Return cleanup function
    return () => {
      this.popover.removeEventListener('click', handler);
    };
  }

  canProceed(state) {
    // Return true if user can proceed to next step
    return state.data.myStepCompleted;
  }

  getNextButtonText() {
    return 'Continue'; // Optional: customize button text
  }
}
```

2. **Add the step to the wizard** in `onboarding.js`:

```javascript
initializeTourSteps() {
  const steps = [
    new WelcomeStep(),
    new FirstTaskStep(),
    new BadgesStep(),
    new MyNewStep(),        // Add your new step
    new MoreTasksStep(),
  ];

  steps.forEach((step) => step.setWizard(this));
  return steps;
}
```

3. **Enqueue the step script** in `class-onboard-wizard.php`:

```php
\wp_enqueue_script(
  'prpl-onboarding-my-new-step',
  \constant('PROGRESS_PLANNER_URL') . '/assets/onboarding/js/steps/MyNewStep.js',
  ['prpl-onboarding-step'],
  \progress_planner()->get_plugin_version(),
  true
);
```

4. **Create the template** in the appropriate PHP view file:

```html
<template id="tour-step-my-new-step">
  <div class="prpl-columns-wrapper-flex">
    <!-- Step content here -->
  </div>
</template>
```

## Events

The onboarding system uses custom events for communication:

### taskCompleted
Fired when a task is completed (used in MoreTasksStep).

```javascript
const event = new CustomEvent('taskCompleted', {
  bubbles: true,
  detail: { id: taskId, formValues: formData }
});
element.dispatchEvent(event);
```

### prplFileUploaded
Fired when a file is successfully uploaded (used in PopoverTask).

```javascript
const event = new CustomEvent('prplFileUploaded', {
  detail: { file, filePost, fileInput },
  bubbles: true,
});
element.dispatchEvent(event);
```

## PopoverTask

The `PopoverTask` class handles individual tasks that open sub-popovers:

- Opens a modal popover for task-specific forms
- Handles form validation
- Manages file uploads
- Notifies parent wizard when task is completed

## Localization (l10n)

The onboarding wizard supports translatable text. The PHP side passes translated strings to JavaScript via `wp_localize_script`:

```php
'l10n' => [
  'next' => \esc_html__( 'Next', 'progress-planner' ),
],
```

### Custom Button Text per Step

Steps can override the default "Next" button text by implementing `getNextButtonText()`:

```javascript
getNextButtonText() {
  return 'Custom Button Text'; // This text should also be translatable
}
```

If a step returns `null` from `getNextButtonText()`, the wizard will use the default translated "Next" text.

## Best Practices

1. **Cleanup**: Always return a cleanup function from `onMount()` to prevent memory leaks
2. **State updates**: Use `this.updateState()` to ensure reactive updates
3. **Validation**: Implement `canProceed()` for steps that require user action
4. **Events**: Use custom events for communication between components
5. **Template IDs**: Use unique, descriptive template IDs for each step
6. **Dependencies**: Ensure step scripts are properly enqueued with dependencies
7. **Translations**: For custom button text, ensure strings are translatable (pass via PHP)

## Future Enhancements

Potential improvements to the onboarding system:

- Add step progress indicators
- Implement step skip functionality
- Add analytics tracking for step completion
- Support for conditional step display
- Multi-language support for step content
- Animation transitions between steps
