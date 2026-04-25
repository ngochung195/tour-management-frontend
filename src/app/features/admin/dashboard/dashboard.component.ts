import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { AdminDashboardService } from '../../../services/admin-dashboard.service';
import {AdminDashboard, RecentActivity} from '../../../models/admin-dashboard.model';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  data!: AdminDashboard;
  loading = true;

  // Dùng setter thay vì @ViewChild thông thường
  private _lineCanvas!: ElementRef<HTMLCanvasElement>;
  private _pieCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('lineChartRef') set lineChartRef(el: ElementRef<HTMLCanvasElement>) {
    if (el) {
      this._lineCanvas = el;
      this.renderLineChart();
    }
  }

  @ViewChild('pieChartRef') set pieChartRef(el: ElementRef<HTMLCanvasElement>) {
    if (el) {
      this._pieCanvas = el;
      this.renderPieChart();
    }
  }

  lineChart!: Chart;
  pieChart!: Chart;

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res: AdminDashboard) => {
        this.data = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Dashboard error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  renderLineChart(): void {
    if (!this._lineCanvas || !this.data?.revenueChart) return;

    if (this.lineChart) this.lineChart.destroy();

    const labels = this.data.revenueChart.map(x => `Tháng ${x.month}`);
    const values = this.data.revenueChart.map(x => Number(x.total ?? 0));

    this.lineChart = new Chart(this._lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Doanh thu',
          data: values,
          borderColor: '#ff6b00',
          backgroundColor: 'rgba(255,107,0,0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    } as any);
  }

  renderPieChart(): void {
    if (!this._pieCanvas || !this.data?.topTours) return;

    if (this.pieChart) this.pieChart.destroy();

    const labels = this.data.topTours.map(x => x.tourName);
    const values = this.data.topTours.map(x => Number(x.totalBookings ?? 0));

    this.pieChart = new Chart(this._pieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    } as any);
  }

  getActivityColor(type: RecentActivity['type']): string {
    const map: Record<string, string> = {
      BOOKING_NEW:       'green',
      BOOKING_CANCELLED: 'red',
      PAYMENT:           'green',
      CONTACT:           'blue',
      TOUR_UPDATE:       'amber'
    };
    return map[type] ?? 'gray';
  }
}
