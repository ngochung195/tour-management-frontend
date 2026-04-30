import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  email = '';
  password = '';
  error = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {

    if (!this.email || !this.password) {
      this.toastr.warning('Vui lòng nhập đủ thông tin');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({

      next: (res) => {
        const token = res.token;
        localStorage.setItem('token', token);

        const decoded: any = jwtDecode(token);
        const role = decoded.roles?.[0];

        this.toastr.success('Đăng nhập thành công');

        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        }
        else if (role === 'ROLE_MANAGER') {
          this.router.navigate(['/manager']);
        }
        else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },

      error: (err) => {
        const msg = err.error?.message;

        if (msg === 'Tài khoản không tồn tại') {
          this.toastr.error('Tài khoản không tồn tại');
        }
        else if (msg === 'Sai email') {
          this.toastr.error('Sai email');
        }
        else if (msg === 'Sai mật khẩu') {
          this.toastr.error('Sai mật khẩu');
        }
        else if (msg === 'Vui lòng nhập đủ thông tin') {
          this.toastr.warning('Vui lòng nhập đủ thông tin');
        }
        else {
          this.toastr.error(msg || 'Đăng nhập thất bại');
        }
      }
    });
  }

  loginWithGoogle() {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  }
}
