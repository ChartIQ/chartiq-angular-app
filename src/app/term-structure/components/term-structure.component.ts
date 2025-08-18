import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config } from 'chartiq/js/defaultConfiguration';


import { ChartService } from '../chart.service';

@Component({
	selector: 'cq-cross-section',
	templateUrl: './term-structure.component.html',
	styleUrls: ['./term-structure.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService],
	imports: [CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class TermStructureComponent implements OnInit, OnDestroy {
	@Input() config?: Config;
	@ViewChild('contextContainer', { static: true}) contextContainer?: ElementRef;

	constructor(public chartService: ChartService) {}

	ngOnInit() {
		const config = this.config;
		const container: HTMLElement = this.contextContainer?.nativeElement;

		this.chartService.createChartAndUI({ container, config });
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}
}
