import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTourDetailComponent } from './edit-tour-detail.component';

describe('EditTourDetailComponent', () => {
  let component: EditTourDetailComponent;
  let fixture: ComponentFixture<EditTourDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTourDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
