import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LandingSearchComponent } from './landing-search.component';

describe('LandingSearchComponent', () => {
  let component: LandingSearchComponent;
  let fixture: ComponentFixture<LandingSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
