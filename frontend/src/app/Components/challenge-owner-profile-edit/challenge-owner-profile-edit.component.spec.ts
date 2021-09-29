import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerProfileEditComponent } from './challenge-owner-profile-edit.component';

describe('ChallengeOwnerProfileEditComponent', () => {
  let component: ChallengeOwnerProfileEditComponent;
  let fixture: ComponentFixture<ChallengeOwnerProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
