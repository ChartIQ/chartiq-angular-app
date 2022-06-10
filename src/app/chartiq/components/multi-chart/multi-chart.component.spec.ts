import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiChartComponent } from './multi-chart.component';

describe('MultiChartComponent', () => {
  let component: MultiChartComponent;
  let fixture: ComponentFixture<MultiChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MultiChartComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
