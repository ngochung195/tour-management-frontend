import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerTourService } from '../../../../services/manager-tour.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-tour',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.scss'
})
export class CreateTourComponent {
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
    private managerTourService: ManagerTourService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  saveTour() {
    this.managerTourService.createTour(this.tour).subscribe({
      next: () => {
        this.toastr.success('Thêm tour thành công');
        this.router.navigate(['/manager/tours']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Thêm tour thất bại")
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/tours']);
  }

  categories: any[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.managerTourService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }
}
