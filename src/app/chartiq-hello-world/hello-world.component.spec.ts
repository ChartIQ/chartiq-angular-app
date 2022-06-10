import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelloWorldComponent } from './hello-world.component';

describe('HelloWorldComponent', () => {
	let component: HelloWorldComponent;
	let fixture: ComponentFixture<HelloWorldComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
    declarations: [HelloWorldComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HelloWorldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
