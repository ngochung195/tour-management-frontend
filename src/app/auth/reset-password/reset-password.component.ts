import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  token: string = '';
  newPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  reset() {
    if (!this.newPassword) {
      this.toastr.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    this.userService.resetPassword(this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.toastr.success('Đổi mật khẩu thành công');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {

          const message =
            err?.error?.message ||
            'Token không hợp lệ hoặc hết hạn';
          this.toastr.error(message);
        }
      });
  }
}
