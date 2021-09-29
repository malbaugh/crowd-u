import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengerRegistrationComponent } from './challenger-registration.component';

describe('ChallengerRegistrationComponent', () => {
  let component: ChallengerRegistrationComponent;
  let fixture: ComponentFixture<ChallengerRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengerRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
