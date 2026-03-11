import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';

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
  ) { }

  ngOnInit() {
    this.loadRoles();
  }

  saveUser() {
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

  goBack() {
    this.router.navigate(['/admin/users']);
  }

  loadRoles() {
    this.userService.getRoles().subscribe(res => {
      console.log(res);
      this.roles = res;
    });
  }

}