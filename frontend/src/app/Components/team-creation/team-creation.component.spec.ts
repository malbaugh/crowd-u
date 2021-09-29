import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamCreationComponent } from './team-creation.component';

describe('TeamCreationComponent', () => {
  let component: TeamCreationComponent;
  let fixture: ComponentFixture<TeamCreationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
