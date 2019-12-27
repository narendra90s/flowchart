import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddactiondialogComponent } from './addactiondialog.component';

describe('AddactiondialogComponent', () => {
  let component: AddactiondialogComponent;
  let fixture: ComponentFixture<AddactiondialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddactiondialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddactiondialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
