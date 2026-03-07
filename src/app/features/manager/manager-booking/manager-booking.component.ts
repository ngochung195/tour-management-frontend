import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerBookingService } from '../../../services/manager-booking.service';
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
  pageNumbers: number[] = [];

  searchTour = '';
  searchUser = '';
  searchDate = '';
  searchStatus = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(private managerBookingService: ManagerBookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.managerBookingService.getAll().subscribe(data => {
      console.log(data);
      this.bookings = data;
      this.filteredBookings = [...data];
      this.updatePagination();
    });
  }

  updateStatus(id: number, status: string) {
    this.managerBookingService.updateStatus(id, status).subscribe(() => {
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

    this.updatePagination();
  }

  resetFilters() {
    this.searchTour = '';
    this.searchUser = '';
    this.searchDate = '';
    this.searchStatus = '';
    this.filteredBookings = [...this.bookings];
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);

    this.pageNumbers = [];

    if (this.totalPages === 0) {
      this.pagedBookings = [];
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

    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedBookings = this.filteredBookings.slice(startIndex, endIndex);
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