import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
	AdvancedChartComponent,
	HelloWorldComponent,
} from './components';

@NgModule({
	declarations: [
		HelloWorldComponent, 
		AdvancedChartComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule
	],
	exports: [
		HelloWorldComponent, 
		AdvancedChartComponent
	]
})
export class ChartiqModule { }
