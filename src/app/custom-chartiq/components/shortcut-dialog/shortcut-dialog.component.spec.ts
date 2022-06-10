import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShortcutDialogComponent } from './shortcut-dialog.component';

describe('ShortcutDialogComponent', () => {
  let component: ShortcutDialogComponent;
  let fixture: ComponentFixture<ShortcutDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ShortcutDialogComponent],
    teardown: { destroyAfterEach: false }
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
