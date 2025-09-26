/**
 * Color Customizer JavaScript
 *
 * @package
 */

( function () {
	'use strict';

	// Normalize color value to 6-digit hex format
	function normalizeColorValue( colorValue ) {
		if ( ! colorValue ) {
			return null;
		}

		// Handle special cases
		if ( colorValue === 'none' ) {
			return '#000000';
		}

		// If it's already a 6-digit hex, return as is
		if ( colorValue.match( /^#[0-9A-Fa-f]{6}$/ ) ) {
			return colorValue.toUpperCase();
		}

		// Convert 3-digit hex to 6-digit
		if ( colorValue.match( /^#[0-9A-Fa-f]{3}$/ ) ) {
			const hex = colorValue.substring( 1 );
			return (
				'#' +
				hex[ 0 ] +
				hex[ 0 ] +
				hex[ 1 ] +
				hex[ 1 ] +
				hex[ 2 ] +
				hex[ 2 ]
			);
		}

		// If it's not a valid hex color, return null
		return null;
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		// Sync color picker with text input
		const colorPickers = document.querySelectorAll( '.color-picker' );
		const textInputs = document.querySelectorAll( '.color-text-input' );

		colorPickers.forEach( function ( picker, index ) {
			const textInput = textInputs[ index ];

			if ( ! textInput ) {
				return;
			}

			// Update text input when color picker changes
			picker.addEventListener( 'input', function () {
				textInput.value = this.value;
			} );

			// Update color picker when text input changes
			textInput.addEventListener( 'input', function () {
				const normalizedValue = normalizeColorValue( this.value );
				if ( normalizedValue ) {
					picker.value = normalizedValue;
					this.value = normalizedValue;
				}
			} );

			// Validate color format on blur
			textInput.addEventListener( 'blur', function () {
				const normalizedValue = normalizeColorValue( this.value );
				if ( this.value && ! normalizedValue ) {
					this.style.borderColor = '#e73136';
					this.title =
						'Please enter a valid hex color (e.g., #ff0000 or #fff)';
				} else {
					this.style.borderColor = '';
					this.title = '';
					if ( normalizedValue && normalizedValue !== this.value ) {
						this.value = normalizedValue;
						picker.value = normalizedValue;
					}
				}
			} );
		} );
	} );
} )();
