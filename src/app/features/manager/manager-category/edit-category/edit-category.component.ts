import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManagerCategoryService } from '../../../../services/category.service';
import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class ManagerEditCategoryComponent implements OnInit {

  category: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private managerCategoryService: ManagerCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (id) {
      this.managerCategoryService.getCategoryById(id).subscribe({
        next: (res) => {
          this.category = res;
        },
        error: () => {
          ToastUtil.error(this.toastr, 'Không tìm thấy danh mục');
          this.router.navigate(['/manager/categories']);
        }
      });
    }
  }

  updateCategory() {

    if (ValidationUtil.isEmpty(this.category.categoryName)) {
      ToastUtil.warning(this.toastr, 'Tên danh mục không được để trống');
      return;
    }

    this.managerCategoryService.updateCategory(this.category.id, this.category).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Cập nhật thành công');
        this.router.navigate(['/manager/categories']);
      },
      error: (err) => {
        ToastUtil.error(
          this.toastr,
          err?.error?.message || 'Không thể cập nhật danh mục'
        );
      }
    });
  }
}
