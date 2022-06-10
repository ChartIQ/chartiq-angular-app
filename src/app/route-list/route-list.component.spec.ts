import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouteListComponent } from './route-list.component';

describe('RouteListComponent', () => {
	let component: RouteListComponent;
	let fixture: ComponentFixture<RouteListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
    declarations: [RouteListComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RouteListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
