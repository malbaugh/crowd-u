import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractTeamSelectionComponent } from './contract-team-selection.component';

describe('ContractTeamSelectionComponent', () => {
  let component: ContractTeamSelectionComponent;
  let fixture: ComponentFixture<ContractTeamSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractTeamSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTeamSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
