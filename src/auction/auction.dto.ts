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
  readonly tags: string[] | number[];

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
    tags: string[] | number[],
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
    this.tags = tags;
  }
}

export enum AuctionState {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}
