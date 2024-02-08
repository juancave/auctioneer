export class AuctionDto {
  readonly id: number;
  readonly description: string;
  readonly date: Date;
  readonly value: number;
  readonly startsOn: number;
  readonly increments: number;
  readonly state: string;

  constructor(
    id: number,
    description: string,
    date: Date,
    value: number,
    startsOn: number,
    increments: number,
    state: AuctionState,
  ) {
    this.id = id;
    this.description = description;
    this.date = date;
    this.value = value;
    this.startsOn = startsOn;
    this.increments = increments;
    this.state = state;
  }
}

export enum AuctionState {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}
