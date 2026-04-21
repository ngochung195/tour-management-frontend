import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../../../services/tour.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-create-tour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.scss'
})
export class ManagerCreateTourComponent {

  tour: any = {
    tourName: '',
    categoryId: null,
    quantity: 0,
    price: 0,
    startDate: '',
    endDate: '',
    description: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  categories: any[] = [];

  constructor(
    private tourService: TourService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  goBack() {
    this.router.navigate(['/manager/tours']);
  }

  loadCategories() {
    this.tourService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.tour.tourName)) {
      ToastUtil.warning(this.toastr, 'Tên tour không được để trống');
      return false;
    }

    if (ValidationUtil.isEmpty(this.tour.categoryId)) {
      ToastUtil.warning(this.toastr, 'Vui lòng chọn danh mục');
      return false;
    }

    if (this.tour.price <= 0) {
      ToastUtil.warning(this.toastr, 'Giá phải lớn hơn 0');
      return false;
    }

    if (this.tour.quantity <= 0) {
      ToastUtil.warning(this.toastr, 'Số lượng phải lớn hơn 0');
      return false;
    }

    return true;
  }

  saveTour() {

    if (!this.validateForm()) return;

    const formData = new FormData();
    formData.append('tourName', this.tour.tourName);
    formData.append('categoryId', this.tour.categoryId);
    formData.append('price', this.tour.price);
    formData.append('quantity', this.tour.quantity);
    formData.append('startDate', this.tour.startDate);
    formData.append('endDate', this.tour.endDate);
    formData.append('description', this.tour.description);

    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    this.tourService.createTour(formData).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm tour thành công');
        this.router.navigate(['/manager/tours']);
      },
      error: (err) => {
        ToastUtil.error(this.toastr, err?.error?.message || 'Thêm tour thất bại');
      }
    });
  }
}
