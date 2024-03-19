export class UserDto {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly currentBalance: number;

  constructor(id: number, email: string, name: string, currentBalance: number) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.currentBalance = currentBalance;
  }
}
