import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { TourService } from '../../../services/tour.service';
import { BookingRequest } from '../../../models/booking-request.model';
import { Tour } from '../../../models/tour.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {PaymentService} from '../../../services/payment.service';

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

  apiUrl= "http://localhost:8080";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private paymentService: PaymentService,
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
      next: (res) => {
        this.paymentService.createPayment(res.id).subscribe({
          next: (payment) => {
            if (payment.status === 'OK' && payment.url) {
              window.location.href = payment.url;
            } else {
              this.toastr.error('Không thể tạo link thanh toán', 'Lỗi');
              this.router.navigate(['/my-bookings']);
            }
          },
          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Lỗi tạo thanh toán',
              'Lỗi'
            );
            this.router.navigate(['/my-bookings']);
          }
        });
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Đặt tour thất bại',
          'Lỗi'
        );
      }
    });
  }
  getImageUrl(img: string): string {
    if (!img) return '';

    img = img.replace('/tours//uploads', '/uploads');

    if (img.startsWith('http')) return img;

    if (!img.startsWith('/')) {
      img = '/' + img;
    }

    return this.apiUrl + img;
  }
}
