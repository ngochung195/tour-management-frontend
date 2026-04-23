import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact.service';
import { ToastrService } from 'ngx-toastr';

import { ValidationUtil } from '../../../shared/utils/validation.util';
import { ToastUtil } from '../../../shared/utils/toast.util';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  /* ================= VALIDATE LIKE TOUR ================= */
  validateForm(): boolean {

    if (ValidationUtil.isEmpty(this.form.value.userName)) {
      ToastUtil.warning(this.toastr, 'Họ tên không được để trống');
      return false;
    }

    const emailControl = this.form.get('email');

    if (emailControl?.hasError('required')) {
      ToastUtil.warning(this.toastr, 'Email không được để trống');
      return false;
    }

    if (emailControl?.hasError('email')) {
      ToastUtil.warning(this.toastr, 'Email không đúng định dạng');
      return false;
    }

    if (ValidationUtil.isEmpty(this.form.value.message)) {
      ToastUtil.warning(this.toastr, 'Nội dung không được để trống');
      return false;
    }

    return true;
  }

  /* ================= SUBMIT ================= */
  submit(): void {

    if (!this.validateForm()) return;

    this.contactService.sendContact(this.form.value)
      .subscribe({
        next: () => {
          ToastUtil.success(this.toastr, 'Gửi liên hệ thành công');
          this.form.reset();
        },
        error: (err) => {
          ToastUtil.error(this.toastr, err?.error?.message || 'Gửi thất bại');
        }
      });
  }
}
