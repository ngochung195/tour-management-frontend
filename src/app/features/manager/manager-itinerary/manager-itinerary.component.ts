import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TourService } from '../../../services/tour.service';
import { ItineraryService } from '../../../services/itinerary.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-manager-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-itinerary.component.html',
  styleUrl: './manager-itinerary.component.scss'
})
export class ManagerItineraryComponent implements OnInit {

  tours: any[] = [];
  itineraries: any[] = [];

  filteredTours: any[] = [];
  pagedTours: any[] = [];

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

  loadAll() {

    this.tourService.getAll().subscribe(res => {
      this.tours = res;
      this.applyFilter();
    });

    this.itineraryService.getAll().subscribe(res => {
      this.itineraries = res;
      this.applyFilter();
    });
  }

  applyFilter() {

    if (!this.tours.length || !this.itineraries.length) return;

    this.filteredTours = this.tours.filter(t =>
      this.itineraries.some(i => i.tourId === t.id)
    );

    this.updatePagination();
  }

  toggleExpand(id: number) {
    this.expandedTourId = this.expandedTourId === id ? null : id;
  }

  getItineraries(tourId: number) {
    return this.itineraries
      .filter(i => i.tourId === tourId)
      .sort((a, b) =>
        a.dayNumber - b.dayNumber || a.time.localeCompare(b.time)
      );
  }

  searchTour() {

    this.tourService.searchTour(
      this.searchName,
      this.searchStartDate,
      this.searchEndDate
    ).subscribe(res => {
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

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // HH:mm
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

  deleteItinerary(id: number) {

    Swal.fire({
      title: 'Xóa lịch trình?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.itineraryService.deleteItinerary(id).subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Xóa thành công');
          this.itineraries = this.itineraries.filter(i => i.id !== id);
          this.applyFilter();
        },
        error: (err) => {
          ToastUtil.error(this.toastr, err?.error?.message || 'Xóa thất bại');
        }
      });

    });
  }

  deleteByTour(tourId: number) {

    Swal.fire({
      title: 'Xóa toàn bộ lịch trình?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.itineraryService.deleteByTour(tourId).subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Đã xóa toàn bộ lịch trình');
          this.itineraries = this.itineraries.filter(i => i.tourId !== tourId);
          this.applyFilter();
        },
        error: (err) => {
          ToastUtil.error(this.toastr, err?.error?.message || 'Không thể xóa toàn bộ lịch trình');
        }
      });

    });
  }

  goToCreate() {
    this.router.navigate(['/manager/itineraries/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/manager/itineraries/edit', id]);
  }

  goToPage() {

    if (!this.pageInput) return;

    let page = this.pageInput;

    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.changePage(page);
    this.pageInput = null;
  }

  getMaxDay(tourId: number): number {

    const list = this.getItineraries(tourId);

    return list.length ? Math.max(...list.map(i => i.dayNumber)) : 0;
  }
}
