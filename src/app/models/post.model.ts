
export interface User {
  id: number;
  userImageUrl: string;
  firstName: string;
  lastName: string;
  phoneNumber:Number;
}

export interface Post {
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
  userDTO: User;
}


export interface Post {
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
  userImageUrl: string; 
  userFirstName: string; 
  userLastName: string; 
  likes: number;
  views: number;
}
