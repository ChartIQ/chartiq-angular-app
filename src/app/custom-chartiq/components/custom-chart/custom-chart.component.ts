import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// Defines available Chartiq library resources for use in ChartService
import { CIQ, getCustomConfig } from './resources'; // ChartIQ library resources
import { CustomChartService } from '../../custom-chart.service'; // Angular service for CIQ resources

@Component({
	selector: 'cq-angular-custom-chart',
	templateUrl: './custom-chart.component.html',
	styleUrls: ['./custom-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [CustomChartService]
})
export class CustomChartComponent implements OnInit, OnDestroy {
	@Input() symbol = '';
	@Input() chartId = '_custom_chart';
	@ViewChild('contextContainer', { static: true }) contextContainer!: ElementRef;

	constructor(public chartService: CustomChartService) {}

	ngOnInit() {
		const container: HTMLElement = this.contextContainer.nativeElement;

		const config = getCustomConfig();

		// Customize configuration prior to passing it as parameter chart creation
		config.initialSymbol = this.symbol || {
			symbol: "AAPL",
			name: "Apple Inc",
			exchDisp: "NASDAQ"
		};
		// config.quoteFeeds[0].behavior.refreshInterval = 0;

		config.chartId = this.chartId;

		// callback when chart is initialized and intial data available
		config.onChartReady = (stx) => { /* stx is the chart engine */ };

		this.chartService.createChartAndUI({ container, config });
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}
}
