export class AuctionDto {
  readonly id: number;
  readonly description: string;
  readonly date: Date;
  readonly value: number;
  readonly startsOn: number;
  readonly increments: number;
  readonly state: string;
}

export enum AuctionState {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}
