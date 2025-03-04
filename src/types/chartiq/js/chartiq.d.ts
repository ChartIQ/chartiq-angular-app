import { CIQ } from 'chartiq/js/chartiq';
import 'chartiq/js/componentUI';
import { Config } from 'chartiq/js/defaultConfiguration';

declare module 'chartiq/js/chartiq' {
	export namespace CIQ {
		interface ChartEngine {
			moneyFlowChart: CIQ.Visualization;
		}
	}

	export namespace CIQ.UI {
		interface Helper {
			openPreferences?: (node: HTMLElement, type: string) => void;
		}

		interface Chart {
			createChart: (container: HTMLElement, config: Config | null) => CIQ.ChartEngine;
		}
	}
}

declare module 'chartiq/js/componentUI' {
	export namespace CIQ.UI {
		interface Context {
			config: Config;
		}
	}
}
