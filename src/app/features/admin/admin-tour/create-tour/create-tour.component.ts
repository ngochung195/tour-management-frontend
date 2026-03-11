import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../../../services/tour.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-create-tour',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.scss'
})
export class AdminCreateTourComponent {
  tour: any = {
    tourName: '',
    categoryId: null,
    quantity: 0,
    price: 0,
    startDate: '',
    endDate: '',
    description: ''
  };

  constructor(
    private tourService: TourService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  saveTour() {
    this.tourService.createTour(this.tour).subscribe({
      next: () => {
        this.toastr.success('Thêm tour thành công');
        this.router.navigate(['/admin/tours']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Thêm tour thất bại")
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/tours']);
  }

  categories: any[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.tourService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }
}
