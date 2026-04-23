import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../../../../services/promotion.service';
import { ValidationUtil } from '../../../../shared/utils/validation.util';

@Component({
  selector: 'app-admin-edit-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-promotion.component.html',
  styleUrl: './edit-promotion.component.scss'
})
export class AdminEditPromotionComponent implements OnInit {

  promotion: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promotionService: PromotionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.promotionService.getById(id).subscribe(res => {
        this.promotion = res;
      });
    }
  }

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.promotion.code)) {
      this.toastr.warning('Mã khuyến mãi không được để trống');
      return false;
    }

    if (this.promotion.discount <= 0 || this.promotion.discount > 100) {
      this.toastr.warning('Giảm giá phải từ 1 - 100%');
      return false;
    }

    if (ValidationUtil.isEmpty(this.promotion.startDate)) {
      this.toastr.warning('Vui lòng chọn ngày bắt đầu');
      return false;
    }

    if (ValidationUtil.isEmpty(this.promotion.endDate)) {
      this.toastr.warning('Vui lòng chọn ngày kết thúc');
      return false;
    }

    if (new Date(this.promotion.startDate) > new Date(this.promotion.endDate)) {
      this.toastr.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }

    return true;
  }

  updatePromotion() {

    if (!this.validateForm()) return;

    this.promotionService.update(this.promotion.id, this.promotion).subscribe({
      next: () => {
        this.toastr.success('Cập nhật khuyến mãi thành công');
        this.router.navigate(['/admin/promotions']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Cập nhật thất bại');
      }
    });
  }
}
