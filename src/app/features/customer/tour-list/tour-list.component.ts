import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../services/tour.service';
import { Tour } from '../../../models/tour.model';
import { NgFor} from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [NgFor, CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];
  allTours: Tour[] = [];

  keyword: string = '';
  startDate: string = '';
  endDate: string = '';
  categoryId: number | null = null;

  categories: { id: number, name: string }[] = [];

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.tourService.getAll().subscribe(data => {
      this.tours = data;
      this.allTours = data;
      this.buildCategories();
    });
  }

  buildCategories() {
    const map = new Map<number, string>();
    this.tours.forEach(t => {
      map.set(t.categoryId, t.categoryName);
    });
    this.categories = Array.from(map, ([id, name]) => ({ id, name }));
  }

  search() {
    this.tourService.searchPublic(
      this.keyword || undefined,
      this.startDate || undefined,
      this.endDate || undefined,
      this.categoryId ?? undefined
    ).subscribe({
      next: (res) => {
        this.tours = res;
        this.buildCategories();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  resetFilters() {
    this.keyword = '';
    this.startDate = '';
    this.endDate = '';
    this.categoryId = null;
    this.tours = this.allTours;
    this.buildCategories();
  }
}
