// Required imports from chartiq for advanced chart

import { CIQ } from 'chartiq/js/chartiq';
import 'chartiq/js/advanced';
import 'chartiq/js/addOns';
import 'chartiq/js/components';

// Symbol mapping to market definition
import 'chartiq/examples/markets/marketDefinitionsSample';
import 'chartiq/examples/markets/marketSymbologySample';

import 'chartiq/examples/feeds/symbolLookupChartIQ';

import 'chartiq/examples/translations/translationSample';


// Event Markers
import marker from 'chartiq/examples/markers/markersSample.js';
import 'chartiq/examples/markers/tradeAnalyticsSample';
import 'chartiq/examples/markers/videoSample';

// import 'chartiq/examples/help/helpContent.js';

import quoteFeed from "chartiq/examples/feeds/quoteFeedSimulator.js";

// Uncomment the following for the forecasting simulator (required for the forecasting sample).
// import forecastQuoteFeed from "chartiq/examples/feeds/quoteFeedForecastSimulator.js";

import PerfectScrollbar from "chartiq/js/thirdparty/perfect-scrollbar.esm.js";
import EmojiPopover from "chartiq/js/thirdparty/emoji-popover.es.js";

import getConfig from 'chartiq/js/defaultConfiguration';

// Plugins

// Crypto, L2 Heat Map, Market Depth,
// import 'chartiq/plugins/activetrader/cryptoiq';

// ScriptIQ
// import 'chartiq/plugins/scriptiq/scriptiq';

// SignalIQ
import "chartiq/plugins/signaliq/signaliqDialog";
import "chartiq/plugins/signaliq/signaliq-marker";
import "chartiq/plugins/signaliq/signaliq-paintbar";

// import "chartiq/plugins/studybrowser";

// TFC plugin
// import 'chartiq/plugins/tfc/tfc-loader';
// import 'chartiq/plugins/tfc/tfc-demo';   /* if using demo account class */

// Time Span Events
// import 'chartiq/plugins/timespanevent/timespanevent';
// import 'chartiq/plugins/timespanevent/examples/timeSpanEventSample';  /* if using sample */

// Trading Central: Technical Insights
// import 'chartiq/plugins/technicalinsights/components';

// Trading Central: Technical Views
// import 'chartiq/plugins/technicalviews/components';

// Visual Earnings
// import 'chartiq/plugins/visualearnings/visualearnings';

//  Uncomment the following for the L2 simulator (required for the crypto sample and MarketDepth addOn)
// import 'chartiq/examples/feeds/L2_simulator'; /* for use with cryptoiq */

import getLicenseKey from 'keyDir/key';
getLicenseKey(CIQ);

function getDefaultConfig () {
	const config = getConfig({
		quoteFeed,
		// forecastQuoteFeed, // uncomment to enable forcast quote feed simulator
		markerFeed: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
	});
	config.menuStudiesConfig.excludedStudies = {
		...config.menuStudiesConfig.excludedStudies,
		...{ DoM: true }
	};
	return config;
}

function getCustomConfig() {
	const config = getConfig({
		quoteFeed,
		// forecastQuoteFeed, // uncomment to enable forcast quote feed simulator
		markerFeed: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
		emojiPicker: EmojiPopover
	});
	
	// Select only plugin configurations that needs to be active for this chart
	const {
		marketDepth,
		signalIQ,
		tfc,
		technicalInsights,
		ptv,
		visualEarnings,
	} = config.plugins;

	config.plugins = {
		// marketDepth,
		signalIQ,
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
		ptv: {
				moduleName: "TimeSpanEventPanel",
				menuItemSelector: ".stx-markers cq-item.span-event, .ciq-markers .item.ciq-active[stxtap*=TimeSpanEvent]",
				loadSample: true,
				showTooltip: true,
				// Event info can be displayed in "main" chart or in TSE "panel"
				infoPanel: {
					durationEvent: 'main',
					spanEvent: 'main',
					singleEvent: 'main'
				}
			},
		// visualEarnings
	};
	return config;
}

export { CIQ, getDefaultConfig, getCustomConfig };
