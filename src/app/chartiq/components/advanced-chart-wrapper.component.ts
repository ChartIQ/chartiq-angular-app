import { Component, Input, OnInit } from '@angular/core';

import { Config } from 'chartiq/js/defaultConfiguration.js';
import { getCustomConfig } from './resources';
import { CIQ } from 'chartiq/js/chartiq';

@Component({
	selector: 'cq-advanced-chart-wrapper',
	template: `<cq-advanced-chart [config]="config"></cq-advanced-chart>`,
})

export class AdvancedChartWrapperComponent implements OnInit {
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
