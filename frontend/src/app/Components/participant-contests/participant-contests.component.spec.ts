import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantContestsComponent } from './participant-contests.component';

describe('ParticipantContestsComponent', () => {
  let component: ParticipantContestsComponent;
  let fixture: ComponentFixture<ParticipantContestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantContestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
