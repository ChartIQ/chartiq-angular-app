import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
	AdvancedChartComponent,
	AdvancedChartWrapperComponent,
	MultiChartComponent
} from './components';

@NgModule({
	declarations: [AdvancedChartComponent, MultiChartComponent, AdvancedChartWrapperComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{ path: 'technical-analysis', component: AdvancedChartWrapperComponent }
		])
	],
	exports: [AdvancedChartComponent, AdvancedChartWrapperComponent, MultiChartComponent]
})
export class ChartiqModule {}
