import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// defines resources for use in ChartService providing a way to configurate service
import { CIQ, getDefaultConfig } from './resources';
import { ChartService } from '../../chart.service';

const { channelWrite } = CIQ.UI.BaseComponent.prototype;

@Component({
    selector: 'cq-active-trader',
    templateUrl: './active-trader.component.html',
    styleUrls: ['./active-trader.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ChartService],
    standalone: true,
		imports: [CommonModule],
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActiveTraderComponent implements OnInit, OnDestroy {
	@ViewChild('contextContainer', { static: true }) contextContainer!: ElementRef;
	@Input() chartId = '_active_trader';

	private observer!: MutationObserver;

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const container: HTMLElement = this.contextContainer.nativeElement;

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
			precedingContainer:"#marketDepthBookmark",
			interaction: true
		};

		config.menus.preferences.content = config.menus.preferences.content.filter(
			(item) => item.label !== "Extended Hours"
		);

		config.addOns.tableView.coverContainer = ".ciq-chart-area";


		// callback when chart is initialized and intial data available
		config.onChartReady = (stx: CIQ.ChartEngine) => { /* stx is the chart engine */ };

		const uiContext = this.chartService.createChartAndUI({ container, config });


		this.cryptoSetup(uiContext.stx);
		if (window['d3']) {
			this.setUpMoneyFlowChart(uiContext.stx);
		} else {
			CIQ.loadScript('https://d3js.org/d3.v5.min.js', () => {
				this.setUpMoneyFlowChart(uiContext.stx);
			})
		}

		// Request TFC channel open
		channelWrite(config.channels.tfc, true, uiContext.stx);

		//This behavior seems broken in 9.8 across all frameworks (Angular, Vue, React) , I have only verified in react with library 9.7 and its working
		// [https://chartiq.kanbanize.com/ctrl_board/15/cards/53652/details/ repro steps 3 and 4.]
		const toggle = document.querySelector('cq-toggle.ciq-draw') as HTMLElement;
    const mainChartGroup = document.getElementById('mainChartGroup');

    if (!toggle || !mainChartGroup) return;


		if (!toggle || !mainChartGroup) return;

		const chartContainer = mainChartGroup.querySelector('.chartContainer');
		if (!chartContainer) return;

		const updateMargin = () => {
			const isActive = toggle.classList.contains('active');
			console.log(isActive, chartContainer);
			//@ts-ignore
			chartContainer.style.marginLeft = isActive ? '69px' : '';
		};

		updateMargin();

		this.observer = new MutationObserver(() => {
			updateMargin();
		});

		this.observer.observe(toggle, {
			attributes: true,
			attributeFilter: ['class']
		});
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}

	cryptoSetup(stx: CIQ.ChartEngine) {
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
		(
			CIQ as unknown as { simulateL2: (params: { onTrade: boolean, stx: CIQ.ChartEngine, onInterval: number }) => void }
		)["simulateL2"]({ stx, onInterval: 1000, onTrade: true });
	}

	setUpMoneyFlowChart(stx: CIQ.ChartEngine) {
		stx.moneyFlowChart=moneyFlowChart(stx);

		function moneyFlowChart(stx: CIQ.ChartEngine){
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

			let last: Element | null = null;
			stx.append("updateCurrentMarketData",function(data: object, chart?: CIQ.ChartEngine.Chart | null, symbol?: string | null) {
				if(symbol) return;
				const items = document.querySelectorAll("cq-tradehistory-body cq-item");
				var d: Record<string, number> = {};
				for(var i = 0;i < items.length; i++){
					const item = items[i];
					if (item === last) break;
					var dir= item.getAttribute("dir");
					if(!dir) dir="even";
					dir = CIQ.capitalize(dir);
					if (!d[dir]) d[dir] = 0;
					d[dir] += parseFloat(item.querySelector("[col=amount]")?.getAttribute("rawval") || '');
				}
				if(i) pieChart.updateData(d, "add");
				last = items[0];
			});
			stx.addEventListener("symbolChange",function(){
				pieChart.updateData(CIQ.clone(initialPieData));
			});
			return pieChart;
		}
	}
}
