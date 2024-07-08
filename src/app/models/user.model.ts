export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    above18: boolean;
    userImageUrl?: string;
    createdBy: string;
    documentUrls: string[]; 
  }
  

  export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    above18: boolean;
    userImageUrl: string;
    createdBy: string;
    documentUrls: string[];
  }
  