import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { TourDetailService } from '../../../../services/tour-detail.service';
import { TourService } from '../../../../services/tour.service';
import { HotelService } from '../../../../services/hotel.service';
import { VehicleService } from '../../../../services/vehicle.service';

@Component({
  selector: 'app-manager-edit-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-tour-detail.component.html',
  styleUrl: './edit-tour-detail.component.scss'
})
export class ManagerEditTourDetailComponent implements OnInit {

  id!: number;

  tourDetail: any = {
    tourId: null,
    hotelId: null,
    vehicleId: null
  };

  tours: any[] = [];
  hotels: any[] = [];
  vehicles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private tourDetailService: TourDetailService,
    private tourService: TourService,
    private hotelService: HotelService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
    this.loadDetail();
  }

  loadData() {
    this.tourService.getAll().subscribe(res => this.tours = res);
    this.hotelService.getAll().subscribe(res => this.hotels = res);
    this.vehicleService.getAll().subscribe(res => this.vehicles = res);
  }

  loadDetail() {
    this.tourDetailService.getById(this.id).subscribe({
      next: (res) => {
        this.tourDetail = res;
      },
      error: () => {
        this.toastr.error('Không tìm thấy tour detail');
        this.router.navigate(['/manager/tour-details']);
      }
    });
  }

  updateTourDetail() {

    if (!this.tourDetail.tourId || !this.tourDetail.hotelId || !this.tourDetail.vehicleId) {
      this.toastr.warning('Vui lòng chọn đầy đủ dữ liệu');
      return;
    }

    this.tourDetailService.update(this.id, this.tourDetail).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thành công');
        this.router.navigate(['/manager/tour-details']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/tour-details']);
  }
}
