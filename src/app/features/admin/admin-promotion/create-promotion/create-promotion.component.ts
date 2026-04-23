import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../../../../services/promotion.service';

import { ValidationUtil } from '../../../../shared/utils/validation.util';
import { ToastUtil } from '../../../../shared/utils/toast.util';

@Component({
  selector: 'app-admin-create-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-promotion.component.html',
  styleUrl: './create-promotion.component.scss'
})
export class AdminCreatePromotionComponent {

  promotion: any = {
    code: '',
    discount: 0,
    startDate: '',
    endDate: '',
    isActive: true
  };

  constructor(
    private promotionService: PromotionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  goBack() {
    this.router.navigate(['/admin/promotions']);
  }

  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.promotion.code)) {
      ToastUtil.warning(this.toastr, 'Mã khuyến mãi không được để trống');
      return false;
    }

    if (this.promotion.discount <= 0) {
      ToastUtil.warning(this.toastr, 'Giảm giá phải lớn hơn 0');
      return false;
    }

    if (this.promotion.discount > 100) {
      ToastUtil.warning(this.toastr, 'Giảm giá không được vượt quá 100%');
      return false;
    }

    if (ValidationUtil.isEmpty(this.promotion.startDate)) {
      ToastUtil.warning(this.toastr, 'Vui lòng chọn ngày bắt đầu');
      return false;
    }

    if (ValidationUtil.isEmpty(this.promotion.endDate)) {
      ToastUtil.warning(this.toastr, 'Vui lòng chọn ngày kết thúc');
      return false;
    }

    if (new Date(this.promotion.startDate) > new Date(this.promotion.endDate)) {
      ToastUtil.warning(this.toastr, 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }

    return true;
  }

  savePromotion() {

    if (!this.validateForm()) return;

    const data = {
      code: this.promotion.code,
      discount: this.promotion.discount,
      startDate: this.promotion.startDate,
      endDate: this.promotion.endDate,
      isActive: this.promotion.isActive
    };

    this.promotionService.create(data).subscribe({
      next: () => {
        ToastUtil.success(this.toastr, 'Thêm khuyến mãi thành công');
        this.router.navigate(['/admin/promotions']);
      },
      error: (err) => {
        ToastUtil.error(this.toastr, err?.error?.message || 'Thêm thất bại');
      }
    });
  }
}
