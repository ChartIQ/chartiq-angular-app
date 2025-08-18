import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';

/**
 * This import is used for automated testing of the chart library. It is not needed
 * for customer projects.
 */
import "./testInitialization";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes)],
}).catch(err => console.error(err));