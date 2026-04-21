import { ToastrService } from 'ngx-toastr';

export class ToastUtil {

  static success(toastr: ToastrService, msg: string) {
    toastr.success(msg);
  }

  static warning(toastr: ToastrService, msg: string) {
    toastr.warning(msg);
  }

  static error(toastr: ToastrService, msg: string) {
    toastr.error(msg);
  }
}
