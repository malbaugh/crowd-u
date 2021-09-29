import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantProfileAboutEditComponent } from './participant-profile-about-edit.component';

describe('ParticipantProfileAboutEditComponent', () => {
  let component: ParticipantProfileAboutEditComponent;
  let fixture: ComponentFixture<ParticipantProfileAboutEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantProfileAboutEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantProfileAboutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
