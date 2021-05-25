import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TermStructureComponent, TermStructureWrapperComponent } from './components';

@NgModule({
	declarations: [TermStructureComponent, TermStructureWrapperComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{ path: 'term-structure', component: TermStructureWrapperComponent },
		])
	],
	exports: [TermStructureComponent, TermStructureWrapperComponent]
})
export class TermStructureModule {}
