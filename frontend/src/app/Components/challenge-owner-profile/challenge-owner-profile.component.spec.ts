import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerProfileComponent } from './challenge-owner-profile.component';

describe('ChallengeOwnerProfileComponent', () => {
  let component: ChallengeOwnerProfileComponent;
  let fixture: ComponentFixture<ChallengeOwnerProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
