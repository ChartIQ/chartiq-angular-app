import { CIQ } from 'chartiq/js/chartiq';
import 'chartiq/js/componentUI';
import { Config } from 'chartiq/js/defaultConfiguration';

declare module 'chartiq/js/chartiq' {
	export namespace CIQ {
		interface ChartEngine {
			moneyFlowChart: CIQ.Visualization;
		}
		namespace ReferenceData {
			interface Registry {}
			interface QuoteFeed {}
		}
	}

	export namespace CIQ.UI {
		interface Helper {
			openPreferences?: (node: HTMLElement, type: string) => void;
		}

		interface Chart {
			createChart: (container: HTMLElement, config: Config | null) => CIQ.ChartEngine;
		}
		interface ColorPicker {}
		interface scrollbarStyling{}
	}
}

declare global {
	// Expose CIQ as a global value/type and declare the UI sub-namespace so external d.ts can reference CIQ.UI.*
	const CIQ: typeof import("chartiq/js/chartiq").CIQ;
	namespace CIQ {
		namespace UI {
			interface ModalTag extends HTMLElement {}
			interface KeystrokeHub {}
			interface Context {}
		}
	}
}
