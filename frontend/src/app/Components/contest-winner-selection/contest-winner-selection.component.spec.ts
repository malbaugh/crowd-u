import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContestWinnerSelectionComponent } from './contest-winner-selection.component';

describe('ContestWinnerSelectionComponent', () => {
  let component: ContestWinnerSelectionComponent;
  let fixture: ComponentFixture<ContestWinnerSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestWinnerSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestWinnerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
