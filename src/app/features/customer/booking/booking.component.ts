import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { BookingService } from '../../../services/booking.service';
import { TourService } from '../../../services/tour.service';
import { PromotionService } from '../../../services/promotion.service';
import { PaymentService } from '../../../services/payment.service';

import { Tour } from '../../../models/tour.model';
import { Promotion } from '../../../models/promotion.model';
import { BookingRequest } from '../../../models/booking-request.model';

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

  promotionCode: string = '';

  basePrice: number = 0;
  finalPrice: number = 0;

  discountPercent = 0;

  apiUrl = "http://localhost:8080";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private tourService: TourService,
    private promotionService: PromotionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));

    this.tourService.getById(this.tourId).subscribe({
      next: (data) => {
        this.tour = data;
        this.calcTotal();
      },
      error: () => {
        this.toastr.error('Không tìm thấy tour', 'Lỗi');
        this.router.navigate(['/']);
      }
    });
  }

  calcTotal() {
    if (!this.tour) return;

    this.basePrice = (this.tour.price || 0) * this.quantity;

    const discount = (this.basePrice * this.discountPercent) / 100;

    this.finalPrice = this.basePrice - discount;
  }

  onQuantityChange() {
    this.calcTotal();
  }

  applyPromotion() {

    if (!this.promotionCode) {
      this.discountPercent = 0;
      this.calcTotal();
      return;
    }

    this.promotionService.getAll().subscribe({
      next: (promos: Promotion[]) => {

        const code = this.promotionCode.trim().toUpperCase();

        const promo = promos.find(p =>
          p.code.toUpperCase() === code &&
          p.isActive &&
          new Date(p.startDate) <= new Date() &&
          new Date(p.endDate) >= new Date()
        );

        if (!promo) {
          this.discountPercent = 0;
          this.toastr.warning('Mã khuyến mãi không hợp lệ hoặc hết hạn');
        } else {
          this.discountPercent = Number(promo.discount);
          this.toastr.success(`Áp dụng giảm ${promo.discount}%`);
        }

        this.calcTotal();
      },
      error: () => {
        this.toastr.error('Không load được mã giảm giá');
      }
    });
  }

  submitBooking() {

    const booking: BookingRequest = {
      tourId: this.tourId,
      quantity: this.quantity,
      promotionCode: this.promotionCode || undefined
    };

    this.bookingService.bookTour(booking).subscribe({
      next: (res: any) => {

        this.paymentService.createPayment(res.id).subscribe({
          next: (payment) => {
            if (payment.status === 'OK' && payment.url) {
              window.location.href = payment.url;
            } else {
              this.toastr.error('Không thể tạo link thanh toán');
              this.router.navigate(['/my-bookings']);
            }
          }
        });
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Đặt tour thất bại');
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
