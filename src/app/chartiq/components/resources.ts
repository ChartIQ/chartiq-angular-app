// Required imports from chartiq for advanced chart

import { CIQ } from 'chartiq/js/chartiq';

// For multi-chart support, comment out the 'advanced' import below and uncomment the 'standard' import
import 'chartiq/js/advanced';
//import "chartiq/js/standard";
import 'chartiq/js/addOns';
import 'chartiq/js/components';

import 'chartiq/examples/feeds/symbolLookupChartIQ';

import 'chartiq/examples/translations/translationSample';

// Event Markers
import marker from 'chartiq/examples/markers/markersSample.js';
import 'chartiq/examples/markers/tradeAnalyticsSample';
import 'chartiq/examples/markers/videoSample';

// Symbol mapping to market definition
import 'chartiq/examples/markets/marketDefinitionsSample';
import 'chartiq/examples/markets/marketSymbologySample';
import 'chartiq/examples/markets/timezones.js';

// import 'chartiq/examples/help/helpContent.js';

import quoteFeed from 'chartiq/examples/feeds/quoteFeedSimulator.js';

// Uncomment the following for the forecasting simulator (required for the forecasting sample).
// import forecastQuoteFeed from "chartiq/examples/feeds/quoteFeedForecastSimulator.js";

import PerfectScrollbar from 'chartiq/js/thirdparty/perfect-scrollbar.esm.js';
import EmojiPopover from 'chartiq/js/thirdparty/emoji-popover.es.js';

import getConfig from 'chartiq/js/defaultConfiguration';

// Plugins

// Crypto, L2 Heat Map, Market Depth,
// import 'chartiq/plugins/activetrader/cryptoiq';

// Importing the chart2music plugin from ChartIQ
// chart2music will provide sonification (converting data into sound), support for screen readers, and keyboard handling capabilities.
import 'chartiq/plugins/chart2music'

// SignalIQ
import 'chartiq/plugins/signaliq/signaliqDialog';
import 'chartiq/plugins/signaliq/signaliq-marker';
import 'chartiq/plugins/signaliq/signaliq-paintbar';

import 'chartiq/plugins/studybrowser';

// TFC plugin
// import 'chartiq/plugins/tfc/tfc-loader';
// import 'chartiq/plugins/tfc/tfc-demo';   /* if using demo account class */

// Time Span Events
// import 'chartiq/plugins/timespanevent/timespanevent';
// import 'chartiq/plugins/timespanevent/examples/timeSpanEventSample';  /* if using sample */

// Trading Central: Technical Insights
// import 'chartiq/plugins/technicalinsights/components'

// Trading Central: Technical Views
// import 'chartiq/plugins/technicalviews/components';

//  Uncomment the following for the L2 simulator (required for the crypto sample and MarketDepth addOn)
// import 'chartiq/examples/feeds/L2_simulator'; /* for use with cryptoiq */



import getLicenseKey from 'keyDir/key';
getLicenseKey(CIQ);

type GetCustomConfigArgsType = {
	chartId?: string
	symbol?: string | { symbol: string; name?: string; exchDisp?: string }
	restore?: boolean
	onChartReady?: (stx: CIQ.ChartEngine) => void
}

function getDefaultConfig () {
	return getConfig({
		quoteFeed,
		// forecastQuoteFeed, // uncomment to enable forcast quote feed simulator
		markerFeed: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
		emojiPicker: EmojiPopover
	});
}

// Creates a complete customised configuration object
function getCustomConfig({
	chartId,
	symbol,
	restore,
	onChartReady
}: GetCustomConfigArgsType = {}) {
	const config = getDefaultConfig()

	// Update chart configuration by modifying default configuration
	config.chartId = chartId || '_advanced-chart'
	config.initialSymbol = symbol  || symbol === "" ? symbol : {
		symbol: 'AAPL',
		name: 'Apple Inc',
		exchDisp: 'NASDAQ'
	}
	if (typeof restore === 'boolean') config.restore = restore

	if (onChartReady) config.onChartReady = onChartReady

	config.menuStudiesConfig.excludedStudies = {
		...config.menuStudiesConfig.excludedStudies,
		...{ DoM: true }
	}

	// Select only plugin configurations that needs to be active for this chart
	const {
		advanced,
		// @ts-ignore
		chart2music,
		marketDepth,
		signalIQ,
		studyBrowser,
		tfc,
		technicalInsights,
		technicalViews,
		timeSpanEventPanel
	} = config.plugins;

	config.plugins = {
		advanced,
		//@ts-ignore
		chart2music,
		// marketDepth,
		signalIQ,
		studyBrowser,
		// tfc,
		// technicalInsights: {
		//	container: "",
		//	moduleName: "",
		//	lang: "en",
		//	channel: "",
		//	toggleMarkup: "",
		//	...technicalInsights,
		//	token: "",
		// 	// use for dynamic plugin load
		//  // @ts-ignore // ignore since load isn't defined in ts definition
		// 	// load() {
		// 	//	return import('chartiq/plugins/technicalinsights/components')
		// 	// }
		// },
		// technicalViews: {
		//	container: "",
		//	moduleName: "",
		//	channel: "",
		//	toggleMarkup: "",
		//	partner: 0,
		//	...technicalViews,
		//	token: "",
		// 	// use for dynamic plugin load
		//  // @ts-ignore // ignore since load isn't defined in ts definition
		// 	// load() {
		// 	//	return import('chartiq/plugins/technicalviews/components')
		// 	// }
		// },
		// timeSpanEventPanel
	};

/* Use dynamic load on demand as an alternative to static import */
// config.plugins.tfc.load = () => Promise.all([
// 	import("chartiq/plugins/tfc/tfc-loader"),
// 	import("chartiq/plugins/tfc/tfc-demo")
// ]);
// config.plugins.technicalInsights.load = () => import("chartiq/plugins/technicalinsights/components");
// config.plugins.technicalViews.load = () => import("chartiq/plugins/technicalviews/components");

	/* Enable / disable addOns */
	// config.enabledAddOns.tooltip = false;
	// config.enabledAddOns.continuousZoom = true;

	return config;
}

export { CIQ, getCustomConfig };
