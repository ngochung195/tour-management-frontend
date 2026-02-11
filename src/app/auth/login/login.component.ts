import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const token = res.token;
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        const role = decoded.roles[0];
        localStorage.setItem('role', role);

        if (res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        }
        else if (res.role === 'ROLE_MANAGER') {
          this.router.navigate(['/manager']);
        }
        else {
          this.router.navigate(['/']);
        }
      }
    });
  }

}
