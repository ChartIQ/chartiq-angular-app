import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
	CustomChartComponent,
	RecentSymbolsComponent,
	ShortcutDialogComponent
} from './components';

@NgModule({
	declarations: [
		CustomChartComponent,
		RecentSymbolsComponent,
		ShortcutDialogComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: CustomChartComponent }])
	],
	exports: [CustomChartComponent, ShortcutDialogComponent]
})
export class ChartiqModule {}
