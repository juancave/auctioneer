export class AuctionDto {
  readonly id: number;
  readonly description: string;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly date: Date;
  readonly value: number;
  readonly minBid: number;
  readonly increments: number;
  readonly state: string;

  constructor(
    id: number,
    description: string,
    startsOn: string,
    endsOn: string,
    date: Date,
    value: number,
    minBid: number,
    increments: number,
    state: AuctionState,
  ) {
    this.id = id;
    this.description = description;
    this.startsOn = startsOn;
    this.endsOn = endsOn;
    this.date = date;
    this.value = value;
    this.minBid = minBid;
    this.increments = increments;
    this.state = state;
  }
}

export enum AuctionState {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}
