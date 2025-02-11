import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FertigpcComponent } from './fertigpc.component';

describe('FertigpcComponent', () => {
  let component: FertigpcComponent;
  let fixture: ComponentFixture<FertigpcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FertigpcComponent]
    });
    fixture = TestBed.createComponent(FertigpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
