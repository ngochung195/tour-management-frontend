import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-contact.component.html',
  styleUrl: './admin-contact.component.scss'
})
export class AdminContactComponent implements OnInit {

  contacts: any[] = [];
  filteredContacts: any[] = [];
  pagedContacts: any[] = [];

  searchKeyword: string = '';
  searchStatus: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private contactService: ContactService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getAll().subscribe({
      next: (res: any[]) => {
        this.contacts = res;
        this.filteredContacts = res;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: () => {
        this.toastr.error('Không tải được danh sách liên hệ');
      }
    });
  }

  search() {
    this.filteredContacts = this.contacts.filter(c => {

      const keyword = this.searchKeyword?.toLowerCase() || '';

      const matchKeyword =
        !keyword ||
        c.userName?.toLowerCase().includes(keyword) ||
        c.email?.toLowerCase().includes(keyword);

      const matchStatus =
        !this.searchStatus || c.status === this.searchStatus;

      return matchKeyword && matchStatus;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters() {
    this.searchKeyword = '';
    this.searchStatus = '';
    this.loadContacts();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'NEW':
        return 'Mới gửi';
      case 'READ':
        return 'Đã xem';
      case 'REPLIED':
        return 'Đã phản hồi';
      default:
        return status;
    }
  }

  updateStatus(contact: any) {
    this.contactService
      .updateStatus(contact.id, contact.status)
      .subscribe({
        next: () => {
          this.toastr.success('Cập nhật thành công');
        },
        error: () => {
          this.toastr.error('Cập nhật thất bại');
        }
      });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedContacts = [];
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

    this.pagedContacts = this.filteredContacts.slice(start, end);

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
    if (this.pageInput === null) return;

    let page = this.pageInput;

    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.changePage(page);

    this.pageInput = null;
  }
}
