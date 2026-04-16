import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTourDetailComponent } from './manager-tour-detail.component';

describe('ManagerTourDetailComponent', () => {
  let component: ManagerTourDetailComponent;
  let fixture: ComponentFixture<ManagerTourDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTourDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
