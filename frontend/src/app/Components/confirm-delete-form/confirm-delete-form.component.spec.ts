import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmDeleteFormComponent } from './confirm-delete-form.component';

describe('ConfirmDeleteFormComponent', () => {
  let component: ConfirmDeleteFormComponent;
  let fixture: ComponentFixture<ConfirmDeleteFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
