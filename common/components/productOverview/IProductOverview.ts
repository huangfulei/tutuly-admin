export interface IProductOverview {
    id: string;
    name: string;
    rating: number;
    labels: string[];
    description: string;
    details: {
      name: string;
      items: string[];
    }[];
    variants: {
      name: string;
      price: number;
      images: {
        id: number;
        name: string;
        src: string;
        alt: string;
      }[];
      stock: number;
      bgColor: string;
    }[];
  }
  