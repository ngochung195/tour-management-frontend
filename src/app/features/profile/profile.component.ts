import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Location} from '@angular/common';

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
    private location: Location
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
        alert('Cập nhật thành công!');
      },
      error: (err) => {
        console.error('Cập nhật thất bại:', err);
      }
    });
  }

  goBack(){
    this.location.back();
  }
}
