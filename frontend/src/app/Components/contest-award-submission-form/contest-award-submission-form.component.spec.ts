import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestAwardSubmissionFormComponent } from './contest-award-submission-form.component';

describe('ContestAwardSubmissionFormComponent', () => {
  let component: ContestAwardSubmissionFormComponent;
  let fixture: ComponentFixture<ContestAwardSubmissionFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestAwardSubmissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestAwardSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
