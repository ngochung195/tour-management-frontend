import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../services/vehicle.service';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})
export class ManagerEditVehicleComponent implements OnInit {

  vehicle: any = {
    vehicleName: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadVehicle(id);
  }

  loadVehicle(id: number) {
    this.vehicleService.getById(id).subscribe({
      next: (res) => {
        this.vehicle = res;
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Không tìm thấy phương tiện');
        this.router.navigate(['/manager/vehicles']);
      }
    });
  }

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

  saveVehicle() {

    if (!this.validateForm()) return;

    this.vehicleService.updateVehicle(this.vehicle.id, this.vehicle).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Cập nhật phương tiện thành công');
        this.router.navigate(['/manager/vehicles']);
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Cập nhật thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/vehicles']);
  }
}
