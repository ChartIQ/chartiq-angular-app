import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Config } from 'chartiq/js/defaultConfiguration.js';

import { CIQ } from 'chartiq/js/componentUI';

const {
	Chart,
	observeProperty,
	BaseComponent: {
		prototype: { channelRead, channelWrite, channelSubscribe },
	},
} = CIQ.UI;

/**
 * Creates the chart engine and UI.
 *
 * Service is expected to be used as a provider in a chart component such as AdvancedChart. The
 * component is responsible for providing configuration as a parameter and for the import of all
 * required resources for the chart such as market definitions, add-ons, and plug-ins.
 */
@Injectable()
export class ChartService {
	chart: CIQ.UI.Chart;
	stx?: CIQ.ChartEngine; // ChartEngine - https://documentation.chartiq.com/CIQ.ChartEngine.html
	uiContext?: CIQ.UI.Context; // UI Context - https://documentation.chartiq.com/CIQ.UI.Context.html
	channelSubscribe?: Function;

	breakpoint$ = new BehaviorSubject('');
	layout$ = new BehaviorSubject({});

	constructor() {
		this.chart = new Chart();
	}

	createChart(container: HTMLElement, config: Config | null = null) {
		this.stx = this.chart.createChart(container, config);
		return this.stx;
	}

	destroyChart() {
		if (this.stx) {
			this.stx.destroy();
			this.stx.draw = () => {};
		}
	}

	createChartAndUI({ container, config }: { container: HTMLElement; config: Config }) {
		const useStudyMenu = /studymenu=y/.test(document.location.href);
		if (useStudyMenu) {
			delete (CIQ.Studies as unknown as { Favorites?: object })['Favorites'];
		}

		setTimeout(() => {
			// Prior UI creation disable breakpoint setter to manage breakpoint setting using Angular tools.
			// This is not required and is used just as an integration example
			this.chart.breakpointSetter = () => () => {
				// console.log('breakpoint value', value);
			};
			const uiContext = this.chart.createChartAndUI({ container, config });

			this.stx = uiContext.stx;
			this.uiContext = uiContext;

			const { channels } = config || {};

			// Attach channel methods to remove the need to provide stx parameter
			// taking advantage of stx availability as an instance member
			this.channelSubscribe = channelSubscribe;

			// Translate breakpoint channel in RxJs stream
			this.channelSubscribe(channels?.breakpoint, (value: string) =>
				this.breakpoint$.next(value)
			);

			// Additional ways of capturing state changes in chart engine and UI

			// Create layout stream, see parameters at https://documentation.chartiq.com/global.html#layoutEventListener
			// this.stx.addEventListener('layout', ({ layout }) => this.layout$.next(layout));
			// Subscribe to created layout stream
			// this.layout$.subscribe((layout) => console.log('layout$.timeUnit = ' + (layout['timeUnit'] || 'day')));

			// Observe a single property in engine layout
			// observeProperty(
			// 	'periodicity',
			// 	this.stx.layout,
			// 	({ value: periodicity }) => console.log('observed change in periodicity', periodicity )
			// );

			// Simulate L2 data using https://documentation.chartiq.com/CIQ.ChartEngine.html#updateCurrentMarketData
			// CIQ['simulateL2']({ stx: this.stx, onInterval: 1000, onTrade: true });
		}, 0);
	}
}
