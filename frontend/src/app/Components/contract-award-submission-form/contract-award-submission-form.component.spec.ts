import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractAwardSubmissionFormComponent } from './contract-award-submission-form.component';

describe('ContractAwardSubmissionFormComponent', () => {
  let component: ContractAwardSubmissionFormComponent;
  let fixture: ComponentFixture<ContractAwardSubmissionFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractAwardSubmissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAwardSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
