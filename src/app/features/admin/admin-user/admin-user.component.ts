import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss'
})
export class AdminUserComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];

  searchName: string = '';
  searchRole: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  visiblePages: number[] = [];
  pageInput: number | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(res => {
      this.users = res;
      this.filteredUsers = res;
      this.currentPage = 1;
      this.updatePagination();
    });
  }

  searchUsers(){
    this.userService
      .searchUsers(this.searchName, this.searchRole)
      .subscribe(res => {
        this.filteredUsers = res;
        this.currentPage = 1;
        this.pageInput = null;
        this.updatePagination();
      });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    if (this.totalPages === 0) {
      this.pagedUsers = [];
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

    this.pagedUsers = this.filteredUsers.slice(start, end);

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
    this.searchRole = '';

    this.currentPage = 1;
    this.pageInput = null;

    this.loadUsers();
  }

  goToCreate() {
    this.router.navigate(['/admin/users/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn xóa người dùng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.userService.deleteUser(id).subscribe({

          next: () => {
            this.toastr.success('Xóa người dùng thành công', 'Thành công');
            this.loadUsers();
          },

          error: (err) => {
            this.toastr.error(
              err?.error?.message || 'Không thể xóa người dùng',
              'Lỗi'
            );
          }

        });

      }

    });
  }
}
