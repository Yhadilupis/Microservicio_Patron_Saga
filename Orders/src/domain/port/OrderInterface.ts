import { Order } from "../Entities/Order";
import { OrderProduct } from "../Entities/OrderProduct";

export interface OrderInterface {
    create(
        productId: string,
        units: number,
        total: number,
        date: Date,
        status: string
    ): Promise<Order | null>
    updateStatus(id: string, status: string): Promise<Order | null>
    getAll(): Promise<Order[] | null>
    getOrderProducts(orderId: string): Promise<OrderProduct[] | null>
}