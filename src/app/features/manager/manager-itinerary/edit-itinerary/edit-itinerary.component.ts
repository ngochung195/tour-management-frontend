import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { TourService } from '../../../../services/tour.service';
import { ItineraryService } from '../../../../services/itinerary.service';
import { ItineraryRequest } from '../../../../models/itinerary.model';

@Component({
  selector: 'app-edit-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-itinerary.component.html',
  styleUrl: './edit-itinerary.component.scss'
})
export class ManagerEditItineraryComponent implements OnInit {

  tours: any[] = [];
  tourId: number | null = null;

  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private itineraryService: ItineraryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.tourService.getAll().subscribe(res => {
      this.tours = res;
    });

    const tourId = Number(this.route.snapshot.paramMap.get('tourId'));
    if (tourId) {
      this.tourId = tourId;

      this.itineraryService.getByTour(tourId).subscribe(res => {
        this.activities = res.map(item => ({
          id: item.id, // 🔥 QUAN TRỌNG
          dayNumber: item.dayNumber,
          time: item.time,
          activity: item.activity,
          description: item.description
        }));
      });
    }
  }

  addActivity() {
    const last = this.activities[this.activities.length - 1];

    this.activities.push({
      id: null,
      dayNumber: last?.dayNumber || 1,
      time: '',
      activity: '',
      description: ''
    });
  }

  removeActivity(index: number) {
    this.activities.splice(index, 1);
  }

  updateItinerary() {

    if (!this.tourId || this.activities.length === 0) {
      this.toastr.warning('Vui lòng nhập dữ liệu');
      return;
    }

    const payload: ItineraryRequest[] = this.activities.map(a => ({
      id: a.id,
      tourId: this.tourId!,
      dayNumber: Number(a.dayNumber),
      time: a.time,
      activity: a.activity,
      description: a.description
    }));

    this.itineraryService.updateItinerary(this.tourId!, payload).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thành công');
        this.router.navigate(['/manager/itineraries']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/itineraries']);
  }
}
