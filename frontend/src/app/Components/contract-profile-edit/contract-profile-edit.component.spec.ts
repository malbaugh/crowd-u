import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractProfileEditComponent } from './contract-profile-edit.component';

describe('ContractProfileEditComponent', () => {
  let component: ContractProfileEditComponent;
  let fixture: ComponentFixture<ContractProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
