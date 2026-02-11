import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { BookingRequest } from '../../../models/booking-request.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  tourId!: number;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));
  }

  submitBooking() {
    const booking: BookingRequest = {
      tourId: this.tourId,
      quantity: this.quantity
    };

    this.bookingService.bookTour(booking).subscribe({
      next: () => {
        alert('Đặt tour thành công – chờ thanh toán');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('BOOKING ERROR:', err);
        alert(err.error?.message || 'Đặt tour thất bại');
      }
    });
  }
}
