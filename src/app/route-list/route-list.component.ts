import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-route-list',
    templateUrl: './route-list.component.html',
    styleUrls: ['./route-list.component.scss'],
    standalone: true,
  	imports: [CommonModule, RouterModule],
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RouteListComponent {
	constructor() {}
}
