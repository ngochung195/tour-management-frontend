import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class MyBookingComponent implements OnInit {

  bookings: any[] = [];
  filteredBookings: any[] = [];
  paginatedBookings: any[] = [];
  pageNumbers: number[] = [];

  loading = true;

  searchName = '';
  searchDate = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private bookingService: BookingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings];
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Không thể tải danh sách tour đã đặt',
          'Lỗi'
        );
        this.loading = false;
      }
    });
  }


  applyFilters() {
    this.filteredBookings = this.bookings.filter(b => {

      const matchName =
        this.searchName === '' ||
        b.tourName.toLowerCase().includes(this.searchName.toLowerCase());

      const matchDate =
        this.searchDate === '' ||
        new Date(b.bookingDate).toISOString().slice(0, 10) === this.searchDate;

      return matchName && matchDate;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters() {
    this.searchName = '';
    this.searchDate = '';
    this.filteredBookings = [...this.bookings];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);

    this.pageNumbers = [];


    if (this.totalPages === 0) {
      this.paginatedBookings = [];
      return;
    }

    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }

    this.changePage(1);
  }

  changePage(page: number) {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedBookings =
      this.filteredBookings.slice(start, end);
  }


  cancelBooking(id: number) {
    Swal.fire({
      title: 'Bạn có chắc muốn hủy tour này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy tour',
      cancelButtonText: 'Không',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.cancelBooking(id).subscribe({
          next: () => {
            this.toastr.success('Hủy tour thành công', 'Thành công');
            this.loadBookings();
          },
          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể hủy tour',
              'Lỗi'
            );
          }
        });
      }
    });
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

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}