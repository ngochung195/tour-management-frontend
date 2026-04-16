import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { TourService } from '../../../services/tour.service';
import { ItineraryService } from '../../../services/itinerary.service';
import { Tour } from '../../../models/tour.model';
import { Itinerary } from '../../../models/itinerary.model';

@Component({
  selector: 'app-manager-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-itinerary.component.html',
  styleUrl: './manager-itinerary.component.scss'
})
export class ManagerItineraryComponent implements OnInit {

  tours: Tour[] = [];
  itineraries: Itinerary[] = [];
  filteredTours: Tour[] = [];
  pagedTours: Tour[] = [];

  expandedTourId: number | null = null;

  searchName = '';
  searchStartDate = '';
  searchEndDate = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private tourService: TourService,
    private itineraryService: ItineraryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  applyFilter() {
    if (!this.tours.length) return;
    if (!this.itineraries.length) return;

    this.filteredTours = this.tours.filter(tour =>
      this.itineraries.some(it => it.tourId === tour.id)
    );

    this.updatePagination();
  }

  loadAll() {
    this.tourService.getAll().subscribe(t => {
      this.tours = t;
      this.applyFilter();
    });

    this.itineraryService.getAll().subscribe(i => {
      this.itineraries = i;
      this.applyFilter();
    });
  }

  toggleExpand(id: number) {
    this.expandedTourId = this.expandedTourId === id ? null : id;
  }

  getItineraries(tourId: number): Itinerary[] {
    return this.itineraries
      .filter(i => i.tourId === tourId)
      .sort((a, b) =>
        a.dayNumber - b.dayNumber || a.time.localeCompare(b.time)
      );
  }

  formatTime(time: string): string {
    return time?.substring(0, 5);
  }

  searchTour() {
    this.tourService
      .searchTour(this.searchName, this.searchStartDate, this.searchEndDate)
      .subscribe(res => {
        this.filteredTours = res;
        this.currentPage = 1;
        this.updatePagination();
      });
  }

  resetFilters() {
    this.searchName = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.loadAll();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTours.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedTours = [];
      this.visiblePages = [];
      return;
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

  getMaxDay(tourId: number): number {
    const itineraries = this.getItineraries(tourId);

    if (!itineraries || itineraries.length === 0) {
      return 0;
    }

    return Math.max(...itineraries.map(i => i.dayNumber));
  }

  goToPage() {
    if (this.pageInput === null) return;

    let page = this.pageInput;

    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.changePage(page);
    this.pageInput = null;
  }

  goToCreate() {
    this.router.navigate(['/manager/itineraries/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/itineraries/edit', id]);
  }

  deleteItinerary(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa lịch trình?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.itineraryService.deleteItinerary(id).subscribe({
          next: () => {
            this.toastr.success('Xóa lịch trình thành công', 'Thành công');

            this.itineraries = this.itineraries.filter(i => i.id !== id);

            this.applyFilter();
          },
          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa lịch trình',
              'Lỗi'
            );
          }
        });
      }
    });
  }

  deleteByTour(tourId: number) {
    Swal.fire({
      title: 'Xóa toàn bộ lịch trình?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itineraryService.deleteByTour(tourId).subscribe({
          next: () => {
            this.toastr.success('Đã xóa toàn bộ lịch trình');

            this.itineraries = this.itineraries.filter(i => i.tourId !== tourId);

            this.filteredTours = this.tours.filter(t =>
              this.itineraries.some(it => it.tourId === t.id)
            );

            this.expandedTourId = null;
            this.currentPage = 1;

            this.updatePagination();
          },
          error: (err) => {
            this.toastr.error(err?.error?.message || 'Xóa toàn bộ lịch trình thất bại');
          }
        });
      }
    });
  }
}
