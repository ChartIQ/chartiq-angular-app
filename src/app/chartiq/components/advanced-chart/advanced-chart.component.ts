import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

// Defines available Chartiq library resources for use in ChartService
import { ChartService } from '../../chart.service'; // Angular service for CIQ resources

@Component({
	selector: 'cq-advanced-chart',
	templateUrl: './advanced-chart.component.html',
	styleUrls: ['./advanced-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService]
})
export class AdvancedChartComponent implements OnInit, OnDestroy {
	@Input() config: any;
	@ViewChild('contextContainer', { static: true }) contextContainer: ElementRef;

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const  config = this.config;
		const container = this.contextContainer.nativeElement;

		this.chartService.createChartAndUI({ container, config });
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}
}
