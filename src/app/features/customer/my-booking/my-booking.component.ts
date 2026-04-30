import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import {PaymentService} from '../../../services/payment.service';

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

  loading = true;

  searchName = '';
  searchDate = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
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

    if (this.totalPages === 0) {
      this.paginatedBookings = [];
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

    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedBookings =
      this.filteredBookings.slice(start, end);

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

  goToPayment(bookingId: number) {
    this.paymentService.createPayment(bookingId).subscribe({
      next: (res) => {
        console.log('Payment response:', res);
        if (res.status === 'OK' && res.url) {
          window.location.href = res.url;
        } else {
          this.toastr.error('Không thể tạo link thanh toán', 'Lỗi');
        }
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Lỗi khi tạo thanh toán',
          'Lỗi'
        );
      }
    });
  }

  cancelBooking(id: number) {

    const booking = this.bookings.find(b => b.id === id);

    if (booking?.status === 'APPROVED') {
      this.toastr.warning('Tour đã được xác nhận, không thể hủy', 'Thông báo');
      return;
    }

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
      case 'PAID' : return 'Đã thanh toán';
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
