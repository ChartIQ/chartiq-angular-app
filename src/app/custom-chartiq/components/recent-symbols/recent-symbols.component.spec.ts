import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSymbolsComponent } from './recent-symbols.component';

describe('RecentSymbolsComponent', () => {
  let component: RecentSymbolsComponent;
  let fixture: ComponentFixture<RecentSymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentSymbolsComponent ]
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
