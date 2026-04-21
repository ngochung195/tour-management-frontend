import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { TourDetailService } from '../../../services/tour-detail.service';
import { TourDetail } from '../../../models/tour-detail.model';

import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-tour-detail.component.html',
  styleUrl: './manager-tour-detail.component.scss'
})
export class ManagerTourDetailComponent implements OnInit {

  tourDetails: TourDetail[] = [];
  filtered: TourDetail[] = [];
  paged: TourDetail[] = [];

  searchTour = '';
  searchHotel = '';
  searchVehicle = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private service: TourDetailService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.tourDetails = res;
      this.filtered = res;
      this.currentPage = 1;
      this.updatePagination();
    });
  }

  search() {

    this.filtered = this.tourDetails.filter(x =>
      (!this.searchTour || x.tourName?.toLowerCase().includes(this.searchTour.toLowerCase())) &&
      (!this.searchHotel || x.hotelName?.toLowerCase().includes(this.searchHotel.toLowerCase())) &&
      (!this.searchVehicle || x.vehicleName?.toLowerCase().includes(this.searchVehicle.toLowerCase()))
    );

    this.currentPage = 1;
    this.pageInput = null;
    this.updatePagination();
  }

  reset() {
    this.searchTour = '';
    this.searchHotel = '';
    this.searchVehicle = '';
    this.load();
  }

  updatePagination() {

    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);

    if (this.totalPages === 0) {
      this.paged = [];
      this.visiblePages = [];
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

    this.paged = this.filtered.slice(start, end);

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

    if (this.pageInput === null) return;

    let page = this.pageInput;

    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.changePage(page);
    this.pageInput = null;
  }

  goToCreate() {
    this.router.navigate(['/manager/tour-details/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/tour-details/edit', id]);
  }

  delete(id: number) {

    Swal.fire({
      title: 'Xóa chi tiết tour?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.service.delete(id).subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Xóa thành công');
          this.load();
        },
        error: () => {
          ToastUtil.error(this.toastr, 'Xóa thất bại');
        }
      });

    });
  }
}
