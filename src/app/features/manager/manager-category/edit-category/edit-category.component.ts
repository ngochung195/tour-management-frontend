import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManagerCategoryService } from '../../../../services/category.service';


@Component({
  selector: 'app-manager-edit-category',
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
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.managerCategoryService.getCategoryById(id).subscribe(res => {
        this.category = res;
      });
    }
  }

  updateCategory() {
    this.managerCategoryService.updateCategory(this.category.id, this.category).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thành công');
        this.router.navigate(['/manager/categories']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }

}
