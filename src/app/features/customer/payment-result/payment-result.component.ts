import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {

  status: 'success' | 'fail' | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status') as 'success' | 'fail';
    this.loading = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
