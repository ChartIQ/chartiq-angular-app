import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdvancedChartComponent, MultiChartComponent } from './components';

@NgModule({
	declarations: [AdvancedChartComponent, MultiChartComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{ path: 'technical-analysis', component: AdvancedChartComponent },
			{ path: 'multi-chart', component: MultiChartComponent }
		])
	],
	exports: [AdvancedChartComponent, MultiChartComponent]
})
export class ChartiqModule {}
