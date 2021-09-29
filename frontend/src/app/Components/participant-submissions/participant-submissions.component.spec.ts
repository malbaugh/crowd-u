import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantSubmissionsComponent } from './participant-submissions.component';

describe('ParticipantSubmissionsComponent', () => {
  let component: ParticipantSubmissionsComponent;
  let fixture: ComponentFixture<ParticipantSubmissionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
