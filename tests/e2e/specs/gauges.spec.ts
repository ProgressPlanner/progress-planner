/**
 * Gauge colors: the badge gauges and the missed-badge progress bar.
 *
 * A brand that sets --prpl-color-gradient-start gets a gradient from that
 * color to the gauge's own color over the filled part; without it the fill is
 * solid. The activity score gauge passes its own color as `gradient-start`,
 * so it stays solid whatever the brand sets.
 *
 * The components are rendered on the dashboard with test colors, so the
 * checks don't depend on the brand the site uses.
 */
import { test, expect, Page } from '@playwright/test';

const RED = 'rgb(255, 0, 0)';
const BLUE = 'rgb(0, 0, 255)';
const GREEN = 'rgb(0, 128, 0)';

type GaugeOptions = {
	gradientStart?: string; // --prpl-color-gradient-start on the container; unset when omitted.
	attribute?: string; // The gauge's own `gradient-start` attribute.
	value: number;
	max: number;
};

/**
 * Render a gauge filled in RED and return the color stops of its arc.
 *
 * @param page    The page.
 * @param options Gauge options.
 * @return The conic-gradient's stops, colors resolved, e.g. "rgb(…) 0deg, rgb(…) 90deg, …".
 */
async function renderGauge( page: Page, options: GaugeOptions ) {
	return page.evaluate(
		async ( { opts, red } ) => {
			const container = document.createElement( 'div' );
			// `initial` makes the variable unset here even if the brand sets it.
			container.style.setProperty(
				'--prpl-color-gradient-start',
				opts.gradientStart ?? 'initial'
			);
			const gauge = document.createElement( 'prpl-gauge' );
			gauge.setAttribute( 'color', red );
			gauge.setAttribute( 'background', 'rgb(255, 255, 255)' );
			gauge.setAttribute( 'data-max', String( opts.max ) );
			gauge.setAttribute( 'data-value', String( opts.value ) );
			if ( opts.attribute ) {
				gauge.setAttribute( 'gradient-start', opts.attribute );
			}
			container.appendChild( gauge );
			document.body.appendChild( container );

			// The gauge renders on the next tick after it's connected.
			await new Promise( ( resolve ) => setTimeout( resolve, 50 ) );

			const arc = gauge.shadowRoot?.querySelector( 'div > div' );
			const image = arc
				? window.getComputedStyle( arc ).backgroundImage
				: '';
			const remain = window
				.getComputedStyle( container )
				.getPropertyValue( '--prpl-color-gauge-remain' )
				.trim();
			container.remove();

			const conic = image.match( /conic-gradient\(from [^,]+, (.*)\)$/ );
			return { stops: conic ? conic[ 1 ] : image, remain };
		},
		{ opts: options, red: RED }
	);
}

/**
 * Render the missed-badge progress bar with --prpl-color-monthly RED and
 * return the background of its filled part.
 *
 * @param page          The page.
 * @param gradientStart --prpl-color-gradient-start on the container; unset when omitted.
 * @return The computed background-image of the bar's fill.
 */
async function renderProgressBar( page: Page, gradientStart?: string ) {
	return page.evaluate(
		async ( { start, red } ) => {
			const container = document.createElement( 'div' );
			container.style.setProperty( '--prpl-color-monthly', red );
			container.style.setProperty(
				'--prpl-color-gradient-start',
				start ?? 'initial'
			);
			const bar = document.createElement( 'prpl-badge-progress-bar' );
			bar.setAttribute( 'data-points', '5' );
			bar.setAttribute( 'data-max-points', '10' );
			container.appendChild( bar );
			document.body.appendChild( container );
			await new Promise( ( resolve ) => setTimeout( resolve, 50 ) );

			const fill = bar.shadowRoot?.querySelector( '.progress' );
			const image = fill
				? window.getComputedStyle( fill ).backgroundImage
				: '';
			container.remove();
			return image;
		},
		{ start: gradientStart, red: RED }
	);
}

test.describe( 'Gauge colors', () => {
	test.beforeEach( async ( { page } ) => {
		await page.goto( '/wp-admin/admin.php?page=progress-planner' );
		await page.waitForFunction(
			() =>
				!! window.customElements.get( 'prpl-gauge' ) &&
				!! window.customElements.get( 'prpl-badge-progress-bar' )
		);
	} );

	test( 'without a gradient start, the fill is one solid color', async ( {
		page,
	} ) => {
		const { stops, remain } = await renderGauge( page, {
			value: 5,
			max: 10,
		} );
		expect( remain ).not.toBe( '' );
		expect( stops ).toMatch(
			new RegExp(
				`^${ esc( RED ) } 0deg, ${ esc(
					RED
				) } 90deg, rgb\\([^)]+\\) 90deg, rgb\\([^)]+\\) 180deg`
			)
		);
	} );

	test( 'a brand gradient start fades into the gauge color over the filled part', async ( {
		page,
	} ) => {
		const { stops } = await renderGauge( page, {
			gradientStart: BLUE,
			value: 5,
			max: 10,
		} );
		// Starts BLUE, reaches RED exactly where the fill ends (half of 180deg).
		expect( stops ).toMatch(
			new RegExp( `^${ esc( BLUE ) } 0deg, ${ esc( RED ) } 90deg, ` )
		);
	} );

	test( 'a full gauge ends in the gauge color at the end of the arc', async ( {
		page,
	} ) => {
		const { stops } = await renderGauge( page, {
			gradientStart: BLUE,
			value: 10,
			max: 10,
		} );
		expect( stops ).toMatch(
			new RegExp( `^${ esc( BLUE ) } 0deg, ${ esc( RED ) } 180deg, ` )
		);
	} );

	test( 'the gradient-start attribute wins over the brand (score gauge stays solid)', async ( {
		page,
	} ) => {
		const { stops } = await renderGauge( page, {
			gradientStart: BLUE,
			attribute: GREEN,
			value: 3,
			max: 10,
		} );
		expect( stops ).toMatch(
			new RegExp( `^${ esc( GREEN ) } 0deg, ${ esc( RED ) } 54deg, ` )
		);
	} );

	test( 'the missed-badge bar follows the same rule', async ( { page } ) => {
		expect( await renderProgressBar( page ) ).toBe(
			`linear-gradient(to right, ${ RED }, ${ RED })`
		);
		expect( await renderProgressBar( page, BLUE ) ).toBe(
			`linear-gradient(to right, ${ BLUE }, ${ RED })`
		);
	} );
} );

/**
 * Escape a string for use in a regular expression.
 *
 * @param value The string.
 * @return The escaped string.
 */
function esc( value: string ) {
	return value.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
}
