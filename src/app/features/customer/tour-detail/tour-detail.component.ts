import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../models/tour.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { ItineraryService } from '../../../services/itinerary.service';
import { ReviewService } from '../../../services/review.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../shared/utils/validation.util';
import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent implements OnInit {

  tour?: Tour;
  apiUrl = "http://localhost:8080";

  groupedItineraries: any[] = [];
  reviews: any[] = [];

  reviewText: string = '';
  rating: number = 5;

  editId: number | null = null;
  editText: string = '';
  editRating: number = 5;

  openMenuId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private itineraryService: ItineraryService,
    private reviewService: ReviewService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const tourId = +id;

      this.tourService.getById(tourId).subscribe(data => {
        this.tour = data;
      });

      this.loadItinerary(tourId);
      this.loadReviews(tourId);
    }
  }

  loadItinerary(tourId: number) {
    this.itineraryService.getByTour(tourId).subscribe(data => {

      const map = new Map<number, any>();

      data.forEach((item: any) => {

        let date = null;

        if (this.tour?.startDate) {
          const start = new Date(this.tour.startDate);
          const d = new Date(start);
          d.setDate(start.getDate() + (item.dayNumber - 1));
          date = d;
        }

        const mapped = {
          time: item.time,
          title: item.title || item.activity,
          description: item.description || item.detail
        };

        if (!map.has(item.dayNumber)) {
          map.set(item.dayNumber, {
            dayNumber: item.dayNumber,
            date: date,
            items: []
          });
        }

        map.get(item.dayNumber).items.push(mapped);
      });

      this.groupedItineraries = Array.from(map.values());
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

  loadReviews(tourId: number) {
    this.reviewService.getByTour(tourId).subscribe((data: any) => {
      this.reviews = data;
    });
  }

  validateReview(): boolean {

    if (ValidationUtil.isEmpty(this.reviewText)) {
      ToastUtil.warning(this.toastr, 'Nội dung đánh giá không được để trống');
      return false;
    }

    if (this.reviewText.trim().length < 5) {
      ToastUtil.warning(this.toastr, 'Đánh giá phải có ít nhất 5 ký tự');
      return false;
    }

    if (this.rating < 1 || this.rating > 5) {
      ToastUtil.warning(this.toastr, 'Điểm đánh giá phải từ 1 đến 5');
      return false;
    }

    return true;
  }

  submitReview() {
    if (!this.tour) return;

    if (!this.validateReview()) return;

    const req = {
      tourId: this.tour.id,
      reviewText: this.reviewText,
      rating: this.rating
    };

    this.reviewService.create(req).subscribe({
      next: () => {
        this.reviewText = '';
        this.rating = 5;
        this.loadReviews(this.tour!.id);
        ToastUtil.success(this.toastr, 'Gửi đánh giá thành công');
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Bạn chưa đặt tour hoặc tour chưa được xác nhận, không thể đánh giá');
      }
    });
  }


  startEdit(r: any) {
    this.editId = r.id;
    this.editText = r.reviewText;
    this.editRating = r.rating;
    this.openMenuId = null;
  }

  cancelEdit() {
    this.editId = null;
  }

  validateEditReview(): boolean {

    if (ValidationUtil.isEmpty(this.editText)) {
      ToastUtil.warning(this.toastr, 'Nội dung không được để trống');
      return false;
    }

    if (this.editText.trim().length < 5) {
      ToastUtil.warning(this.toastr, 'Nội dung phải có ít nhất 5 ký tự');
      return false;
    }

    if (this.editRating < 1 || this.editRating > 5) {
      ToastUtil.warning(this.toastr, 'Điểm đánh giá phải từ 1 đến 5');
      return false;
    }

    return true;
  }

  saveEdit(id: number) {

    if (!this.validateEditReview()) return;

    const req = {
      reviewText: this.editText,
      rating: this.editRating
    };

    this.reviewService.update(id, req).subscribe({
      next: () => {
        this.editId = null;
        this.loadReviews(this.tour!.id);
        ToastUtil.success(this.toastr, 'Cập nhật review thành công');
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Cập nhật thất bại');
      }
    });
  }

  deleteReview(id: number) {

    this.reviewService.delete(id).subscribe({
      next: () => {
        this.loadReviews(this.tour!.id);
        this.openMenuId = null;
        ToastUtil.success(this.toastr, 'Xóa review thành công');
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Xóa thất bại');
      }
    });
  }

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu() {
    this.openMenuId = null;
  }

  getStars(rating: number): number[] {
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    return Array(safeRating).fill(0);
  }
}
