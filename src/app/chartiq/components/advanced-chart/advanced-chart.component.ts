import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
// Defines available Chartiq library resources for use in ChartService
import { ChartService } from '../../chart.service'; // Angular service for CIQ resources
import { Config } from 'chartiq/js/defaultConfiguration.js';
import { getCustomConfig } from '../resources';
import { CIQ } from 'chartiq/js/componentUI';

@Component({
    selector: 'cq-advanced-chart',
    templateUrl: './advanced-chart.component.html',
    styleUrls: ['./advanced-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ChartService],
    standalone: true,
		imports: [CommonModule],
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdvancedChartComponent implements OnInit, OnDestroy {
	@Input() symbol?: string | { symbol: string; name?: string; exchDisp?: string };
	@Input() chartId = '_advanced_chart';
  @Input() onChartReady?: (stx: CIQ.ChartEngine) => void;

  @ViewChild('contextContainer', { static: true }) contextContainer!: ElementRef;

  config!: Config;
	constructor(public chartService: ChartService) {}

	ngOnInit() {
		this.config = getCustomConfig({
      symbol: this.symbol,
      chartId: this.chartId,
      onChartReady: this.onChartReady
    });

	}
	ngAfterViewInit() {
    const container: HTMLElement = this.contextContainer.nativeElement;
    this.chartService.createChartAndUI({ container, config: this.config });
  }

	ngOnDestroy() {
		this.chartService.destroyChart();
	}
}

