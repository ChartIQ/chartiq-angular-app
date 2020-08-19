import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActiveTraderComponent } from './components';

@NgModule({
	declarations: [ActiveTraderComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: ActiveTraderComponent }])
	],
	exports: [ActiveTraderComponent]
})
export class CryptoIQWorkstationModule {}
