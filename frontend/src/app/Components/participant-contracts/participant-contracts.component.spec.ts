import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantContractsComponent } from './participant-contracts.component';

describe('ParticipantContractsComponent', () => {
  let component: ParticipantContractsComponent;
  let fixture: ComponentFixture<ParticipantContractsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
