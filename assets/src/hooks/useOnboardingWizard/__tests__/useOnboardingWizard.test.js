/**
 * Tests for useOnboardingWizard Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useOnboardingWizard } from '../index';

describe( 'useOnboardingWizard', () => {
	const mockSteps = [
		{ id: 'welcome', title: 'Welcome' },
		{ id: 'privacy', title: 'Privacy' },
		{ id: 'tasks', title: 'Tasks' },
		{ id: 'finish', title: 'Finish' },
	];

	const mockSaveProgress = jest.fn().mockResolvedValue( {} );

	const defaultConfig = {
		steps: mockSteps,
		savedProgress: null,
	};

	const defaultProgressHooks = {
		saveProgress: mockSaveProgress,
	};

	beforeEach( () => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( 'initial state', () => {
		it( 'initializes with default state when no saved progress', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.currentStep ).toBe( 0 );
			expect( result.current.wizardState.data ).toEqual( {
				privacyAccepted: false,
				firstTaskCompleted: false,
				moreTasksCompleted: {},
				finished: false,
				emailFrequency: {
					choice: null,
					name: '',
					email: '',
				},
				settings: {},
			} );
		} );

		it( 'initializes from saved progress', () => {
			const savedProgress = {
				currentStep: 2,
				data: {
					privacyAccepted: true,
					firstTaskCompleted: true,
					moreTasksCompleted: { task1: true },
					finished: false,
					emailFrequency: {
						choice: 'weekly',
						name: 'Test',
						email: 'test@example.com',
					},
					settings: { theme: 'dark' },
				},
			};

			const { result } = renderHook( () =>
				useOnboardingWizard(
					{ ...defaultConfig, savedProgress },
					defaultProgressHooks
				)
			);

			expect( result.current.currentStep ).toBe( 2 );
			expect( result.current.wizardState.data.privacyAccepted ).toBe(
				true
			);
			expect( result.current.wizardState.data.firstTaskCompleted ).toBe(
				true
			);
		} );

		it( 'uses default data when saved progress has no data', () => {
			const savedProgress = {
				currentStep: 1,
			};

			const { result } = renderHook( () =>
				useOnboardingWizard(
					{ ...defaultConfig, savedProgress },
					defaultProgressHooks
				)
			);

			expect( result.current.currentStep ).toBe( 1 );
			expect( result.current.wizardState.data.privacyAccepted ).toBe(
				false
			);
		} );

		it( 'returns totalSteps from config', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.totalSteps ).toBe( 4 );
		} );

		it( 'returns currentStepData for current step', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.currentStepData ).toEqual( {
				id: 'welcome',
				title: 'Welcome',
			} );
		} );
	} );

	describe( 'navigation', () => {
		it( 'nextStep advances to next step', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.currentStep ).toBe( 0 );

			act( () => {
				result.current.nextStep();
			} );

			expect( result.current.currentStep ).toBe( 1 );
		} );

		it( 'nextStep does not exceed last step', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			// Navigate to last step
			act( () => {
				result.current.goToStep( 3 );
			} );

			expect( result.current.currentStep ).toBe( 3 );

			// Try to go beyond
			act( () => {
				result.current.nextStep();
			} );

			expect( result.current.currentStep ).toBe( 3 );
		} );

		it( 'prevStep goes to previous step', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.goToStep( 2 );
			} );

			act( () => {
				result.current.prevStep();
			} );

			expect( result.current.currentStep ).toBe( 1 );
		} );

		it( 'prevStep does not go below 0', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.currentStep ).toBe( 0 );

			act( () => {
				result.current.prevStep();
			} );

			expect( result.current.currentStep ).toBe( 0 );
		} );

		it( 'goToStep navigates to specific step', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.goToStep( 2 );
			} );

			expect( result.current.currentStep ).toBe( 2 );
		} );

		it( 'goToStep clamps to valid range', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.goToStep( 100 );
			} );

			expect( result.current.currentStep ).toBe( 3 ); // Last step

			act( () => {
				result.current.goToStep( -5 );
			} );

			expect( result.current.currentStep ).toBe( 0 ); // First step
		} );

		it( 'currentStepData updates after navigation', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			expect( result.current.currentStepData.id ).toBe( 'welcome' );

			act( () => {
				result.current.nextStep();
			} );

			expect( result.current.currentStepData.id ).toBe( 'privacy' );
		} );
	} );

	describe( 'updateState', () => {
		it( 'updates wizard state data', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.updateState( {
					data: { privacyAccepted: true },
				} );
			} );

			expect( result.current.wizardState.data.privacyAccepted ).toBe(
				true
			);
		} );

		it( 'preserves existing data when updating', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.updateState( {
					data: { privacyAccepted: true },
				} );
			} );

			act( () => {
				result.current.updateState( {
					data: { firstTaskCompleted: true },
				} );
			} );

			expect( result.current.wizardState.data.privacyAccepted ).toBe(
				true
			);
			expect( result.current.wizardState.data.firstTaskCompleted ).toBe(
				true
			);
		} );

		it( 'can update currentStep directly', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.updateState( { currentStep: 2 } );
			} );

			expect( result.current.currentStep ).toBe( 2 );
		} );
	} );

	describe( 'auto-save progress', () => {
		it( 'saves progress after state changes with debounce', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.nextStep();
			} );

			// Should not have saved yet (debounced)
			expect( mockSaveProgress ).not.toHaveBeenCalled();

			// Advance timer past debounce
			act( () => {
				jest.advanceTimersByTime( 600 );
			} );

			expect( mockSaveProgress ).toHaveBeenCalledWith(
				expect.objectContaining( {
					currentStep: 1,
				} )
			);
		} );

		it( 'debounces multiple rapid changes', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			act( () => {
				result.current.nextStep();
			} );

			act( () => {
				jest.advanceTimersByTime( 200 );
			} );

			act( () => {
				result.current.nextStep();
			} );

			act( () => {
				jest.advanceTimersByTime( 200 );
			} );

			act( () => {
				result.current.nextStep();
			} );

			// Not saved yet
			expect( mockSaveProgress ).not.toHaveBeenCalled();

			// Advance past debounce
			act( () => {
				jest.advanceTimersByTime( 600 );
			} );

			// Should only save once with final state
			expect( mockSaveProgress ).toHaveBeenCalledTimes( 1 );
			expect( mockSaveProgress ).toHaveBeenCalledWith(
				expect.objectContaining( {
					currentStep: 3,
				} )
			);
		} );

		it( 'silently handles save errors', () => {
			const failingSaveProgress = jest
				.fn()
				.mockRejectedValue( new Error( 'Save failed' ) );

			const { result } = renderHook( () =>
				useOnboardingWizard( defaultConfig, {
					saveProgress: failingSaveProgress,
				} )
			);

			act( () => {
				result.current.nextStep();
			} );

			// Should not throw
			expect( () => {
				act( () => {
					jest.advanceTimersByTime( 600 );
				} );
			} ).not.toThrow();
		} );
	} );

	describe( 'edge cases', () => {
		it( 'handles empty steps array', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard(
					{ steps: [], savedProgress: null },
					defaultProgressHooks
				)
			);

			expect( result.current.totalSteps ).toBe( 0 );
			expect( result.current.currentStepData ).toBeNull();
		} );

		it( 'handles undefined config values', () => {
			const { result } = renderHook( () =>
				useOnboardingWizard( {}, defaultProgressHooks )
			);

			expect( result.current.totalSteps ).toBe( 0 );
			expect( result.current.currentStep ).toBe( 0 );
		} );

		it( 'returns null currentStepData when step does not exist', () => {
			const savedProgress = { currentStep: 10 }; // Beyond array bounds

			const { result } = renderHook( () =>
				useOnboardingWizard(
					{ ...defaultConfig, savedProgress },
					defaultProgressHooks
				)
			);

			// currentStep will be clamped by goToStep logic during navigation,
			// but initial state from savedProgress is not validated
			expect( result.current.currentStepData ).toBeNull();
		} );
	} );

	describe( 'function stability', () => {
		it( 'returns stable updateState reference', () => {
			const { result, rerender } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			const firstFunc = result.current.updateState;
			rerender();
			const secondFunc = result.current.updateState;

			expect( firstFunc ).toBe( secondFunc );
		} );

		it( 'returns stable prevStep reference', () => {
			const { result, rerender } = renderHook( () =>
				useOnboardingWizard( defaultConfig, defaultProgressHooks )
			);

			const firstFunc = result.current.prevStep;
			rerender();
			const secondFunc = result.current.prevStep;

			expect( firstFunc ).toBe( secondFunc );
		} );
	} );
} );
