import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.scss'
})
export class AdminBookingComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  pagedBookings: Booking[] = [];

  searchTour = '';
  searchUser = '';
  searchDate = '';
  searchStatus = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private BookingService: BookingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.BookingService.getAll().subscribe(data => {
      console.log(data);
      this.bookings = data;
      this.filteredBookings = [...data];
      this.updatePagination();
    });
  }

  deleteBooking(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.BookingService.deleteBooking(id).subscribe({

          next: () => {
            this.toastr.success('Xóa booking thành công', 'Thành công');
            this.loadBookings();
          },

          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa booking',
              'Lỗi'
            );
          }

        });

      }

    });
  }

  applyFilters() {

    this.filteredBookings = this.bookings.filter(b => {

      const matchTour =
        !this.searchTour ||
        b.tourName?.toLowerCase().includes(this.searchTour.toLowerCase());

      const matchUser =
        !this.searchUser ||
        b.userName?.toLowerCase().includes(this.searchUser.toLowerCase());

      const matchStatus =
        !this.searchStatus ||
        b.status === this.searchStatus;

      const matchDate =
        !this.searchDate ||
        new Date(b.bookingDate).toISOString().slice(0, 10) === this.searchDate;

      return matchTour && matchUser && matchStatus && matchDate;
    });

    this.currentPage = 1;
    this.pageInput = null;
    this.updatePagination();
  }

  resetFilters() {
    this.searchTour = '';
    this.searchUser = '';
    this.searchDate = '';
    this.searchStatus = '';
    this.filteredBookings = [...this.bookings];
    this.currentPage = 1;
    this.pageInput = null;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);

    if (this.totalPages === 0) {
      this.pagedBookings = [];
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

    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedBookings = this.filteredBookings.slice(startIndex, endIndex);

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

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'APPROVED': return 'Đã xác nhận';
      case 'REJECTED': return 'Bị từ chối';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}
