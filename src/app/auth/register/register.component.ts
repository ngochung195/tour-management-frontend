import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  userName = '';
  phone = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        this.userName = params['name'] || '';
        this.toastr.info('Tài khoản Google chưa đăng ký - Đăng ký ngay');
      }
    });
  }

  register() {

    if (!this.userName || !this.email || !this.password) {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.error('Email không đúng định dạng');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Mật khẩu xác nhận không khớp');
      return;
    }

    const data = {
      userName: this.userName,
      email: this.email,
      password: this.password,
      phone: this.phone
    };

    this.authService.register(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Đăng ký thành công');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Đăng ký thất bại');
      }
    });
  }
}
