import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantAccountEditComponent } from './participant-account-edit.component';

describe('ParticipantAccountEditComponent', () => {
  let component: ParticipantAccountEditComponent;
  let fixture: ComponentFixture<ParticipantAccountEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantAccountEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
