import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTraderComponent } from './active-trader.component';

describe('ActiveTraderComponent', () => {
  let component: ActiveTraderComponent;
  let fixture: ComponentFixture<ActiveTraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveTraderComponent ]
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
