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
export class CustomChartService {
	chart: any;
	stx: any; // ChartEngine - https://documentation.chartiq.com/CIQ.ChartEngine.html
	uiContext: any; // UI Context - https://documentation.chartiq.com/CIQ.UI.Context.html
	channelSubscribe: Function;

	store = new CIQ.NameValueStore();
	symbolStorageName = 'recentSymbols';
	shortcutStorageName = 'customDrawingToolShortcuts';

	breakpoint$ = new BehaviorSubject('');
	layout$ = new BehaviorSubject({});
	dialog$ = new BehaviorSubject('');

	drawingToolDetails = {
		elliottwave: `
			The Elliott Wave Theory was developed by Ralph Nelson Elliott to describe...
		`
	};

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

		this.updateCustomization(config);

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

		this.postInit(container);

		return uiContext;
	}

	postInit(container) {
		this.addPreferencesHelper();
		portalizeContextDialogs(container);

		const self = this;
		const isForecasting = symbol => /_fcst$/.test(symbol);
		this.stx.addEventListener(
			'symbolChange',
			({ symbol, symbolObject, action }) => {
				if (
					!isForecasting(symbol) &&
					(action === 'master' || action === 'add-series')
				) {
					self.updateSymbolStore(symbol, symbolObject);
				}
			}
		);
	}

	updateCustomization(config): Promise<void> {
		// currently only tool shortcuts are customized locally
		return this.getValue(this.shortcutStorageName).then(shortcuts => {
			if (!shortcuts || !Object.keys(shortcuts).length) {
				return;
			}
			config.drawingTools.forEach(item => {
				item.shortcut = shortcuts[item.tool] || '';
			});
		});
	}

	updateSymbolStore(symbol, { name = '', exchDisp = '' } = {}) {
		return this.getRecentSymbols().then(list => {
			const count = ((list.symbol && list.symbol.count) || 0) + 1;
			list[symbol] = { symbol, name, exchDisp, count, last: +new Date() };
			return this.updateRecentSymbols(list);
		});
	}

	getRecentSymbols(): Promise<
		Record<
			string,
			{
				symbol: string;
				name: string;
				exchDisp: string;
				last: number;
				count: number;
			}
		>
	> {
		return this.getValue(this.symbolStorageName);
	}

	updateRecentSymbols(value) {
		return this.setValue(this.symbolStorageName, value);
	}

	getValue(name): Promise<any> {
		return new Promise((resolve, reject) => {
			this.store.get(name, (err, value) => {
				if (err) return reject(err);
				resolve(value || {});
			});
		});
	}

	setValue(name, value): Promise<any> {
		return new Promise((resolve, reject) => {
			this.store.set(name, value, err => {
				if (err) return reject(err);
				resolve(value);
			});
		});
	}

	addPreferencesHelper() {
		const layoutHelper = this.uiContext.getAdvertised('Layout');
		layoutHelper.openPreferences = (node, type) => this.openDialog(type);
	}

	getDrawingTools(): {
		label: string;
		tool: string;
		shortcut: string;
		detail: string;
	}[] {
		const { drawingToolDetails: details } = this;

		return this.uiContext.config.drawingTools.map(
			({ label, shortcut, tool }) => {
				return {
					label,
					tool,
					shortcut: shortcut || '',
					detail: details[tool]
				};
			}
		);
	}

	setDrawingToolShortcuts(shortcuts) {
		const { config, topNode } = this.uiContext;

		config.drawingTools.forEach(item => {
			item.shortcut = shortcuts[item.tool];
		});

		this.setValue(this.shortcutStorageName, shortcuts);

		rebuildDrawingPalette(topNode);
	}

	openDialog(name) {
		this.dialog$.next(name);
	}

	closeDialog() {
		this.dialog$.next('');
	}
}

/**
 * For applications that have more then one chart, keep single dialog of the same type
 * and move it outside context node to be shared by all chart components
 */
function portalizeContextDialogs(container) {
	container.querySelectorAll('cq-dialog').forEach(dialog => {
		dialog.remove();
		if (!dialogPortalized(dialog)) {
			document.body.appendChild(dialog);
		}
	});
}

function dialogPortalized(el) {
	const tag = el.firstChild.nodeName.toLowerCase();
	return Array.from(document.querySelectorAll(tag)).some(
		el => !CIQ.findClosestParent(el, 'cq-context')
	);
}

function rebuildDrawingPalette(el) {
	const qs = path => el.querySelector(path);
	const container = qs('.palette-dock-container');
	const palette = qs('cq-drawing-palette');
	const newPalette = document.createElement('cq-drawing-palette');

	newPalette.className = palette.className;
	newPalette.setAttribute('docked', palette.getAttribute('docked'));
	newPalette.setAttribute('orientation', palette.getAttribute('orientation'));
	newPalette.setAttribute('min-height', palette.getAttribute('min-height'));
	const noOp = () => {};
	palette.keyStroke = palette.handleMessage = noOp;
	palette.remove();

	container.appendChild(newPalette);
}
