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

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pageNumbers: number[] = [];

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
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(u => {
      return (
        (!this.searchName || u.userName.toLowerCase().includes(this.searchName.toLocaleLowerCase()))
      );
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(start, end);
  }

  resetFilters() {
    this.searchName = '';
    this.applyFilters();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
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
