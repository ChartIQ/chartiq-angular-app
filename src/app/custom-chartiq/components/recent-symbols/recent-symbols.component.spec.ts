import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentSymbolsComponent } from './recent-symbols.component';

describe('RecentSymbolsComponent', () => {
  let component: RecentSymbolsComponent;
  let fixture: ComponentFixture<RecentSymbolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [RecentSymbolsComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
