import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-edit-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-hotel.component.html',
  styleUrl: './edit-hotel.component.scss'
})
export class ManagerEditHotelComponent implements OnInit {

  hotel: any = {
    hotelName: '',
    description: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.getHotelById(id);
  }

  getHotelById(id: number) {

    this.hotelService.getById(id).subscribe({
      next: (res) => {
        this.hotel = res;
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Không tìm thấy khách sạn');
        this.router.navigate(['/manager/hotels']);
      }
    });
  }

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.hotel.hotelName)) {
      ToastUtil.warning(this.toastr, 'Tên khách sạn không được để trống');
      return false;
    }

    if (ValidationUtil.isEmpty(this.hotel.address)) {
      ToastUtil.warning(this.toastr, 'Địa chỉ không được để trống');
      return false;
    }

    if (this.hotel.description && this.hotel.description.length > 100) {
      ToastUtil.warning(this.toastr, 'Mô tả tối đa 100 ký tự');
      return false;
    }

    return true;
  }

  updateHotel() {

    if (!this.validateForm()) return;

    this.hotelService.updateHotel(this.hotel.id, this.hotel).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Cập nhật khách sạn thành công');
        this.router.navigate(['/manager/hotels']);
      },
      error: (err) => {
        ToastUtil.error(
          this.toastr,
          err?.error?.message || 'Không thể cập nhật khách sạn'
        );
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/hotels']);
  }
}
