export interface RevenueChart {
  month: number;
  total: number;
}

export interface BookingItem {
  id: number;
  bookingCode: string;
  total: number;
  quantity: number;
  status: string;
  bookingDate: string;
  tourId: number;
  tourName: string;
  userId: number;
  userName: string;
}

export interface ReviewItem {
  id: number;
  rating: number;
  reviewText: string;
  tourId: number;
  tourName: string;
  userId: number;
  userName: string;
}

export interface TopTour {
  tourId: number;
  tourName: string;
  totalBookings: number;
  revenue: number;
}

export interface TopTour {
  tourId: number;
  tourName: string;
  bookingCount: number;
  revenue: number;
}

export interface ManagerDashboard {
  totalRevenue: number;
  pendingBookings: number;
  activeTours: number;
  avgRating: number;
  revenueChart: RevenueChart[];
  recentBookings: BookingItem[];
  recentReviews: ReviewItem[];
  topTours: TopTour[];
}
