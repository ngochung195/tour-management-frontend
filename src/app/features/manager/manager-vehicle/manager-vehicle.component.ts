import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-vehicle.component.html',
  styleUrl: './manager-vehicle.component.scss'
})
export class ManagerVehicleComponent implements OnInit {

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  pagedVehicles: Vehicle[] = [];

  searchName: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getAll().subscribe({
      next: (res) => {
        this.vehicles = res;
        this.filteredVehicles = res;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: () => {
        ToastUtil.error(this.toastr, 'Không thể tải danh sách phương tiện');
      }
    });
  }

  searchVehicle() {

    this.filteredVehicles = this.vehicles.filter(v =>
      !this.searchName ||
      v.vehicleName?.toLowerCase().includes(this.searchName.toLowerCase())
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {

    this.totalPages = Math.ceil(this.filteredVehicles.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedVehicles = [];
      return;
    }

    this.changePage(this.currentPage);
  }

  changePage(page: number) {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedVehicles = this.filteredVehicles.slice(start, end);

    this.calculateVisiblePages();
  }

  calculateVisiblePages() {

    const range = 1;
    let start = this.currentPage - range;
    let end = this.currentPage + range;

    if (start < 1) {
      start = 1;
      end = Math.min(3, this.totalPages);
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, this.totalPages - 2);
    }

    this.visiblePages = [];

    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  resetFilters() {
    this.searchName = '';
    this.filteredVehicles = [...this.vehicles];
    this.updatePagination();
  }

  goToCreate() {
    this.router.navigate(['/manager/vehicles/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/vehicles/edit', id]);
  }

  deleteVehicle(id: number) {

    Swal.fire({
      title: 'Bạn có chắc chắn xóa phương tiện?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Xóa phương tiện thành công');
          this.loadVehicles();
        },
        error: (err) => {
          ToastUtil.error(
            this.toastr,
            err?.error?.message || 'Không thể xóa phương tiện'
          );
        }
      });

    });
  }
}
