import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { Hotel } from '../../../../models/hotel.model';

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
    if (!this.hotel.hotelName.trim()) {
      this.toastr.warning('Tên khách sạn không được để trống');
      return false;
    }

    if (!this.hotel.address.trim()) {
      this.toastr.warning('Địa chỉ không được để trống');
      return false;
    }

    if (this.hotel.description && this.hotel.description.length > 100) {
      this.toastr.warning('Mô tả tối đa 100 ký tự');
      return false;
    }

    return true;
  }

  saveHotel() {
    if (!this.validateForm()) return;

    this.hotelService.createHotel(this.hotel).subscribe({
      next: () => {
        this.toastr.success('Thêm khách sạn thành công');
        this.router.navigate(['/manager/hotels']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Thêm khách sạn thất bại');
      }
    });
  }
}
