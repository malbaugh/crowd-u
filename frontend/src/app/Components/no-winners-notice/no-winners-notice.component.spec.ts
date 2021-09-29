import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoWinnersNoticeComponent } from './no-winners-notice.component';

describe('NoWinnersNoticeComponent', () => {
  let component: NoWinnersNoticeComponent;
  let fixture: ComponentFixture<NoWinnersNoticeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoWinnersNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoWinnersNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
