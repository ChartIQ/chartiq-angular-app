/**
 * Load ChartIQ resources dynamically allowing to catch expired license errors
 */
export function getCIQResources() {
	// import files in sequence as they depend on previous import
	return import('chartiq/js/advanced.js')
		.then(() => import('chartiq/js/addOns.js'))
		.then(() => import('chartiq/js/components.js'))
		.then(() => import('chartiq/plugins/signaliq/signaliqDialog.js'))
		.then(() => import('chartiq/plugins/signaliq/signaliq-marker.js'))
		.then(() => import('chartiq/plugins/signaliq/signaliq-paintbar.js'))
		.then(() => {
			return Promise.all([
				import('chartiq/js/chartiq.js'),
				import('chartiq/js/defaultConfiguration.js'),
				import('chartiq/js/thirdparty/perfect-scrollbar.esm.js'), // nice scrollbar
				import('chartiq/js/thirdparty/emoji-popover.es.js'), // used in signaliq 
				// examples
				import('chartiq/examples/feeds/quoteFeedSimulator.js'),
				import('chartiq/examples/markers/markersSample.js'),
				import('chartiq/examples/markers/tradeAnalyticsSample'),
				import('chartiq/examples/markers/videoSample'),
				import('chartiq/examples/markets/marketDefinitionsSample'),
				import('chartiq/examples/markets/marketSymbologySample'),
				import('chartiq/examples/feeds/symbolLookupChartIQ'),
				import('chartiq/examples/translations/translationSample'),
			]);
		})
		.then(
			([
				{ CIQ },
				{ default: getDefaultConfig },
				{ default: PerfectScrollbar },
				{ default: EmojiPopover },
				{ default: quotefeed },
				{ default: { MarkersSample } },
			]) => {
				return {
					CIQ,
					getDefaultConfig,
					resources: {
						markerFeed: MarkersSample,
						quoteFeed: quotefeed,
						scrollStyle: PerfectScrollbar,
						emojiPicker: EmojiPopover 
					},
				};
			}
		);
}
