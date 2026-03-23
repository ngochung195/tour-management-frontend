import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tour} from '../../../models/tour.model';
import {ActivatedRoute} from '@angular/router';
import {TourService} from '../../../services/tour.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent  implements OnInit{
  tour?: Tour;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit(): void{
    const id = this.route.snapshot.paramMap.get('id');

    if(id)
      this.tourService.getById(+id).subscribe(data =>{
        this.tour = data;
      });
  }
}
