/* global customElements, HTMLElement */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-popover-post-content',
	class extends HTMLElement {
		constructor( postId = '', buttonContent = '' ) {
			// Get parent class properties
			super();

			this.postId = postId;
			this.buttonContent = buttonContent;

			if ( ! this.postId && this.hasAttribute( 'post-id' ) ) {
				this.postId = this.getAttribute( 'post-id' );
			}

			if ( ! this.postId ) {
				return;
			}

			if ( ! this.buttonContent ) {
				this.buttonContent = this.getAttribute( 'button-content' );
			}

			// Get the JSON response from https://progressplanner.com/wp-json/wp/v2/posts/{postId}
			fetch(
				`https://progressplanner.com/wp-json/wp/v2/posts/${ this.postId }`
			)
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					if ( ! data.content.rendered || ! data.title.rendered ) {
						return;
					}

					this.innerHTML = `
						<button type="button" popovertarget="prpl-popover-post-content-${ this.postId }">
							${ this.buttonContent }
						</button>
						<div id="prpl-popover-post-content-${ this.postId }" popover style="max-width:80vw; max-height:80vh; overflow-y: auto; overflow-x: hidden;">
							<h1>${ data.title.rendered }</h1>
							${ data.content.rendered }
						</div>
					`;
				} );
		}
	}
);
