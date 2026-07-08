export interface Movement {
  id?: string;
  productId: string;
  delta: number;
  at: Date;
  byUid: string;
}