import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TourService } from '../../../../services/tour.service';
import { ItineraryService } from '../../../../services/itinerary.service';
import { ToastrService } from 'ngx-toastr';

import { ToastUtil } from '../../../../shared/utils/toast.util';
import { ValidationUtil } from '../../../../shared/utils/validation.util';

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

    this.tourService.getAll().subscribe(res => this.tours = res);

    const id = Number(this.route.snapshot.paramMap.get('tourId'));

    if (id) {
      this.tourId = id;

      this.itineraryService.getByTour(id).subscribe(res => {
        this.activities = res.map(i => ({
          id: i.id,
          dayNumber: i.dayNumber,
          time: i.time?.slice(0, 5),
          activity: i.activity,
          description: i.description
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

    if (!this.tourId) {
      ToastUtil.warning(this.toastr, 'Thiếu tour');
      return;
    }

    if (this.activities.length === 0) {
      ToastUtil.warning(this.toastr, 'Không có dữ liệu');
      return;
    }

    const payload = this.activities.map(a => ({
      id: a.id,
      tourId: this.tourId!,
      dayNumber: Number(a.dayNumber),
      time: a.time,
      activity: a.activity,
      description: a.description
    }));

    this.itineraryService.updateItinerary(this.tourId, payload).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Cập nhật thành công');
        this.router.navigate(['/manager/itineraries']);
      },
      error: (err) => {
        ToastUtil.error(this.toastr, err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/itineraries']);
  }
}
