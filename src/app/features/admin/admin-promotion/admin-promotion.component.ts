import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PromotionService } from '../../../services/promotion.service';
import { Promotion } from '../../../models/promotion.model';

@Component({
  selector: 'app-admin-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-promotion.component.html',
  styleUrl: './admin-promotion.component.scss'
})
export class AdminPromotionComponent implements OnInit {

  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  pagedPromotions: Promotion[] = [];

  searchCode = '';
  searchStartDate = '';
  searchEndDate = '';
  searchStatus = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private promotionService: PromotionService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions() {
    this.promotionService.getAll().subscribe(res => {
      this.promotions = res;
      this.filteredPromotions = res;
      this.updatePagination();
    });
  }

  searchPromotion() {
    this.promotionService.search(
      this.searchCode,
      this.searchStartDate,
      this.searchEndDate,
      this.searchStatus
    ).subscribe(res => {
      this.filteredPromotions = res;
      this.currentPage = 1;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPromotions.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedPromotions = [];
      this.visiblePages = [];
      return;
    }

    this.changePage(1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedPromotions = this.filteredPromotions.slice(start, end);

    this.calculateVisiblePages();
  }

  calculateVisiblePages() {
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
    if (this.pageInput === null) {
      return;
    }

    let page = this.pageInput;

    if (page < 1) {
      page = 1;
    }

    if (page > this.totalPages) {
      page = this.totalPages;
    }

    this.changePage(page);

    this.pageInput = null;
  }
  resetFilters() {
    this.searchCode = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.searchStatus = '';
    this.loadPromotions();
  }

  goToCreate() {
    this.router.navigate(['/admin/promotions/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/admin/promotions/edit', id]);
  }

  deletePromotion(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa khuyến mãi?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.promotionService.delete(id).subscribe({

          next: () => {
            this.toastr.success('Xóa khuyến mãi thành công', 'Thành công');
            this.loadPromotions();
          },

          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa khuyến mãi',
              'Lỗi'
            );
          }

        });

      }

    });
  }
}
