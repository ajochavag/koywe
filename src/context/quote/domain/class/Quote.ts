export class Quote {
  constructor(
    readonly id: string,
    readonly from: string,
    readonly to: string,
    readonly amount: number,
    readonly rate: number,
    readonly convertedAmount: number,
    readonly timestamp: string,
    readonly expiresAt: string,
  ) { }
}