import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestSubmissionProfileEditComponent } from './contest-submission-profile-edit.component';

describe('ContestSubmissionProfileEditComponent', () => {
  let component: ContestSubmissionProfileEditComponent;
  let fixture: ComponentFixture<ContestSubmissionProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestSubmissionProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSubmissionProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
