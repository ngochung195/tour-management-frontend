export interface RevenueChart {
  month: number;
  total: number;
}

export interface TopTour {
  tourId: number;
  tourName: string;
  totalBookings: number;
  revenue: number;
  location: string;
  status: 'OPEN' | 'ALMOST_FULL' | 'CLOSED';
  daysUntilStart: number;
}

export interface RecentActivity {
  type: 'BOOKING_NEW' | 'BOOKING_CANCELLED' | 'PAYMENT' | 'CONTACT' | 'TOUR_UPDATE';
  title: string;
  subtitle: string;
  timeAgo: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalTours: number;
  totalBookings: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  newContacts: number;
  revenueChart: RevenueChart[];
  topTours: TopTour[];
  recentActivities: RecentActivity[];
}
