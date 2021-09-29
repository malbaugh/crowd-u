import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestProfileEditComponent } from './contest-profile-edit.component';

describe('ContestProfileEditComponent', () => {
  let component: ContestProfileEditComponent;
  let fixture: ComponentFixture<ContestProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
