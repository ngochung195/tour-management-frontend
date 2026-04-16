import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourDetailComponent } from './create-tour-detail.component';

describe('CreateTourDetailComponent', () => {
  let component: CreateTourDetailComponent;
  let fixture: ComponentFixture<CreateTourDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTourDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
