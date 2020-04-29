import {
	NgModule,
	CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChartiqModule } from './chartiq/chartiq.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [BrowserModule, ChartiqModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent],
})
export class AppModule {}
