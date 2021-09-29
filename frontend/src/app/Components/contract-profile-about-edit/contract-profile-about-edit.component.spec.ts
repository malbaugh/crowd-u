import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractProfileAboutEditComponent } from './contract-profile-about-edit.component';

describe('ContractProfileAboutEditComponent', () => {
  let component: ContractProfileAboutEditComponent;
  let fixture: ComponentFixture<ContractProfileAboutEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractProfileAboutEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractProfileAboutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
