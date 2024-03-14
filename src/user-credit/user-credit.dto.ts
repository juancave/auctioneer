export class UserCreditDto {
  readonly id: number;
  readonly value: number;
  readonly state: string;
  readonly type: string;
  readonly userId: number;

  constructor(
    id: number,
    value: number,
    state: string,
    type: string,
    userId: number,
  ) {
    this.id = id;
    this.value = value;
    this.state = state;
    this.type = type;
    this.userId = userId;
  }
}
