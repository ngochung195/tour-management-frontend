import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tour} from '../../../models/tour.model';
import {ActivatedRoute} from '@angular/router';
import {TourService} from '../../../services/tour.service';
import {RouterLink} from '@angular/router';
import {ItineraryService} from '../../../services/itinerary.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent  implements OnInit{
  tour?: Tour;
  apiUrl = "http://localhost:8080";
  groupedItineraries: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private itineraryService: ItineraryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const tourId = +id;

      // Load tour
      this.tourService.getById(tourId).subscribe(data => {
        this.tour = data;
      });

      // Load itinerary
      this.loadItinerary(tourId);
    }
  }

  loadItinerary(tourId: number) {
    this.itineraryService.getByTour(tourId).subscribe(data => {

      console.log("ITINERARY:", data); // debug

      const map = new Map<number, any>();

      data.forEach((item: any) => {

        // 👉 Tính ngày từ startDate
        let date = null;

        if (this.tour?.startDate) {
          const start = new Date(this.tour.startDate);
          const d = new Date(start);
          d.setDate(start.getDate() + (item.dayNumber - 1));
          date = d;
        }

        // 👉 Map field (QUAN TRỌNG)
        const mapped = {
          time: item.time,
          title: item.title || item.activity,
          description: item.description || item.detail
        };

        if (!map.has(item.dayNumber)) {
          map.set(item.dayNumber, {
            dayNumber: item.dayNumber,
            date: date,
            items: []
          });
        }

        map.get(item.dayNumber).items.push(mapped);
      });

      this.groupedItineraries = Array.from(map.values());
    });
  }

  getImageUrl(img: string): string {
    if (!img) return '';

    img = img.replace('/tours//uploads', '/uploads');

    if (img.startsWith('http')) return img;

    if (!img.startsWith('/')) {
      img = '/' + img;
    }

    return this.apiUrl + img;
  }
}
