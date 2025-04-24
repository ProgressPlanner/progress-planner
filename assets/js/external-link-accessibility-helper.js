/* global prplDocumentReady */

/**
 * External Link Accessibility Helper script.
 * A script to add accessibility improvements to external links.
 *
 * Dependencies: progress-planner/document-ready
 */

/**
 * External Link Accessibility Helper class.
 */
class ExternalLinkAccessibilityHelper {
	constructor( options = {} ) {
		this.currentDomain = window.location.hostname;
		this.selectors = options.selectors || [ '.prpl-wrap' ];
		this.excludedSelectors = options.excludedSelectors || [];
		this.iconClass = options.iconClass || 'prpl-external-link-icon';
	}

	// Public method to apply accessibility improvements
	applyAccessibility() {
		this.selectors.forEach( ( selector ) => {
			const containers = document.querySelectorAll( selector );
			containers.forEach( ( container ) => {
				const links = container.querySelectorAll( 'a[href]' );
				links.forEach( ( link ) => {
					if ( ! this._isExcluded( link ) ) {
						this._processLink( link );
					}
				} );
			} );
		} );
	}

	// Private: determine if a link is inside any excluded container
	_isExcluded( link ) {
		return this.excludedSelectors.some( ( excludedSelector ) =>
			link.closest( excludedSelector )
		);
	}

	// Private: check and decorate one link
	_processLink( link ) {
		if ( link.dataset.prpl_accessibility_enhanced === 'true' ) return;

		const url = new URL( link.href, window.location.href );
		if (
			url.hostname !== this.currentDomain &&
			url.protocol.startsWith( 'http' )
		) {
			this._addAccessibilityMarkup( link );
			link.setAttribute( 'target', '_blank' );
			link.setAttribute( 'rel', 'noopener noreferrer' );
			link.dataset.prpl_accessibility_enhanced = 'true';
		}
	}

	// Private: inject icon and screen-reader text
	_addAccessibilityMarkup( link ) {
		const srText = document.createElement( 'span' );
		srText.className = 'screen-reader-text';
		srText.textContent = '(Opens in new window)';
		link.appendChild( srText );

		const iconWrapper = document.createElement( 'span' );
		iconWrapper.className = this.iconClass;

		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
		svg.setAttribute( 'fill', 'none' );
		svg.setAttribute( 'viewBox', '0 0 24 24' );
		svg.setAttribute( 'stroke-width', '1.5' );
		svg.setAttribute( 'stroke', 'currentColor' );
		svg.setAttribute( 'aria-hidden', 'true' );

		const path = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		path.setAttribute( 'stroke-linecap', 'round' );
		path.setAttribute( 'stroke-linejoin', 'round' );
		path.setAttribute(
			'd',
			'M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
		);

		svg.appendChild( path );
		iconWrapper.appendChild( svg );
		link.appendChild( iconWrapper );
	}
}

const externalLinkHelper = new ExternalLinkAccessibilityHelper( {
	selectors: [
		'.prpl-wrap', // Wrapper.
		'#progress_planner_dashboard_widget_score', // Dashboard widget.
	],
	excludedSelectors: [
		'.prpl-whats-new li > a', // Blog post image.
		'.prpl-button-share-badge', // Share badge button.
	],
} );

prplDocumentReady( () => {
	console.log( 'externalLinkHelper ready ' );
	externalLinkHelper.applyAccessibility();
} );

// Recheck the accessibility of the page when a new task is injected.
document.addEventListener( 'prpl/suggestedTask/injectItem', () => {
	// Wait for the new task to be added to the DOM.
	setTimeout( () => {
		externalLinkHelper.applyAccessibility();
	}, 500 );
} );
