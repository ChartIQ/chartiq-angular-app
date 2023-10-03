import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
	AdvancedChartComponent,
	AdvancedChartWrapperComponent,
} from './components';

@NgModule({
	declarations: [AdvancedChartComponent,  AdvancedChartWrapperComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{ path: 'technical-analysis', component: AdvancedChartWrapperComponent }
		])
	],
	exports: [AdvancedChartComponent, AdvancedChartWrapperComponent]
})
export class ChartiqModule {}
