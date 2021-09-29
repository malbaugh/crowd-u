import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractApplicationProfileComponent } from './contract-application-profile.component';

describe('ContractApplicationProfileComponent', () => {
  let component: ContractApplicationProfileComponent;
  let fixture: ComponentFixture<ContractApplicationProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractApplicationProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractApplicationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
