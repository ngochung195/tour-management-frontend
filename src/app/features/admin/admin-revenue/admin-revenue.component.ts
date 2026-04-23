import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueService } from '../../../services/revenue.service';
import Chart, { ChartOptions } from 'chart.js/auto';

interface Revenue {
  time: number;
  revenue: number;
}

@Component({
  selector: 'app-admin-revenue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-revenue.component.html',
  styleUrls: ['./admin-revenue.component.scss']
})
export class AdminRevenueComponent implements OnInit {

  months: Revenue[] = [];
  quarters: Revenue[] = [];

  monthChart: any;
  quarterChart: any;

  constructor(private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.loadMonth();
    this.loadQuarter();
  }

  loadMonth() {
    this.revenueService.getByMonth().subscribe({
      next: (res) => {
        this.months = res ?? [];
        setTimeout(() => this.renderMonthChart(), 0);
      },
      error: (err) => console.error(err)
    });
  }

  loadQuarter() {
    this.revenueService.getByQuarter().subscribe({
      next: (res) => {
        this.quarters = res ?? [];
        setTimeout(() => this.renderQuarterChart(), 0);
      },
      error: (err) => console.error(err)
    });
  }

  getChartOptions(): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: { display: true },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#1f2937',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            label: (context) => {
              return 'Doanh thu: ' + Number(context.raw).toLocaleString() + ' đ';
            }
          }
        }
      },

      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      },

      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: (value) => Number(value).toLocaleString()
          }
        }
      }
    };
  }

  renderMonthChart() {
    const labels = this.months.map(m => `T${m.time}`);
    const data = this.months.map(m => m.revenue);

    if (this.monthChart) this.monthChart.destroy();

    this.monthChart = new Chart('monthChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Doanh thu theo tháng',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
          barPercentage: 0.6,
          categoryPercentage: 0.6
        }]
      },
      options: this.getChartOptions()
    });
  }

  renderQuarterChart() {
    const labels = this.quarters.map(q => `Q${q.time}`);
    const data = this.quarters.map(q => q.revenue);

    if (this.quarterChart) this.quarterChart.destroy();

    this.quarterChart = new Chart('quarterChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Doanh thu theo quý',
          data,
          backgroundColor: 'rgba(34, 197, 94, 0.4)',   // ✅ đồng bộ màu xanh btn-success
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(34, 197, 94, 0.7)',
          barPercentage: 0.6,
          categoryPercentage: 0.6
        }]
      },
      options: this.getChartOptions()
    });
  }
}
