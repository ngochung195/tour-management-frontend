import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}