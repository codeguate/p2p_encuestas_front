import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdecanesComponent } from './edecanes.component';

describe('EdecanesComponent', () => {
  let component: EdecanesComponent;
  let fixture: ComponentFixture<EdecanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdecanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdecanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
