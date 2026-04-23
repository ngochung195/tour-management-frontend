import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../../services/tour.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

import { ValidationUtil } from '../../../../shared/utils/validation.util';

@Component({
  selector: 'app-admin-edit-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-tour.component.html',
  styleUrl: './edit-tour.component.scss'
})
export class AdminEditTourComponent implements OnInit {

  tour: any = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  categories: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.tourService.getById(id).subscribe(res => {
        this.tour = res;
      });
    }
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
      this.toastr.warning('Tên tour không được để trống');
      return false;
    }

    if (ValidationUtil.isEmpty(this.tour.categoryId)) {
      this.toastr.warning('Vui lòng chọn danh mục');
      return false;
    }

    if (this.tour.price <= 0) {
      this.toastr.warning('Giá phải lớn hơn 0');
      return false;
    }

    if (this.tour.quantity <= 0) {
      this.toastr.warning('Số lượng phải lớn hơn 0');
      return false;
    }

    if (ValidationUtil.isEmpty(this.tour.startDate)) {
      this.toastr.warning('Vui lòng chọn ngày bắt đầu');
      return false;
    }

    if (ValidationUtil.isEmpty(this.tour.endDate)) {
      this.toastr.warning('Vui lòng chọn ngày kết thúc');
      return false;
    }

    if (new Date(this.tour.startDate) > new Date(this.tour.endDate)) {
      this.toastr.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }

    return true;
  }

  updateTour() {

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

    this.tourService.updateTour(this.tour.id, formData).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thành công');
        this.router.navigate(['/admin/tours']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Cập nhật thất bại");
      }
    });
  }
}
