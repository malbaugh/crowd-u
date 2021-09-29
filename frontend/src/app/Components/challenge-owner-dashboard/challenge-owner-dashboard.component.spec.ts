import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeOwnerDashboardComponent } from './challenge-owner-dashboard.component';

describe('ChallengeOwnerDashboardComponent', () => {
  let component: ChallengeOwnerDashboardComponent;
  let fixture: ComponentFixture<ChallengeOwnerDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeOwnerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
