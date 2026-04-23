import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';

import { ValidationUtil } from '../../../../shared/utils/validation.util';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  user: any = {
    userName: '',
    email: '',
    password: '',
    roleName: '',
    phone: '',
    address: ''
  };

  roles: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRoles();
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

    if (ValidationUtil.isEmpty(this.user.password)) {
      this.toastr.warning('Mật khẩu không được để trống');
      return false;
    }

    if (this.user.password.length < 6) {
      this.toastr.warning('Mật khẩu phải có ít nhất 6 ký tự');
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

    return true;
  }

  saveUser() {

    if (!this.validateForm()) return;

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.toastr.success('Thêm người dùng thành công');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Thêm người dùng thất bại');
      }
    });
  }
}
