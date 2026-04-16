import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerItineraryComponent } from './manager-itinerary.component';

describe('ManagerItineraryComponent', () => {
  let component: ManagerItineraryComponent;
  let fixture: ComponentFixture<ManagerItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerItineraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
