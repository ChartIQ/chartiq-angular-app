import { Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// Defines available Chartiq library resources for use in ChartService
import { CIQ, config } from './resources'; // ChartIQ library resources
import { CustomChartService } from '../../custom-chart.service'; // Angular service for CIQ resources

@Component({
	selector: 'cq-angular-custom-chart',
	templateUrl: './custom-chart.component.html',
	styleUrls: ['./custom-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [CustomChartService]
})
export class CustomChartComponent implements OnInit {
	@Input() symbol = '';
	@Input() chartId = '_custom_chart';
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;

	constructor(public chartService: CustomChartService) {}

	ngOnInit() {
		const container = this.contextContainer.nativeElement;

		CIQ.debug = false;

		// Customize configuration prior to passing it as parameter chart creation
		config.initialSymbol = this.symbol || {
			symbol: "AAPL",
			name: "Apple Inc",
			exchDisp: "NASDAQ"
		};
		// config.quoteFeeds[0].behavior.refreshInterval = 0;

		// Enable any extra addOns here before creating the chart
		// const { tooltip, continuousZoom, outliers } = config.addOns;
		// const activeAddOns = { continuousZoom, outliers, tooltip };
		// config.enabledAddOns = Object.assign(activeAddOns, config.enabledAddOns);
		config.chartId = this.chartId;

		// Remove forecasting addOn not used here
		delete config.addOns.plotComplementer;
		delete config.addOns.forecasting;


		this.chartService.createChartAndUI({ container, config });  
	}
}
