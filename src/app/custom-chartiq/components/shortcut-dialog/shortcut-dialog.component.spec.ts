import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutDialogComponent } from './shortcut-dialog.component';

describe('ShortcutDialogComponent', () => {
  let component: ShortcutDialogComponent;
  let fixture: ComponentFixture<ShortcutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
