import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerCreateDepartmentFormComponent } from './challenge-owner-create-department-form.component';

describe('ChallengeOwnerCreateDepartmentFormComponent', () => {
  let component: ChallengeOwnerCreateDepartmentFormComponent;
  let fixture: ComponentFixture<ChallengeOwnerCreateDepartmentFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerCreateDepartmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerCreateDepartmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
