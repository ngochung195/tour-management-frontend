import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerBookingService } from '../../../services/manager-booking.service';

@Component({
  selector: 'app-manager-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-booking.component.html',
  styleUrl: './manager-booking.component.scss'
})
export class ManagerBookingComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: ManagerBookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAll().subscribe(data => {
      this.bookings = data;
    });
  }

  updateStatus(id: number, status: string) {
    this.bookingService.getAll().subscribe(data => {
      this.loadBookings();
    });
  }
}
