import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractProfileSponsorEditComponent } from './contract-profile-sponsor-edit.component';

describe('ContractProfileSponsorEditComponent', () => {
  let component: ContractProfileSponsorEditComponent;
  let fixture: ComponentFixture<ContractProfileSponsorEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractProfileSponsorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractProfileSponsorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
