import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../models/hotel.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-hotel.component.html',
  styleUrl: './manager-hotel.component.scss'
})
export class ManagerHotelComponent implements OnInit {

  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  pagedHotels: Hotel[] = [];

  searchName = '';
  searchAddress = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private hotelService: HotelService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels() {

    this.hotelService.getAll().subscribe({
      next: (res) => {
        this.hotels = res;
        this.filteredHotels = res;
        this.updatePagination();
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Không thể tải danh sách khách sạn');
      }
    });
  }

  searchHotel() {

    this.filteredHotels = this.hotels.filter(h => {

      const matchName = !this.searchName ||
        h.hotelName?.toLowerCase().includes(this.searchName.toLowerCase());

      const matchAddress = !this.searchAddress ||
        h.address?.toLowerCase().includes(this.searchAddress.toLowerCase());

      return matchName && matchAddress;
    });

    this.currentPage = 1;
    this.pageInput = null;
    this.updatePagination();
  }

  resetFilters() {
    this.searchName = '';
    this.searchAddress = '';
    this.filteredHotels = [...this.hotels];
    this.updatePagination();
  }

  updatePagination() {

    this.totalPages = Math.ceil(this.filteredHotels.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedHotels = [];
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

    this.pagedHotels = this.filteredHotels.slice(start, end);

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

    if (!this.pageInput) return;

    let page = this.pageInput;

    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.changePage(page);
    this.pageInput = null;
  }

  goToCreate() {
    this.router.navigate(['/manager/hotels/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/hotels/edit', id]);
  }

  deleteHotel(id: number) {

    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Xóa khách sạn này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.hotelService.deleteHotel(id).subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Xóa khách sạn thành công');
          this.loadHotels();
        },
        error: (err) => {
          ToastUtil.error(
            this.toastr,
            err?.error?.message || 'Không thể xóa khách sạn'
          );
        }
      });

    });
  }
}
