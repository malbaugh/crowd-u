import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractApplicationProfileEditComponent } from './contract-application-profile-edit.component';

describe('ContractApplicationProfileEditComponent', () => {
  let component: ContractApplicationProfileEditComponent;
  let fixture: ComponentFixture<ContractApplicationProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractApplicationProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractApplicationProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
