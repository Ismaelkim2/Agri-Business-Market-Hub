export interface Product {
    id: number;
    name: string;
    description: string;
    quantity:number;
    imageUrl: string;
    price: number;
    // orderDate:Date | null
    status:string;
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
  





