import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './manager-layout.component.html',
  styleUrls: ['./manager-layout.component.scss']
})
export class ManagerLayoutComponent {

  isMenuOpen = false;
  isChildActive = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.router.events.subscribe(() => {
      const url = this.router.url;

      this.isChildActive =
        url.includes('/manager/tours') ||
        url.includes('/manager/bookings') ||
        url.includes('/manager/categories');

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
