export interface Booking {
    id?: number;
    userId: number;
    tourId: number;
    total: number;
    bookingDate?: string;
    status?: string;
    bookingCode: string;
}
