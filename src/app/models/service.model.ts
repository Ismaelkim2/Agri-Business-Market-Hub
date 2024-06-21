// src/app/models/service.model.ts
// export class Service {
//     id: number;
//     title: string;
//     description: string;
//     imageUrl: string;
  
//     constructor(id: number, title: string, description: string, imageUrl: string) {
//       this.id = id;
//       this.title = title;
//       this.description = description;
//       this.imageUrl = imageUrl;
//     }
//   }
  
// src/app/models/service.model.ts
export class Service {
  constructor(
    public id: number,
    public title: string,
    public shortDescription: string,
    public description: string,
    public imageUrl: string
  ) {}
}

  