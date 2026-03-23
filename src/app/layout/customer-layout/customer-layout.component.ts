import {Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.scss'
})
export class CustomerLayoutComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }
  showDropdown = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  onBookNow() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tour-list']);
    }
    else {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/tour-list']);
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/']);
  }


  toggleDropdown(){
    this.showDropdown = !this.showDropdown;
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }

  getAvatar(): string {
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.dropdownRef?.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
