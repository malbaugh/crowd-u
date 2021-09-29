import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestProfileSponsorEditComponent } from './contest-profile-sponsor-edit.component';

describe('ContestProfileSponsorEditComponent', () => {
  let component: ContestProfileSponsorEditComponent;
  let fixture: ComponentFixture<ContestProfileSponsorEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProfileSponsorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProfileSponsorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
