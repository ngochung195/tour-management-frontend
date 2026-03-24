import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../../../services/tour.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-create-tour',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.scss'
})
export class AdminCreateTourComponent {
  tour: any = {
    tourName: '',
    categoryId: null,
    quantity: 0,
    price: 0,
    startDate: '',
    endDate: '',
    description: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;


  constructor(
    private tourService: TourService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  goBack() {
    this.router.navigate(['/admin/tours']);
  }

  categories: any[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.tourService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  saveTour() {
    const formData = new FormData();
    formData.append('tourName', this.tour.tourName);
    formData.append('categoryId', this.tour.categoryId);
    formData.append('price', this.tour.price);
    formData.append('quantity', this.tour.quantity);
    formData.append('startDate', this.tour.startDate);
    formData.append('endDate', this.tour.endDate);
    formData.append('description', this.tour.description);

    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    this.tourService.createTour(formData).subscribe({
      next: () => {
        this.toastr.success('Thêm tour thành công');
        this.router.navigate(['/admin/tours']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Thêm tour thất bại");
      }
    });
  }
}
