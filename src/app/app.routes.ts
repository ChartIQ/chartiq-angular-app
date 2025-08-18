import { Routes } from '@angular/router';
import { HelloWorldComponent } from './chartiq-hello-world/hello-world.component';
import { RouteListComponent } from './route-list/route-list.component';

export const appRoutes: Routes = [
  { path: '', component: RouteListComponent },
  { path: 'list', component: RouteListComponent },
  { path: 'hello-world', component: HelloWorldComponent },
	{
    path: 'technical-analysis',
    loadComponent: () =>
      import('./chartiq/components').then(m => m.AdvancedChartComponent),
  },
  {
    path: 'custom-chart',
		loadComponent: () =>
			import('./custom-chartiq/components').then(m => m.CustomChartComponent),
  },
	{
    path: 'active-trader',
    loadComponent: () =>
      import('./active-trader-workstation/components').then(
        (m) => m.ActiveTraderComponent
      ),
  },
	{
    path: 'term-structure',
    loadComponent: () =>
      import('./term-structure/components/term-structure-wrapper.component').then(
        m => m.TermStructureWrapperComponent
      ),
  },
	{
    path: 'multi-chart',
		loadComponent: () =>
			import('./chartiq/components').then(m => m.MultiChartComponent),
  },
];
