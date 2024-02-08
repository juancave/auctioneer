export class BidDto {
  readonly id: number;
  readonly auctionId: number;
  readonly date: Date;
  readonly value: number;
  readonly userId: number;

  constructor(
    id: number,
    auctionId: number,
    date: Date,
    value: number,
    userId: number,
  ) {
    this.id = id;
    this.auctionId = auctionId;
    this.date = date;
    this.value = value;
    this.userId = userId;
  }
}
