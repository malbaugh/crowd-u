import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantRegistrationComponent } from './participant-registration.component';

describe('ParticipantRegistrationComponent', () => {
  let component: ParticipantRegistrationComponent;
  let fixture: ComponentFixture<ParticipantRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
