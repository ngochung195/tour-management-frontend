import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { HotelService} from '../../../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';

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
    this.getHotelById(id);
  }

  getHotelById(id: number) {
    this.hotelService.getById(id).subscribe({
      next: (res) => {
        this.hotel = res;
      },
      error: () => {
        this.toastr.error('Không tìm thấy khách sạn');
        this.router.navigate(['/manager/hotels']);
      }
    });
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

  updateHotel() {
    if (!this.validateForm()) return;

    this.hotelService.updateHotel(this.hotel.id!, this.hotel).subscribe({
      next: () => {
        this.toastr.success('Cập nhật khách sạn thành công');
        this.router.navigate(['/manager/hotels']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại', 'Lỗi');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/hotels']);
  }
}
