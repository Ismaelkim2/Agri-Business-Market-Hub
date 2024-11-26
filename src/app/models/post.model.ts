import { User, UserDTO } from './user.model';

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
  imageUrl: string |null;
  createdBy: string;
  likes: number;
  DatePipe:any
  views: number;
  quantity?:number;
  createdAt: Date;
  userDTO?: UserDTO | null; 
  userId?:number;
  relativeCreatedAt?: string;
  likedBy?: number[]; 
  likedByUser: boolean; 
  isOwnedByLoggedInUser: boolean;

  constructor(data: any, currentUserId: number) {
    this.id = data.id;
    this.userId=data.user;
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


    this.userDTO = data.userDTO || null;


    this.isOwnedByLoggedInUser = data.userDTO?.id === currentUserId;


    this.likedBy = data.likedBy;

    // Determine if the current user has liked this post
    this.likedByUser = Array.isArray(this.likedBy) ? this.likedBy.includes(currentUserId) : false;
  }
}
