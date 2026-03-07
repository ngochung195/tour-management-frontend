import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerTourService } from '../../../../services/manager-tour.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-tour.component.html',
  styleUrl: './edit-tour.component.scss'
})
export class EditTourComponent implements OnInit {

  tour: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private managerTourService: ManagerTourService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCategories();

    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.managerTourService.getTourById(id).subscribe(res => {
        this.tour = res;
      });
    }
  }

  updateTour() {
    this.managerTourService.updateTour(this.tour.id, this.tour).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thành công');
        this.router.navigate(['/manager/tours']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }

  categories: any[] = [];

  loadCategories() {
    this.managerTourService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }
}
