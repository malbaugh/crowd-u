import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerProfileAboutEditComponent } from './challenge-owner-profile-about-edit.component';

describe('ChallengeOwnerProfileAboutEditComponent', () => {
  let component: ChallengeOwnerProfileAboutEditComponent;
  let fixture: ComponentFixture<ChallengeOwnerProfileAboutEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerProfileAboutEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerProfileAboutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
