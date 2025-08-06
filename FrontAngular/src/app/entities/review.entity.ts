import { Product } from "./category.entity";

export interface Review {
    rating: number;
    comment: string;
    product: Product | string;
    state: 'Active' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}