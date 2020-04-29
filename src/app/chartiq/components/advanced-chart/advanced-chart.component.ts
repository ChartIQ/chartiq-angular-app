import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// Defines available Chartiq library resources for use in ChartService
import { CIQ } from './resources'; // ChartIQ library resources
import { ChartService } from '../../chart.service'; // Angular service for CIQ resources

import 'chartiq/examples/templates/js/sample-config'; // Configuration

@Component({
	selector: 'cq-advanced-chart',
	templateUrl: './advanced-chart.component.html',
	styleUrls: ['./advanced-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService]
})
export class AdvancedChartComponent implements OnInit {
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const container = this.contextContainer.nativeElement;

		CIQ.debug = false;
		const config = CIQ.getDefaultConfig();
		
		// Customize configuration prior to passing it as parameter chart creation
		config.initialSymbol = {
			symbol: "AAPL",
			name: "Apple Inc",
			exchDisp: "NASDAQ"
		};
		// config.quoteFeeds[0].behavior.refreshInterval = 0;
		config.addOns.tooltip = null;
		config.addOns.marketDepth = null;
		config.addOns.animation = null;

		this.chartService.createChartAndUI({ container, config });  
	}
}
