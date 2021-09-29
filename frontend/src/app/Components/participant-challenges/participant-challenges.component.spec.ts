import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantChallengesComponent } from './participant-challenges.component';

describe('ParticipantChallengesComponent', () => {
  let component: ParticipantChallengesComponent;
  let fixture: ComponentFixture<ParticipantChallengesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantChallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
