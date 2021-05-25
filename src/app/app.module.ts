import {
	NgModule,
	CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HelloWorldComponent } from './chartiq-hello-world/hello-world.component';
import { RouteListComponent } from './route-list/route-list.component';

@NgModule({
	declarations: [
		AppComponent,
		HelloWorldComponent,
		RouteListComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([
			{ path: '', component: RouteListComponent },
			{ path: 'list', component: RouteListComponent },
			{ path: 'hello-world', component: HelloWorldComponent },
			{
				path: '',
				loadChildren: () => import("./chartiq/chartiq.module")
					.then(m => m.ChartiqModule)
			},
			// Uncomment following lines if Active Trader module is available
			// {
			// 	path: 'active-trader',
			// 	loadChildren: () => import("./active-trader-workstation/active-trader-workstation.module")
			// 	.then(m => m.CryptoIQWorkstationModule)
			// },
			//  Uncomment following lines if Term Structure module is available
			// {
			// 	path: '',
			// 	loadChildren: () => import('./term-structure/term-structure.module')
			// 		.then(m => m.TermStructureModule)
			// },
			{
				path: 'custom-chart',
				loadChildren: () => import("./custom-chartiq/custom-chartiq.module")
					.then(m => m.ChartiqModule)
			},
    ])],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent],
})
export class AppModule {}
