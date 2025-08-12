import { User } from "./user.entity.js";
import { Order } from "./order.entity.js";

export interface Cart {
    id: string;
    shipmentType?: any; 
    total: number;
    state: 'Completed' | 'Pending' | 'Canceled';
    user: User;
    orders: Order[]; 
    date?: Date; 
    deliveryType: string; 
    deliveryAddress: string;
    paymentMethod: string; 
    contactNumber: string;
    additionalInstructions?: string;
    
}
