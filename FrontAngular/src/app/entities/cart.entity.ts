import { User} from "./user.entity.js";

export interface Cart {
    id: string;
    shipmentType: any;
    total: number;
    state: 'Completed' | 'Pending' | 'Canceled';
    user: User;
    orders: any[];
  }