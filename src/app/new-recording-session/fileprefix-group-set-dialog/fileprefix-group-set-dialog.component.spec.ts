import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileprefixGroupSetDialogComponent } from './fileprefix-group-set-dialog.component';

describe('FileprefixGroupSetDialogComponent', () => {
  let component: FileprefixGroupSetDialogComponent;
  let fixture: ComponentFixture<FileprefixGroupSetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileprefixGroupSetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileprefixGroupSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
