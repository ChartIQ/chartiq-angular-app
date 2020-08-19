import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// defines resources for use in ChartService providing a way to configurate service 
import { CIQ, config } from './resources';
import { ChartService } from '../../chart.service';

const { channelWrite } = CIQ.UI.BaseComponent.prototype;

@Component({
	selector: 'cq-active-trader',
	templateUrl: './active-trader.component.html',
	styleUrls: ['./active-trader.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService]
})
export class ActiveTraderComponent implements OnInit {
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;
	@Input() chartId = '_active_trader';

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const container = this.contextContainer.nativeElement;

		CIQ.debug = false;

		// Customize configuration prior to passing it as parameter chart creation
		// config.quoteFeeds[0].behavior.refreshInterval = 0;
		config.initialSymbol = '^USDAUD';

		// Enable any extra addOns here before creating the chart
		// const { tooltip, continuousZoom, outliers } = config.addOns;
		// const activeAddOns = { continuousZoom, outliers, tooltip };
		// config.enabledAddOns = Object.assign(activeAddOns, config.enabledAddOns);
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
			item.label !== 'Market Depth' && item.label !== 'Extended Hours'
		));

		const uiContext = this.chartService.createChartAndUI({ container, config });

		if (window['d3']) {
			this.cryptoSetup(uiContext.stx);
		} else {
			CIQ.loadScript('https://d3js.org/d3.v5.min.js', () => {
				this.cryptoSetup(uiContext.stx);
			})
		}

		// Request TFC channel open
		channelWrite(config.channels.tfc, true, uiContext.stx);		
	}

	cryptoSetup(stx) {
		stx.setChartType("line");
		CIQ.extend(stx.layout,{
			crosshair:true,
			headsUp:"static",
			l2heatmap:true,
			rangeSlider:true,
			marketDepth:true,
			extended:false
		});
		stx.changeOccurred("layout");

		// Simulate L2 data using https://documentation.chartiq.com/CIQ.ChartEngine.html#updateCurrentMarketData
		CIQ.simulateL2({ stx, onInterval: 1000, onTrade: true });

		stx.moneyFlowChart=moneyFlowChart(stx);

		function moneyFlowChart(stx){
			const initialPieData = {
				Up: { index: 1 },
				Down: { index: 2 },
				Even: { index: 3 }
			};

			const pieChart=new CIQ.Visualization({
				container: "cq-tradehistory-table div[pie-chart] div",
				renderFunction: CIQ.SVGChart.renderPieChart,
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

