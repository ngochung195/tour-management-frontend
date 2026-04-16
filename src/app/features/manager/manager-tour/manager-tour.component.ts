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
  visiblePages: number[] = [];
  pageInput: number | null = null;

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
        this.pageInput = null;
        this.updatePagination();
      });
 }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTours.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedTours = [];
      this.visiblePages = [];
      this.currentPage = 1;
      return;
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.changePage(this.currentPage);
  }

  changePage(page: number) {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedTours = this.filteredTours.slice(start, end);

    this.calculateVisiblePages();
  }

  private calculateVisiblePages() {
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

  goToPage() {
    if (this.pageInput === null) {
      return;
    }

    let page = this.pageInput;

    if (page < 1) {
      page = 1;
    }

    if (page > this.totalPages) {
      page = this.totalPages;
    }

    this.changePage(page);

    this.pageInput = null;
  }

  resetFilters() {
    this.searchName = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.loadTours();
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
