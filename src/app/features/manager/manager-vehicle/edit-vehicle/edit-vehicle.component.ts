import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleService} from '../../../../services/vehicle.service';

export interface Vehicle {
  id: number;
  vehicleName: string;
  description: string;
}

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
    if (id) {
      this.loadVehicle(id);
    }
  }

  loadVehicle(id: number) {
    this.vehicleService.getById(id).subscribe({
      next: (res) => {
        this.vehicle = res;
      },
      error: () => {
        this.toastr.error('Không tìm thấy phương tiện');
      }
    });
  }

  saveVehicle() {
    this.vehicleService.updateVehicle(this.vehicle.id, this.vehicle).subscribe({
      next: () => {
        this.toastr.success('Cập nhật phương tiện thành công');
        this.router.navigate(['/manager/vehicles']);
      },
      error: () => {
        this.toastr.error('Cập nhật thất bại');
      }
    });
  }

  goBack() {
    this.router.navigate(['/manager/vehicles']);
  }
}
