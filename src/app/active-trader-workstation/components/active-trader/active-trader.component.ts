import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// defines resources for use in ChartService providing a way to configurate service
import { CIQ, getDefaultConfig } from './resources';
import { ChartService } from '../../chart.service';

const { channelWrite } = CIQ.UI.BaseComponent.prototype;

@Component({
	selector: 'cq-active-trader',
	templateUrl: './active-trader.component.html',
	styleUrls: ['./active-trader.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService]
})
export class ActiveTraderComponent implements OnInit, OnDestroy {
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;
	@Input() chartId = '_active_trader';

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const container = this.contextContainer.nativeElement;

		CIQ['debug'] = false;

		// Customize configuration prior to passing it as parameter chart creation
		// config.quoteFeeds[0].behavior.refreshInterval = 0;
		const config = getDefaultConfig();
		config.initialSymbol = '^USDAUD';

		// Enable any extra addOns here before creating the chart
		config.enabledAddOns.animation = true;
		// config.enabledAddOns.forecasting = true;
		// config.enabledAddOns.tooltip = false;

		config.chartId = this.chartId;

		config.plugins.marketDepth = {
			volume:true,
			mountain:true,
			step:true,
			record:true,
			height:"40%",
			precedingContainer:"#marketDepthBookmark"
		};

		config.menuChartPreferences = config.menuChartPreferences.filter(item => (
			item.label !== 'Extended Hours'
		));

		config.addOns.tableView.coverContainer = ".ciq-chart-area";


		// callback when chart is initialized and intial data available
		config.onChartReady = (stx) => { /* stx is the chart engine */ };

		const uiContext = this.chartService.createChartAndUI({ container, config });

		this.cryptoSetup(uiContext.stx)
		if (window['d3']) {
			this.setUpMoneyFlowChart(uiContext.stx);
		} else {
			CIQ.loadScript('https://d3js.org/d3.v5.min.js', () => {
				this.setUpMoneyFlowChart(uiContext.stx);
			})
		}

		// Request TFC channel open
		channelWrite(config.channels.tfc, true, uiContext.stx);
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}

	cryptoSetup(stx) {
		stx.setChartType("line");
		CIQ.extend(stx.layout,{
			crosshair:true,
			headsUp:{ static: true },
			l2heatmap:true,
			rangeSlider:true,
			marketDepth:true,
			extended:false
		});
		stx.changeOccurred("layout");

		// Simulate L2 data using https://documentation.chartiq.com/CIQ.ChartEngine.html#updateCurrentMarketData
		CIQ["simulateL2"]({ stx, onInterval: 1000, onTrade: true });
	}

	setUpMoneyFlowChart(stx) {
		stx.moneyFlowChart=moneyFlowChart(stx);

		function moneyFlowChart(stx){
			const initialPieData = {
				Up: { index: 1 },
				Down: { index: 2 },
				Even: { index: 3 }
			};

			const pieChart=new CIQ.Visualization({
				container: "cq-tradehistory-table div[pie-chart] div",
				renderFunction: CIQ["SVGChart"].renderPieChart,
				colorRange: ["#8cc176","#b82c0c","#7c7c7c"],
				className: "pie",
				valueFormatter: CIQ.condenseInt
			}).updateData(CIQ.clone(initialPieData));

			let last = null;
			stx.append("updateCurrentMarketData",function(data, chart, symbol, params){
				if(symbol) return;
				const items = document.querySelectorAll("cq-tradehistory-body cq-item");
				var d = {};
				for(var i = 0;i < items.length; i++){
					const item = items[i];
					if (item === last) break;
					var dir= item.getAttribute("dir");
					if(!dir) dir="even";
					dir = CIQ.capitalize(dir);
					if (!d[dir]) d[dir] = 0;
					d[dir] += parseFloat(item.querySelector("[col=amount]").getAttribute("rawval"));
				}
				if(i) pieChart.updateData(d, "add");
				last = items[0];
			});
			stx.addEventListener("symbolChange",function(obj){
				pieChart.updateData(CIQ.clone(initialPieData));
			});
			return pieChart;
		}
	}
}
