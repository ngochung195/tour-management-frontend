import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerCategoryService } from '../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

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
  ) { }

  saveCategory() {
    this.managerCategoryService.createCategory(this.category).subscribe({
      next: () => {
        this.toastr.success('Thêm danh mục thành công');
        this.router.navigate(['/manager/categories']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Thêm danh mục thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/categories']);
  }


}
