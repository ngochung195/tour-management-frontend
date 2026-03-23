import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user: User = {
    id: 0,
    userName: '',
    password: '',
    email: '',
    roleName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    needRelogin: false
  };

  isLoaded: boolean = false;

  constructor(
    private userService: UserService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res: User) => {
        this.user = res;
        this.isLoaded = true;
      },
      error: (err) => {
        console.error('Lỗi khi load user:', err);
      }
    });
  }

  saveProfile() {
    this.userService.updateProfile(this.user).subscribe({
      next: (res) => {
        this.toastr.success('Cập nhật thành công!');
        this.goBack();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại')
      }
    });
  }

  goBack(){
    this.location.back();
  }
}
