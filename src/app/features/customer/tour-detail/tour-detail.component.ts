import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../models/tour.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { ItineraryService } from '../../../services/itinerary.service';
import { ReviewService } from '../../../services/review.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  // ================= ITINERARY =================
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

  // ================= IMAGE =================
  getImageUrl(img: string): string {
    if (!img) return '';

    img = img.replace('/tours//uploads', '/uploads');

    if (img.startsWith('http')) return img;

    if (!img.startsWith('/')) {
      img = '/' + img;
    }

    return this.apiUrl + img;
  }

  // ================= REVIEWS =================
  loadReviews(tourId: number) {
    this.reviewService.getByTour(tourId).subscribe((data: any) => {
      this.reviews = data;
    });
  }

  submitReview() {
    if (!this.tour) return;

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
        this.toastr.success('Gửi đánh giá thành công');
      },
      error: () => {
        this.toastr.error('Gửi đánh giá thất bại');
      }
    });
  }

  // ================= EDIT =================
  startEdit(r: any) {
    this.editId = r.id;
    this.editText = r.reviewText;
    this.editRating = r.rating;
    this.openMenuId = null;
  }

  cancelEdit() {
    this.editId = null;
  }

  saveEdit(id: number) {

    const req = {
      reviewText: this.editText,
      rating: this.editRating
    };

    this.reviewService.update(id, req).subscribe({
      next: () => {
        this.editId = null;
        this.loadReviews(this.tour!.id);
        this.toastr.success('Cập nhật review thành công');
      },
      error: () => {
        this.toastr.error('Cập nhật thất bại');
      }
    });
  }

  // ================= DELETE =================
  deleteReview(id: number) {

    this.reviewService.delete(id).subscribe({
      next: () => {
        this.loadReviews(this.tour!.id);
        this.openMenuId = null;
        this.toastr.success('Xóa review thành công');
      },
      error: () => {
        this.toastr.error('Xóa thất bại');
      }
    });
  }

  // ================= MENU =================
  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu() {
    this.openMenuId = null;
  }

  // ================= STAR =================
  getStars(rating: number): number[] {
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    return Array(safeRating).fill(0);
  }
}
