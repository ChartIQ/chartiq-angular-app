import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'cq-advanced-chart-wrapper',
	template: `<cq-advanced-chart [config]="config"></cq-advanced-chart>`,
})
export class AdvancedChartWrapperComponent implements OnInit {
	@Input() symbol?: string | { symbol: string; name?: string; exchDisp?: string };
	@Input() chartId?: string;
	@Input() onChartReady?: Function;
	config: any;

	ngOnInit() {
		this.config = {
			symbol: this.symbol,
			chartId: this.chartId,
			onChartReady:this.onChartReady
		};
		
	}
}
