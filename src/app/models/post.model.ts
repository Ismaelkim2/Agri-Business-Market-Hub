import { User } from './user.model';

export class Post {
  id: number;
  title: string;
  productType: string;
  age?: number;
  salesAmount?: number;
  poultryType?: string;
  weight?: number;
  livestockType?: string;
  livestockDescription?: string;
  imageUrl: string;
  createdBy: string;
  likes: number;
  views: number;
  createdAt: Date;
  userDTO?: User;
  relativeCreatedAt?: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.productType = data.productType;
    this.age = data.age;
    this.salesAmount = data.salesAmount;
    this.poultryType = data.poultryType;
    this.weight = data.weight;
    this.livestockType = data.livestockType;
    this.livestockDescription = data.livestockDescription;
    this.imageUrl = data.imageUrl;
    this.createdBy = data.createdBy;
    this.likes = data.likes;
    this.views = data.views;

    // Check if createdAt is an array and convert to Date object in UTC
    if (Array.isArray(data.createdAt) && data.createdAt.length >= 3) {
      this.createdAt = new Date(Date.UTC(
        data.createdAt[0], // year
        data.createdAt[1] - 1, // month (0-based index)
        data.createdAt[2], // day
        data.createdAt[3] || 0, // hour
        data.createdAt[4] || 0, // minute
        data.createdAt[5] || 0, // second
        data.createdAt[6] || 0 // millisecond
      ));
    } else {
      this.createdAt = new Date(data.createdAt);
    }

    if (isNaN(this.createdAt.getTime())) {
      console.error('Invalid createdAt date:', data.createdAt);
    }
    this.userDTO = data.userDTO;
  }
}
