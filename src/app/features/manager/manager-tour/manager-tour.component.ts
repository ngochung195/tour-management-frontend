import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../services/tour.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-manager-tour',
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-tour.component.html',
  styleUrl: './manager-tour.component.scss'
})
export class ManagerTourComponent {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  pagedTours: Tour[] = [];

  searchName: string = '';
  searchStartDate: string = '';
  searchEndDate: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pageNumbers: number[] = [];

  constructor(
    private tourService: TourService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours() {
    this.tourService.getAll().subscribe(res => {
      this.tours = res;
      this.filteredTours = res;
      this.currentPage = 1;
      this.updatePagination();
    });
  }

 searchTour(){
    this.tourService
        .searchTour(this.searchName, this.searchStartDate, this.searchEndDate)
      .subscribe(res =>{
        this.filteredTours = res;
        this.currentPage = 1;
        this.updatePagination();
      });
 }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTours.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTours = this.filteredTours.slice(start, end);
  }

  resetFilters() {
    this.searchName = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.loadTours();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  goToCreate() {
    this.router.navigate(['/manager/tours/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/tours/edit', id]);
  }

  deleteTour(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa tour?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.tourService.deleteTour(id).subscribe({

          next: () => {
            this.toastr.success('Xóa tour thành công', 'Thành công');
            this.loadTours();
          },

          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa tour',
              'Lỗi'
            );
          }

        });

      }

    });
  }
}
