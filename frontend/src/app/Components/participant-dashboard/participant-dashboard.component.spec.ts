import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantDashboardComponent } from './participant-dashboard.component';

describe('ParticipantDashboardComponent', () => {
  let component: ParticipantDashboardComponent;
  let fixture: ComponentFixture<ParticipantDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
