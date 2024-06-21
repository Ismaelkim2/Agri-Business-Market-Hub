// post.model.ts or wherever your Post interface or class is defined

export interface Post {
  id: number;
  title: string;
  content: string;
  productType: string;
  age?: number; // Optional fields
  salesAmount?: number;
  poultryType?: string;
  weight?: number;
  livestockType?: string;
  livestockDescription?: string;
  imageUrl: string;
  createdBy: string;
  likes: number;
  views: number;
}
