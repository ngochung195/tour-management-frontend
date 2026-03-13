import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  ) { }

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

  updateUser() {
    console.log(this.user);

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

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
