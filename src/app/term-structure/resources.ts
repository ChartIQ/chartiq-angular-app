/* Place styles up here so they can be overridden by plugin and page styles if need be */
// import "chartiq/css/normalize.css";
// import "chartiq/css/page-defaults.css";
// import "chartiq/css/stx-chart.css";
// import "chartiq/css/chartiq.css";

import "chartiq/plugins/crosssection/sample.css"
// import "chartiq/plugins/crosssection/crosssection.css"
import "chartiq/plugins/crosssection/datepicker.css"

import { CIQ } from 'chartiq/js/chartiq';
// Required imports from chartiq for advanced chart
import "chartiq/js/standard.js";
import "chartiq/js/components.js";
import 'chartiq/js/components-legacy.js';
import "chartiq/js/componentUI.js";

import 'chartiq/plugins/crosssection/core.js';

import "chartiq/plugins/crosssection/datepicker.js";
import "chartiq/plugins/crosssection/ui.js";
import "chartiq/plugins/crosssection/timelineDateSelector.js";
import quoteFeed from "chartiq/examples/feeds/termstructureDataSimulator.js";

/* Template-specific imports */
import getConfig from "chartiq/js/defaultConfiguration.js";

import PerfectScrollbar from "chartiq/js/thirdparty/perfect-scrollbar.esm.js";

import "chartiq/examples/feeds/symbolLookupChartIQ.js";

import "chartiq/examples/markets/marketDefinitionsSample.js";
import "chartiq/examples/markets/marketSymbologySample.js";
import 'chartiq/examples/markets/timezones.js';

import getLicenseKey from 'keyDir/key';
getLicenseKey(CIQ);

type GetCustomConfigArgsType = {
	chartId?: string
	symbol?: string | { symbol: string; name?: string; exchDisp?: string }
	onChartReady?: (stx: CIQ.ChartEngine) => void
}

function getDefaultConfig () {
	return getConfig({
		quoteFeed,
		// forecastQuoteFeed, // uncomment to enable forcast quote feed simulator
		scrollStyle: PerfectScrollbar,
	});
}

// Creates a complete customised configuration object
function getCustomConfig({ chartId, symbol, onChartReady }: GetCustomConfigArgsType = {}) {
	const config = getDefaultConfig();

	config.enabledAddOns.rangeSlider = false;
	config.enabledAddOns.shortcuts = false;

	config.chartId = chartId || "_cross-section-chart"
	config.initialSymbol = symbol || symbol === "" ? symbol : "US-T BENCHMARK";

	if (onChartReady) config.onChartReady = onChartReady;

	config.menuYaxisField = [
		{ type: "item", label: "Yield", cmd: "Layout.setYaxisField('yield')" },
		{ type: "item", label: "Bid", cmd: "Layout.setYaxisField('bid')" },
		{ type: "item", label: "Mid", cmd: "Layout.setYaxisField('mid')" },
		{ type: "item", label: "Ask", cmd: "Layout.setYaxisField('ask')" }
	];
	config.menuChartPreferences = [
		{ type: "checkbox", label: "Shading", cmd: "Layout.Shading()" },
		{ type: "checkbox", label: "X-Axis Scaling", cmd: "Layout.XAxisScaling()" },
		{
			type: "checkbox",
			label: "Update Animations",
			cmd: "Layout.UpdateAnimations()"
		},
		{ type: "checkbox", label: "Show Update Stamp", cmd: "Layout.UpdateStamp()" },
		{
			type: "checkbox",
			label: "Recent Updates",
			cmd: "Layout.FreshPoints()",
			options: "Layout.showFreshnessEdit()"
		},
		{
			type: "checkbox",
			label: "Timeline Date Selector",
			cmd: "Layout.TimelineDateSelector()"
		}
	];


	const { crossSection } = config.plugins;
	config.plugins = { crossSection };

	if (config.plugins.crossSection) {
		config.plugins.crossSection.sortFunction = (l: string, r: string) => {
			let weight = ["DY", "WK", "MO", "YR", "ST", "MT", "LT"];
			let l1 = l.split(" "),
				r1 = r.split(" ");
			let diff =
				weight.indexOf(l1[l1.length - 1]) - weight.indexOf(r1[r1.length - 1]);
			if (diff) return diff > 0 ? 1 : -1;

			if (isNaN(Number(l1[0]))) return 1;
			if (isNaN(Number(r1[0]))) return -1;
			if (Number(l1[0]) < Number(r1[0])) return -1;
			if (Number(r1[0]) < Number(l1[0])) return 1;
			return 0;
		};
	}

	return config;
}

export { CIQ, getCustomConfig };
