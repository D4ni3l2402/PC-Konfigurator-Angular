import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonfiguratorComponent } from './konfigurator.component';

describe('KonfiguratorComponent', () => {
  let component: KonfiguratorComponent;
  let fixture: ComponentFixture<KonfiguratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonfiguratorComponent]
    });
    fixture = TestBed.createComponent(KonfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
