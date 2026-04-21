import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerCategoryService } from '../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-create-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class ManagerCreateCategoryComponent {

  category: any = {
    categoryName: '',
    decription: ''
  };

  constructor(
    private managerCategoryService: ManagerCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  saveCategory() {

    if (ValidationUtil.isEmpty(this.category.categoryName)) {
      ToastUtil.warning(this.toastr, 'Tên danh mục không được để trống');
      return;
    }


    this.managerCategoryService.createCategory(this.category).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm danh mục thành công');
        this.router.navigate(['/manager/categories']);
      },
      error: (err) => {
        ToastUtil.error(
          this.toastr,
          err?.error?.message || 'Không thể thêm danh mục'
        );
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/categories']);
  }
}
