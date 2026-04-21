export class ValidationUtil {

  static isEmpty(value: any): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
  }

  static isTooLong(value: string, max: number): boolean {
    return !!value && value.length > max;
  }
}
