import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  loading = true;
  message = 'Đang đăng nhập bằng Google...';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = 'Không tìm thấy token!';
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    localStorage.setItem('token', token);

    const decoded: any = jwtDecode(token);
    const role = decoded.roles?.[0];

    this.message = 'Đăng nhập thành công! Đang chuyển hướng...';

    setTimeout(() => {
      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin']);
      } else if (role === 'ROLE_MANAGER') {
        this.router.navigate(['/manager']);
      } else {
        this.router.navigate(['/']);
      }
    }, 1200);
  }
}
