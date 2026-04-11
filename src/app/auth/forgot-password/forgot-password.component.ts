import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  email: string = '';

  constructor(
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  send() {
    if (!this.email) {
      this.toastr.error('Vui lòng nhập email');
      return;
    }

    this.userService.forgotPassword(this.email)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message || 'Email đã được gửi');
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Gửi email thất bại');
        }
      });
  }
}
