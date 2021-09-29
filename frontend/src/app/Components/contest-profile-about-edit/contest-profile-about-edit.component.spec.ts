import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestProfileAboutEditComponent } from './contest-profile-about-edit.component';

describe('ContestProfileAboutEditComponent', () => {
  let component: ContestProfileAboutEditComponent;
  let fixture: ComponentFixture<ContestProfileAboutEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProfileAboutEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProfileAboutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
