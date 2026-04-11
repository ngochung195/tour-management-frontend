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
        if (err.status === 401) {
          this.toastr.error('Sai email hoặc mật khẩu');
        }
        else if (err.error?.message) {
          this.toastr.error(err.error.message);
        }
        else {
          this.toastr.error('Đăng nhập thất bại');
        }
      }
    });
  }

  loginWithGoogle() {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  }
}
