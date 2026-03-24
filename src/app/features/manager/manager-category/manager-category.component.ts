import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerCategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Category } from '../../../models/category.model.';

@Component({
  selector: 'app-manager-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-category.component.html',
  styleUrl: './manager-category.component.scss'
})
export class ManagerCategoryComponent {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  pagedCategories: Category[] = [];

  searchName: string = '';
  searchStartDate: string = '';
  searchEndDate: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private managerCategoryService: ManagerCategoryService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.managerCategoryService.getAllCategories().subscribe(res => {
      this.categories = res;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredCategories = this.categories.filter(c => {
      return (!this.searchName || c.categoryName.toLowerCase().includes(this.searchName.toLocaleLowerCase()));
    });
    this.currentPage = 1;
    this.pageInput = null;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedCategories = [];
      this.visiblePages = [];
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.changePage(this.currentPage);
  }

  changePage(page: number) {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedCategories = this.filteredCategories.slice(start, end);

    this.calculateVisiblePages();
  }

  private calculateVisiblePages() {
    const range = 1;

    let start = this.currentPage - range;
    let end = this.currentPage + range;

    if (start < 1) {
      start = 1;
      end = Math.min(3, this.totalPages);
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, this.totalPages - 2);
    }

    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage() {
    if (this.pageInput && this.pageInput >= 1 && this.pageInput <= this.totalPages) {
      this.changePage(this.pageInput);
    }
    this.pageInput = null;
  }

  resetFilters() {
    this.searchName = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.applyFilters();
  }

  goToCreate() {
    this.router.navigate(['/manager/categories/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/categories/edit', id]);
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa danh mục?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.managerCategoryService.deleteCategory(id).subscribe({

          next: () => {
            this.toastr.success('Xóa danh mục thành công', 'Thành công');
            this.loadCategories();
          },

          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa danh mục',
              'Lỗi'
            );
          }

        });

      }

    });
  }
}
