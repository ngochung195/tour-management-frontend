import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-manager-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-booking.component.html',
  styleUrl: './manager-booking.component.scss'
})
export class ManagerBookingComponent implements OnInit {

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

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAll().subscribe(data => {
      console.log(data);
      this.bookings = data;
      this.filteredBookings = [...data];
      this.updatePagination();
    });
  }

  updateStatus(id: number, status: string) {
    this.bookingService.updateStatus(id, status).subscribe(() => {
      this.loadBookings();
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
}
