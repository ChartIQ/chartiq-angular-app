import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Config } from 'chartiq/js/defaultConfiguration';

import { CIQ } from 'chartiq/js/componentUI';

interface ISymbols {
	[p: string]: {
		symbol: string;
		name: string;
		exchDisp: string;
		last: number;
		count: number;
	}
}

type SymbolChangeCbArgs = {
	symbol: string;
	symbolObject?: {
		name?: string;
		exchDisp?: string;
	};
	action: string
}

const {
	Chart,
	observeProperty,
	BaseComponent: {
		prototype: { channelRead, channelWrite, channelSubscribe }
	}
} = CIQ.UI;

/**
 * Creates the chart engine and UI.
 *
 * Service is expected to be used as a provider in a chart component such as AdvancedChart. The
 * component is responsible for providing configuration as a parameter and for the import of all
 * required resources for the chart such as market definitions, add-ons, and plug-ins.
 */
@Injectable()
export class CustomChartService {
	chart: CIQ.UI.Chart;
	stx?: CIQ.ChartEngine; // ChartEngine - https://documentation.chartiq.com/CIQ.ChartEngine.html
	uiContext?: CIQ.UI.Context; // UI Context - https://documentation.chartiq.com/CIQ.UI.Context.html
	channelSubscribe?: Function;

	store = new CIQ.NameValueStore();
	symbolStorageName = 'recentSymbols';
	shortcutStorageName = 'customDrawingToolShortcuts';

	breakpoint$ = new BehaviorSubject('');
	layout$ = new BehaviorSubject({});
	dialog$ = new BehaviorSubject('');

	drawingToolDetails: Record<string, string> = {
		elliottwave: `
			The Elliott Wave Theory was developed by Ralph Nelson Elliott to describe...
		`
	};

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
		// Prior to UI creation disable breakpoint setter to manage breakpoint setting using Angular tools.
		// This is not required and is used just as an integration example
		this.chart.breakpointSetter = () => () => {
			// console.log('breakpoint value', value);
		};

		config.menus.preferences.content = [
			...config.menus.preferences.content,
			{ type: "separator" },
			{ type: 'heading', label: 'Preferences' },
			{
				type: 'item',
				label: 'Drawing Tools',
				tap: 'Layout.openPreferences',
				value: 'drawingTools'
			}
		];

		const uiContext = this.chart.createChartAndUI({ container, config });

		this.stx = uiContext.stx;
		this.uiContext = uiContext;

		const { channels } = config;

		this.updateCustomization(config);

		// Attach channel methods to remove the need to provide stx parameter
		// taking advantage of stx availability as an instance member
		this.channelSubscribe = channelSubscribe;

		// Translate breakpoint channel into RxJs stream
		this.channelSubscribe(channels.breakpoint, (value: string) =>
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

		this.postInit(container);

		return uiContext;
	}

	postInit(container: HTMLElement) {
		this.addPreferencesHelper();
		portalizeContextDialogs(container);

		const self = this;
		const isForecasting = (symbol: string) => /_fcst$/.test(symbol);
		this.stx!.addEventListener(
			'symbolChange',
			({ symbol, symbolObject, action }: SymbolChangeCbArgs) => {
				if (
					!isForecasting(symbol) &&
					(action === 'master' || action === 'add-series')
				) {
					self.updateSymbolStore(symbol, symbolObject);
				}
			}
		);
	}

	updateCustomization(config: Config) {
		// currently only tool shortcuts are customized locally
		return this.getValue<Record<string, string>>(this.shortcutStorageName).then(shortcuts => {
			if (!shortcuts || !Object.keys(shortcuts).length) {
				return;
			}
			config.drawingTools.forEach((item) => {
				item.shortcut = shortcuts[item.tool] || '';
			});
		});
	}

	updateSymbolStore(symbol: string, { name = '', exchDisp = '' } = {}) {
		return this.getRecentSymbols().then((list) => {
			list = list || {};
			const count = (list[symbol]?.count || 0) + 1;
			list[symbol] = {
				symbol,
				name,
				exchDisp,
				count,
				last: +new Date()
			};
			return this.updateRecentSymbols(list);
		});
	}

	getRecentSymbols() {
		return this.getValue<ISymbols>(this.symbolStorageName);
	}

	updateRecentSymbols<T extends ISymbols>(value: T) {
		return this.setValue<T>(this.symbolStorageName, value);
	}

	getValue<T extends Record<string, string> | ISymbols>(name: string) {
		return new Promise<T>((resolve, reject) => {
			this.store.get(name, (err, value) => {
				if (err) return reject(err);
				resolve(<T>value);
			});
		});
	}

	setValue<T extends string | Record<string, any>>(name: string, value: T): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.store.set(name, value, (err) => {
				if (err) return reject(err);
				resolve(value);
			});
		});
	}

	addPreferencesHelper() {
		const layoutHelper = this.uiContext?.getAdvertised('Layout');

		if (layoutHelper) {
			layoutHelper.openPreferences = (node: HTMLElement, type: string) => this.openDialog(type);
		}
	}

	getDrawingTools() {
		const { drawingToolDetails: details } = this;

		return this.uiContext?.config?.drawingTools?.map(
			({ label, shortcut, tool }) => {
				return {
					label,
					tool,
					shortcut: shortcut || '',
					detail: details[tool]
				};
			}
		) || [];
	}

	setDrawingToolShortcuts(shortcuts: Record<string, string>) {
		const { config, topNode } = this.uiContext || {};

		config?.drawingTools?.forEach((item) => {
			item.shortcut = shortcuts[item.tool];
		});

		this.setValue(this.shortcutStorageName, shortcuts);

		if (topNode) {
			rebuildDrawingPalette(topNode);
		}
	}

	openDialog(name: string) {
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
function portalizeContextDialogs(container: HTMLElement) {
	container.querySelectorAll('cq-dialog').forEach(dialog => {
		dialog.remove();
		if (!dialogPortalized(dialog)) {
			document.body.appendChild(dialog);
		}
	});
}

function dialogPortalized(el: Element) {
	const tag = el.firstChild?.nodeName?.toLowerCase();
	const elements = tag ? Array.from(document.querySelectorAll(tag)) : [];
	return elements.some((element) => !element.closest("cq-context"));
}

function rebuildDrawingPalette(el: Element) {
	const qs = <T extends Element = Element>(path: string): T | null => el.querySelector(path);
	const container = qs('.palette-dock-container');
	const palette = qs<Element & { keyStroke: Function; handleMessage: Function }>('cq-drawing-palette');
	const newPalette = document.createElement('cq-drawing-palette');

	if (palette) {
		newPalette.className = palette.className;

		const qualifiedNames = ['docked', 'orientation', 'min-height'];

		qualifiedNames.forEach((qualifiedName) => {
			const attribute = palette.getAttribute(qualifiedName);

			if (attribute) {
				newPalette.setAttribute(qualifiedName, attribute);
			}
		});
		const noOp = () => {};
		palette.keyStroke = palette.handleMessage = noOp;
		palette.remove();
	}

	container?.appendChild(newPalette);
}
