import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { TourService } from '../../../../services/tour.service';
import { ItineraryService } from '../../../../services/itinerary.service';
import {ItineraryRequest} from '../../../../models/itinerary.model';

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
    {
      dayNumber: 1,
      time: '',
      activity: '',
      description: ''
    }
  ];

  constructor(
    private tourService: TourService,
    private itineraryService: ItineraryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tourService.getAll().subscribe(res => {
      this.tours = res;
    });
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

    // ❗ 1. Check tour
    if (!this.tourId) {
      this.toastr.warning('Vui lòng chọn Tên tour');
      return;
    }

    // ❗ 2. Check danh sách
    if (this.activities.length === 0) {
      this.toastr.warning('Vui lòng thêm ít nhất 1 lịch trình');
      return;
    }

    // ❗ 3. Check từng dòng + gom time để check trùng
    const timeSet = new Map<string, number>();

    for (let i = 0; i < this.activities.length; i++) {
      const a = this.activities[i];

      if (!a.dayNumber) {
        this.toastr.warning(`Vui lòng nhập Ngày (dòng ${i + 1})`);
        return;
      }

      if (!a.time) {
        this.toastr.warning(`Vui lòng nhập Thời gian (dòng ${i + 1})`);
        return;
      }

      if (!a.activity || !a.activity.trim()) {
        this.toastr.warning(`Vui lòng nhập Hoạt động (dòng ${i + 1})`);
        return;
      }

      // ❗ 4. CHECK TRÙNG THỜI GIAN (theo ngày + giờ)
      const key = `${a.dayNumber}-${a.time}`;

      if (timeSet.has(key)) {
        const firstIndex = timeSet.get(key)! + 1;
        this.toastr.warning(
          `Trùng thời gian ${a.time} ở Ngày ${a.dayNumber} (dòng ${firstIndex} và ${i + 1})`
        );
        return;
      }

      timeSet.set(key, i);
    }

    // ✅ payload
    const payload = this.activities.map(a => ({
      tourId: this.tourId!,
      dayNumber: Number(a.dayNumber),
      time: a.time + ':00',
      activity: a.activity.trim(),
      description: a.description
    }));

    this.itineraryService.createItinerary(payload).subscribe({
      next: () => {
        this.toastr.success('Thêm lịch trình thành công');
        this.router.navigate(['/manager/itineraries']);
      },
      error: () => {
        this.toastr.error('Thêm lịch trình thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/itineraries']);
  }
}
