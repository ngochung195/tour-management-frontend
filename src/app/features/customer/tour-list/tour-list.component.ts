import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../services/tour.service';
import { Tour } from '../../../models/tour.model';
import { NgFor, CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category} from '../../../models/category.model.';
import {ManagerCategoryService} from '../../../services/category.service';
import {ChatComponent} from '../chat/chat.component';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [NgFor, CommonModule, RouterLink, RouterModule, FormsModule, ChatComponent],
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

  categories: Category[] = [];

  chatOpen: boolean = false;

  apiUrl = 'http://localhost:8080';

  constructor(
    private tourService: TourService,
    private categoryService: ManagerCategoryService
  ) {}

  ngOnInit(): void {

    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => console.error(err)
    });

    this.tourService.getAll().subscribe({
      next: (data) => {
        this.allTours = data;
        this.tours = data;
      },
      error: (err) => console.error(err)
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

  search() {
    this.tourService.searchTour(
      this.keyword || undefined,
      this.startDate || undefined,
      this.endDate || undefined,
      this.categoryId ?? undefined
    ).subscribe({
      next: (res) => {
        this.tours = res;
      },
      error: (err) => console.error(err)
    });
  }

  resetFilters() {
    this.keyword = '';
    this.startDate = '';
    this.endDate = '';
    this.categoryId = null;

    this.tours = this.allTours;
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }
}
