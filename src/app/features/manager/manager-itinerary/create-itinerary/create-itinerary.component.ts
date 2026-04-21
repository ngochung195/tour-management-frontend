import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TourService } from '../../../../services/tour.service';
import { ItineraryService } from '../../../../services/itinerary.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-create-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-itinerary.component.html',
  styleUrl: './create-itinerary.component.scss'
})
export class ManagerCreateItineraryComponent implements OnInit {

  tours: any[] = [];
  tourId: number | null = null;

  activities: any[] = [
    { dayNumber: 1, time: '', activity: '', description: '' }
  ];

  constructor(
    private tourService: TourService,
    private itineraryService: ItineraryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tourService.getAll().subscribe(res => this.tours = res);
  }

  addActivity() {
    const last = this.activities[this.activities.length - 1];

    this.activities.push({
      dayNumber: last?.dayNumber || 1,
      time: '',
      activity: '',
      description: ''
    });
  }

  removeActivity(index: number) {
    this.activities.splice(index, 1);
  }

  saveItinerary() {

    if (!this.tourId) {
      ToastUtil.warning(this.toastr, 'Vui lòng chọn tour');
      return;
    }

    if (this.activities.length === 0) {
      ToastUtil.warning(this.toastr, 'Vui lòng thêm lịch trình');
      return;
    }

    const timeMap = new Map<string, number>();

    for (let i = 0; i < this.activities.length; i++) {

      const a = this.activities[i];

      if (ValidationUtil.isEmpty(a.dayNumber)) {
        ToastUtil.warning(this.toastr, `Thiếu ngày (dòng ${i + 1})`);
        return;
      }

      if (ValidationUtil.isEmpty(a.time)) {
        ToastUtil.warning(this.toastr, `Thiếu thời gian (dòng ${i + 1})`);
        return;
      }

      if (ValidationUtil.isEmpty(a.activity)) {
        ToastUtil.warning(this.toastr, `Thiếu hoạt động (dòng ${i + 1})`);
        return;
      }

      const key = `${a.dayNumber}-${a.time}`;

      if (timeMap.has(key)) {
        const first = timeMap.get(key)! + 1;
        ToastUtil.warning(
          this.toastr,
          `Trùng giờ ${a.time} ngày ${a.dayNumber} (dòng ${first} & ${i + 1})`
        );
        return;
      }

      timeMap.set(key, i);
    }

    const payload = this.activities.map(a => ({
      tourId: this.tourId!,
      dayNumber: Number(a.dayNumber),
      time: a.time.length === 5 ? a.time + ':00' : a.time,
      activity: a.activity.trim(),
      description: a.description
    }));

    this.itineraryService.createItinerary(payload).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm lịch trình thành công');
        this.router.navigate(['/manager/itineraries']);
      },
      error: (err) => {
        ToastUtil.error(this.toastr, err?.error?.message || 'Thêm thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/itineraries']);
  }
}
