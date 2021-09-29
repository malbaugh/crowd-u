import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractProfileComponent } from './contract-profile.component';

describe('ContractProfileComponent', () => {
  let component: ContractProfileComponent;
  let fixture: ComponentFixture<ContractProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
