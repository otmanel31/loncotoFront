import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningInterventionComponent } from './planning-intervention.component';

describe('PlanningInterventionComponent', () => {
  let component: PlanningInterventionComponent;
  let fixture: ComponentFixture<PlanningInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
