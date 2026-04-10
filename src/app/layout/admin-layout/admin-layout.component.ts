import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {authGuard} from '../../guards/auth.guard';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isMenuOpen = false;
  isChildActive = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.router.events.subscribe(() => {
      const url = this.router.url;

      this.isChildActive =
        url.includes('/admin/users') ||
        url.includes('/admin/tours') ||
        url.includes('/admin/bookings');

      if (this.isChildActive) {
        this.isMenuOpen = true;
      }
    });
  }

  showDropdown = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  getUsername(): string {
    return this.authService.getUsername();
  }

  getAvatar(): string {
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showDropdown = false;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.dropdownRef?.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
