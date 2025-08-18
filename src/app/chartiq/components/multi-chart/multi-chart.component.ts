import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	AfterViewInit,
	ViewChild,
	ElementRef,
	ViewEncapsulation,
	CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../../chart.service'; // Angular service for CIQ resources
import { getCustomConfig } from '../resources';
import { Config } from 'chartiq/js/defaultConfiguration.js';
import quoteFeedSimulator from 'chartiq/examples/feeds/quoteFeedSimulator';
import PerfectScrollbar from 'chartiq/js/thirdparty/perfect-scrollbar.esm.js';
import marker from 'chartiq/examples/markers/markersSample';
import { CIQ } from 'chartiq/js/components';

@Component({
	selector: 'app-multi-chart',
	templateUrl: './multi-chart.component.html',
	styleUrls: ['./multi-chart.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService],
	standalone: true,
	imports: [CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultiChartComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('contextContainer', { static: false })
	contextContainer!: ElementRef;
	@Input() symbol?:
		| string
		| { symbol: string; name?: string; exchDisp?: string };
	@Input() chartId?: string;
	@Input() onChartReady?: (stx: CIQ.ChartEngine) => void;
	private config!: Config & { multiChartId?: string };

	resources = {
		quoteFeed: quoteFeedSimulator,
		markerFeed: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
	};
	constructor(public chartService: ChartService) {}

	ngOnInit() {
		this.config = getCustomConfig({ resources: this.resources } as any);
		this.config.multiChartId = '_ciq';
		this.config.addOns.tableView.coverContainer =
			'.ciq-multi-chart-container-wrapper';
	}

	ngAfterViewInit(): void {
		const chartEntries = [
			{
				symbol: {
					symbol: 'IBM',
					name: 'International Business Machines Corp.',
					exchDisp: 'NYSE',
				},
			},
			{ symbol: 'AAPL' },
		];
		const store = new CIQ.NameValueStore();
		setTimeout(() => {
			store.get(
				`multiCharts${this.config.multiChartId}`,
				(err: any, chartConfig: any) => {
					const {
						charts = chartEntries,
						colCount = 2,
						rowCount = 1,
						gridTemplate,
					} = chartConfig || {};
					const container: HTMLElement = this.contextContainer
						.nativeElement as HTMLElement & {
						charts?: any[];
						chartsArray?: any[];
					};
					if (!container) return;
					const stxArr = new CIQ.UI.Multichart().createCharts(
						{
							chartsConfig: {
								charts,
								colCount,
								rowCount,
								gridTemplate,
							} as {
								charts: object[];
								colCount?: number;
								rowCount?: number;
								gridTemplate?: string | undefined;
							},
							containerId: container,
						},
						this.config
					);

					(window as any).CIQ = CIQ;
					(window as any).stxArr = stxArr;
				}
			);
		}, 0);
	}

	ngOnDestroy() {
		if ((window as any).stxArr) {
			(window as any).stxArr.forEach((stx: any) => stx.destroy());
		}
		this.chartService.destroyChart();
	}
}
