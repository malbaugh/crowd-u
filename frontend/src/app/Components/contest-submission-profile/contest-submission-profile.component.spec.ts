import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestSubmissionProfileComponent } from './contest-submission-profile.component';

describe('ContestSubmissionProfileComponent', () => {
  let component: ContestSubmissionProfileComponent;
  let fixture: ComponentFixture<ContestSubmissionProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestSubmissionProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSubmissionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
