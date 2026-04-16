import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleService} from '../../../../services/vehicle.service';

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

  createVehicle() {

    if (!this.vehicle.vehicleName.trim()) {
      this.toastr.warning('Vui lòng nhập tên phương tiện');
      return;
    }

    this.vehicleService.createVehicle(this.vehicle).subscribe({
      next: () => {
        this.toastr.success('Thêm phương tiện thành công');
        this.router.navigate(['/manager/vehicles']);
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Thêm thất bại'
        );
      }
    });
  }

  cancel() {
    this.router.navigate(['/manager/vehicles']);
  }
}
