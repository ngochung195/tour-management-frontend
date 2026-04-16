export interface Itinerary {
  id: number;
  tourId: number;
  tourName?: string;
  dayNumber: number;
  time: string;
  activity: string;
  description?: string;
}
export interface ItineraryRequest {
  tourId: number;
  dayNumber: number;
  time: string;
  activity: string;
  description?: string;
}
