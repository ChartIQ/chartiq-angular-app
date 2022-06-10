import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedChartComponent } from './advanced-chart.component';

describe('AdvancedChartComponent', () => {
  let component: AdvancedChartComponent;
  let fixture: ComponentFixture<AdvancedChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AdvancedChartComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
