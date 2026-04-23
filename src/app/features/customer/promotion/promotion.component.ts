import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../services/promotion.service';
import { Promotion } from '../../../models/promotion.model';
import { NgFor, CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent implements OnInit {

  promotions: Promotion[] = [];

  constructor(
    private promotionService: PromotionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.promotionService.getAll().subscribe(res => {

      const now = new Date();

      this.promotions = res.filter(p => {
        const end = new Date(p.endDate);
        return p.isActive === true && end >= now;
      });

    });
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.toastr.success('Đã copy mã: ' + code, 'Thành công');
  }
}
