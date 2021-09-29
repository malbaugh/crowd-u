import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestProfileComponent } from './contest-profile.component';

describe('ContestProfileComponent', () => {
  let component: ContestProfileComponent;
  let fixture: ComponentFixture<ContestProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
