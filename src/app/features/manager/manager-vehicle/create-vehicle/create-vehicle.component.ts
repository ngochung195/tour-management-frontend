import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { VehicleService } from '../../../../services/vehicle.service';
import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.scss'
})
export class ManagerCreateVehicleComponent {

  vehicle: any = {
    vehicleName: '',
    description: ''
  };

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.vehicle.vehicleName)) {
      ToastUtil.warning(this.toastr, 'Vui lòng nhập tên phương tiện');
      return false;
    }

    if (this.vehicle.description && this.vehicle.description.length > 200) {
      ToastUtil.warning(this.toastr, 'Mô tả tối đa 200 ký tự');
      return false;
    }

    return true;
  }

  createVehicle() {

    if (!this.validateForm()) return;

    this.vehicleService.createVehicle(this.vehicle).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm phương tiện thành công');
        this.router.navigate(['/manager/vehicles']);
      },
      error: (err) => {
        ToastUtil.error(this.toastr, err?.error?.message || 'Thêm thất bại');
      }
    });
  }

  cancel() {
    this.router.navigate(['/manager/vehicles']);
  }
}
