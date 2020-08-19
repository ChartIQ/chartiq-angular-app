import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { CIQ } from 'chartiq/js/componentUI';

const {
	Chart,
	observeProperty,
	BaseComponent: {
		prototype: { channelRead, channelWrite, channelSubscribe }
	}
} = CIQ.UI;

/**
 * Creates chart engine and UI
 *
 * Service is expected to be used as provider in a chart component such as AdvancedChart
 * The component is responsible for providing configuration as parameter and import of all
 * required resources chart for such as market definitions, addOns, plugins
 */
@Injectable()
export class ChartService {
	chart: any;
	stx: any; // ChartEngine - https://documentation.chartiq.com/CIQ.ChartEngine.html
	uiContext: any; // UI Context - https://documentation.chartiq.com/CIQ.UI.Context.html
	channelSubscribe: Function;

	breakpoint$ = new BehaviorSubject('');
	layout$ = new BehaviorSubject({});

	constructor() {
		this.chart = new Chart();
	}

	createChart(container: HTMLElement, config = null) {
		this.stx = this.chart.createChart(container, config);
		return this.stx;
	}

	createChartAndUI({ container, config }) {
		// Prior to UI creation disable breakpoint setter to manage breakpoint setting using Angular tools.
		// This is not required and is used just as an integration example
		this.chart.breakpointSetter = () => value => {
			// console.log('breakpoint value', value);
		};
		const uiContext = this.chart.createChartAndUI({ container, config });

		this.stx = uiContext.stx;
		this.uiContext = uiContext;

		const { channels } = config;

		// Attach channel methods to remove the need to provide stx parameter
		// taking advantage of stx availability as an instance member
		this.channelSubscribe = channelSubscribe;

		// Translate breakpoint channel into RxJs stream
		this.channelSubscribe(channels.breakpoint, value =>
			this.breakpoint$.next(value)
		);

		// Additional ways of capturing state changes in chart engine and UI

		// Create layout stream, see parameters at https://documentation.chartiq.com/global.html#layoutEventListener
		// stx.addEventListener('layout', ({ layout }) => this.layout$.next(layout));
		// Subscribe to created layout stream
		// this.layout$.subscribe((layout) => console.log('layout$.timeUnit = ' + layout['timeUnit']));

		// Observe a single property in engine layout
		// observeProperty(
		// 	'periodicity',
		// 	stx.layout,
		// 	({ value: periodicity }) => console.log('observed change in periodicity', periodicity )
		// );

		return uiContext;
	}
}
