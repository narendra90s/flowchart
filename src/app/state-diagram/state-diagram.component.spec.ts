import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateDiagramComponent } from './state-diagram.component';

describe('StateDiagramComponent', () => {
  let component: StateDiagramComponent;
  let fixture: ComponentFixture<StateDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
