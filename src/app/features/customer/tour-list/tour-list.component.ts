import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../services/tour.service';
import { Tour } from '../../../models/tour.model';
import { NgFor, CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [NgFor, CurrencyPipe, CommonModule, RouterLink, RouterModule],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    this.tourService.getAll().subscribe(data => {
      this.tours = data;
      console.log('Tours from API: ', data);
    });
  }
}
