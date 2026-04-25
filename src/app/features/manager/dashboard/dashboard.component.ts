import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerDashboardService } from '../../../services/manager-dashboard.service';
import { ManagerDashboard } from '../../../models/manager-dashboard.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {

  dashboard!: ManagerDashboard;
  loading = true;

  chartData: { month: string; revenue: number }[] = [];
  donutSegments: { color: string; dash: string; offset: string }[] = [];

  readonly MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  readonly donutColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444'];

  constructor(private service: ManagerDashboardService) {}

  ngOnInit(): void {
    this.service.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
        this.buildChart(res);
        this.buildDonut(res.topTours ?? []);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildChart(res: ManagerDashboard): void {
    const revenueMap = new Map<number, number>();
    res.revenueChart?.forEach(r =>
      revenueMap.set(r.month, Number(r.total) || 0)
    );
    this.chartData = Array.from({ length: 12 }, (_, i) => ({
      month: this.MONTH_LABELS[i],
      revenue: revenueMap.get(i + 1) ?? 0
    }));
  }

  private buildDonut(tours: { totalBookings: number }[]): void {
    const circumference = 2 * Math.PI * 40;
    const total = tours.reduce((s, t) => s + t.totalBookings, 0) || 1;
    let accumulated = 0;
    this.donutSegments = tours.map((t, i) => {
      const fraction = t.totalBookings / total;
      const dashLen = fraction * circumference;
      const gapLen = circumference - dashLen;
      const offset = -(accumulated * circumference) + circumference / 4;
      accumulated += fraction;
      return {
        color: this.donutColors[i % this.donutColors.length],
        dash: `${dashLen.toFixed(2)} ${gapLen.toFixed(2)}`,
        offset: offset.toFixed(2)
      };
    });
  }

  getMaxRevenue(): number {
    const max = Math.max(...this.chartData.map(d => d.revenue));
    return max === 0 ? 1 : max;
  }

  getBarHeight(revenue: number): number {
    const max = this.getMaxRevenue();

    if (max === 0) return 0;

    const percent = (revenue / max) * 100;

    if (revenue > 0 && percent < 5) return 5;

    return percent;
  }

  formatCurrency(value: number): string {
    if (!value) return '0 đ';
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + ' tỷ';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + ' triệu';
    return value.toLocaleString('vi-VN') + ' đ';
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#3B82F6','#8B5CF6','#F59E0B','#10B981','#EF4444','#EC4899'];
    let hash = 0;
    for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 's-confirmed', PENDING: 's-pending', CANCELLED: 's-cancelled'
    };
    return map[status] ?? '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CONFIRMED: 'Xác nhận', PENDING: 'Chờ duyệt', CANCELLED: 'Đã hủy'
    };
    return map[status] ?? status;
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getTopTourWidth(count: number): number {
    const max = Math.max(...(this.dashboard.topTours?.map(t => t.totalBookings) ?? [1]), 1);
    return Math.round((count / max) * 100);
  }

  getTopTourColor(index: number): string {
    return this.donutColors[index % this.donutColors.length];
  }
}
