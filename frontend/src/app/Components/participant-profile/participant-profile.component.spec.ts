import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantProfileComponent } from './participant-profile.component';

describe('ParticipantProfileComponent', () => {
  let component: ParticipantProfileComponent;
  let fixture: ComponentFixture<ParticipantProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
