import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { TourService } from '../../../services/tour.service';
import { BookingRequest } from '../../../models/booking-request.model';
import { Tour } from '../../../models/tour.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  tourId!: number;
  quantity = 1;

  tour!: Tour;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private tourService: TourService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));

    this.tourService.getById(this.tourId).subscribe({
      next: (data) => this.tour = data,
      error: () => {
        this.toastr.error('Không tìm thấy tour', 'Lỗi');
        this.router.navigate(['/']);
      }
    });
  }

  submitBooking() {
    const booking: BookingRequest = {
      tourId: this.tourId,
      quantity: this.quantity
    };

    this.bookingService.bookTour(booking).subscribe({
      next: () => {
        this.toastr.success(
          `Đặt tour "${this.tour.tourName}" thành công – chờ thanh toán`,
          'Thành công'
        );

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('BOOKING ERROR:', err);

        this.toastr.error(
          err?.error?.message || 'Đặt tour thất bại',
          'Lỗi'
        );
      }
    });
  }
}