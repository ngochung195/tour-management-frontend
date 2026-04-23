import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRevenueComponent } from './admin-revenue.component';

describe('AdminRevenueComponent', () => {
  let component: AdminRevenueComponent;
  let fixture: ComponentFixture<AdminRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
