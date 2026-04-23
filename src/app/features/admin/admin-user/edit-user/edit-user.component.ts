import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../../shared/utils/validation.util';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {

  user: any = {};
  roles: any[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadRoles();
    this.loadUser(id);
  }

  loadUser(id: any) {
    this.userService.getById(id).subscribe(res => {
      this.user = res;
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe(res => {
      this.roles = res;
    });
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.user.userName)) {
      this.toastr.warning('Tên người dùng không được để trống');
      return false;
    }

    if (ValidationUtil.isEmpty(this.user.email)) {
      this.toastr.warning('Email không được để trống');
      return false;
    }

    if (!this.user.email.includes('@')) {
      this.toastr.warning('Email không hợp lệ');
      return false;
    }

    if (ValidationUtil.isEmpty(this.user.roleName)) {
      this.toastr.warning('Vui lòng chọn vai trò');
      return false;
    }

    if (this.user.phone && this.user.phone.length < 9) {
      this.toastr.warning('Số điện thoại không hợp lệ');
      return false;
    }

    if (this.user.password && this.user.password.length < 6) {
      this.toastr.warning('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  }

  updateUser() {

    if (!this.validateForm()) return;

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (res) => {
        this.toastr.success('Cập nhật người dùng thành công');

        if (res.needRelogin) {
          this.toastr.warning('Vai trò đã thay đổi. Vui lòng đăng nhập lại.');
          localStorage.removeItem("token");
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/admin/users']);
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật người dùng thất bại');
      }
    });
  }
}
