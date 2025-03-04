import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { getCustomConfig } from '../resources';
import { CIQ } from 'chartiq/js/chartiq';
import { Config } from 'chartiq/js/defaultConfiguration.js';

@Component({
	selector: 'cq-cross-section-wrapper',
	template: '<cq-cross-section [config]="config"></cq-cross-section>',
	encapsulation: ViewEncapsulation.None,
})

export class TermStructureWrapperComponent implements OnInit {
	@Input() symbol?: string | { symbol: string; name?: string; exchDisp?: string };
	@Input() chartId?: string;
	@Input() onChartReady?: (stx: CIQ.ChartEngine) => void;
	config?: Config;

	ngOnInit() {
		this.config = getCustomConfig({
			symbol: this.symbol,
			chartId: this.chartId,
			onChartReady: this.onChartReady
		})
	}
}
