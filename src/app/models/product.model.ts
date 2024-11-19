export interface Product {
  id: number;
  name: string;
  quantity: number;
  description: string;
  imageUrl: string;
  price: number;
  status: string;
  mediaType?: 'image' | 'video'; 
}

  export interface Order {
    id: number;
    clientName: string;
    orderDate: string;
    item: string;
    status: string;
    clientId:number;
  }

  export interface ChartData{
    labels: string[];
    values: number[];
  }
  





