export class ResponseDto {
  readonly data: any;
  readonly success: boolean;

  constructor(data: any) {
    this.data = data;
    this.success = true;
  }
}
