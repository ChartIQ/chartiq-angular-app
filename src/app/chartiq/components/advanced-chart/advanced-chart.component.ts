import { Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// Defines available Chartiq library resources for use in ChartService
import { config } from './resources'; // ChartIQ library resources
import { ChartService } from '../../chart.service'; // Angular service for CIQ resources

@Component({
	selector: 'cq-advanced-chart',
	templateUrl: './advanced-chart.component.html',
	styleUrls: ['./advanced-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService]
})
export class AdvancedChartComponent implements OnInit {
	@Input() symbol = '';
	@Input() chartId = '_advanced-chart';
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const container = this.contextContainer.nativeElement;

		// Customize configuration prior to passing it as parameter chart creation
		config.initialSymbol = this.symbol || {
			symbol: "AAPL",
			name: "Apple Inc",
			exchDisp: "NASDAQ"
		};
		// config.quoteFeeds[0].behavior.refreshInterval = 0;

		// Enable any extra addOns here before creating the chart
		// config.enabledAddOns.forecasting = true;
		// config.enabledAddOns.tooltip = false;
		config.chartId = this.chartId;

		// callback when chart is initialized and intial data available
		config.onChartReady = (stx) => { /* stx is the chart engine */ };

		this.chartService.createChartAndUI({ container, config });  
	}
}
