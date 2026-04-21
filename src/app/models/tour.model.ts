export interface Tour {
    id: number;
    categoryId: number;
    categoryName: string;
    tourName: string;
    hotelName?: string;
    vehicleName?: string;
    quantity: number;
    startDate: string;
    endDate: string;
    description: string;
    img: string;
    price: number;
}
