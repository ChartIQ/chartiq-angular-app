import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
		schemas: [CUSTOM_ELEMENTS_SCHEMA],
		imports: [CommonModule, RouterOutlet],
})
export class AppComponent {}
