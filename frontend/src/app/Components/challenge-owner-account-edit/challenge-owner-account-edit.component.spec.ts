import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerAccountEditComponent } from './challenge-owner-account-edit.component';

describe('ChallengeOwnerAccountEditComponent', () => {
  let component: ChallengeOwnerAccountEditComponent;
  let fixture: ComponentFixture<ChallengeOwnerAccountEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerAccountEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
