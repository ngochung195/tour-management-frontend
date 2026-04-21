import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-create-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-hotel.component.html',
  styleUrl: './create-hotel.component.scss'
})
export class ManagerCreateHotelComponent {

  hotel: any = {
    hotelName: '',
    description: '',
    address: ''
  };

  constructor(
    private hotelService: HotelService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  goBack() {
    this.router.navigate(['/manager/hotels']);
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

  saveHotel() {

    if (!this.validateForm()) return;

    this.hotelService.createHotel(this.hotel).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm khách sạn thành công');
        this.router.navigate(['/manager/hotels']);
      },
      error: (err) => {
        ToastUtil.error(
          this.toastr,
          err?.error?.message || 'Không thể thêm khách sạn'
        );
      }
    });
  }
}
