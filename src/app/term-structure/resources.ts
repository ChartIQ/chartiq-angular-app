/* Place styles up here so they can be overridden by plugin and page styles if need be */
import "chartiq/css/normalize.css";
import "chartiq/css/stx-chart.css";
import "chartiq/css/chartiq.css";
import "chartiq/css/webcomponents.css";

import { CIQ } from 'chartiq/js/chartiq';
// Required imports from chartiq for advanced chart
import "chartiq/js/standard.js";
import "chartiq/js/components.js";
import "chartiq/js/componentUI.js";

import 'chartiq/plugins/crosssection/core.js';
import "chartiq/plugins/crosssection/components/legendCrossplot.js";
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

	(config.menus as any).menuYaxisField = {
		content: [
			{ type: "item", label: "Yield", tap: "Layout.setYaxisField('yield')" },
			{ type: "item", label: "Bid", tap: "Layout.setYaxisField('bid')" },
			{ type: "item", label: "Mid", tap: "Layout.setYaxisField('mid')" },
			{ type: "item", label: "Ask", tap: "Layout.setYaxisField('ask')" }
		]
	};
	(config.menus as any).menuChartPreferences = {
		content: [
			{ type: "heading", label: "Options" },
			{ type: "switch", label: "Shading", setget: "Layout.Shading()" },
			{
				type: "switch",
				label: "X-Axis Scaling",
				setget: "Layout.XAxisScaling()"
			},
			{
				type: "switch",
				label: "Update Animations",
				setget: "Layout.UpdateAnimations()"
			},
			{
				type: "switch",
				label: "Show Update Stamp",
				setget: "Layout.UpdateStamp()"
			},
			{
				type: "switch",
				label: "Recent Updates",
				setget: "Layout.FreshPoints()",
				options: "Layout.showFreshnessEdit()"
			},
			{
				type: "switch",
				label: "Timeline Date Selector",
				setget: "Layout.TimelineDateSelector()"
			},
			{ type: "separator" },
			{ type: "heading", label: "Themes" },
			{ type: "component", value: "cq-themes", menuPersist: true }
		]
	};


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
