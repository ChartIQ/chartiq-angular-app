import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveTraderComponent } from './active-trader.component';

describe('ActiveTraderComponent', () => {
  let component: ActiveTraderComponent;
  let fixture: ComponentFixture<ActiveTraderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ActiveTraderComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
