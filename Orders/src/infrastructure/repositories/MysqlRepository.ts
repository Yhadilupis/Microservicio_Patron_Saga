import { Order } from "../../domain/Entities/Order";
import { query } from "../../database/mysql";
import { OrderInterface } from "../../domain/port/OrderInterface";
import { OrderProduct } from "../../domain/Entities/OrderProduct";
import { v4 as uuidv4 } from 'uuid';


export class MysqlOrderRepository implements OrderInterface {

    //Recupera una orden de la base de datos según su ID.
    async getOrder(id: string) {
        const sql = "SELECT * FROM Orders WHERE id = ? AND deleted_at IS NULL"
        const params: any[] = [id]
        try {
            const [result]: any = await query(sql, params)
            const order = result[0]
            return new Order(order.id, order.total, order.date, order.status, order.deleted_at)
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async create(productId: string, units: number, total: number, date: Date, status: string): Promise<Order | null> {
        //Utiliza la función uuidv4 para generar un nuevo ID para la orden.
        const id = uuidv4()
        if (id != undefined) {
            //Inserta la nueva orden en la tabla Orders.
            const sql = "INSERT INTO orders(id,total,date,status) VALUES(?,?,?,?)"
            const params: any[] = [id, total, new Date(), status]
            console.log(id, total, new Date(), status)
            try {
                const [result]: any = await query(sql, params)
                console.log(result);
                if (result) {
                    //Inserta los productos asociados a la orden en la tabla Orders_Products.
                    const sql = "INSERT INTO Orders_Products(order_id,product_id,units,price) VALUES (?,?,?,?)"
                    const params: any[] = [id, productId, units, total]
                    const [result]: any = await query(sql, params)
                    return this.getOrder(id)
                }
            } catch (e) {
                console.log("repository error\n", e)
                return null
            }
        }
        return null
    }

    //Cambia el estado de una orden existente en la base de datos.
    async updateStatus(id: string, status: string): Promise<Order | null> {
        //Actualiza el estado de la orden en la tabla Orders.
        const sql = "UPDATE Orders SET status = ? WHERE id=? AND deleted_at IS NULL"
        const params: any[] = [status, id]
        try {
            const [result]: any = await query(sql, params)
            if (result) {
                return await this.getOrder(id)
            }
            return null;
        } catch (e) {
            console.log("repository error:\n", e)
            return null;
        }
    }

    //Construye y devuelve una matriz de objetos Order
    async getAll(): Promise<Order[] | null> {
        const sql = "SELECT * FROM Orders WHERE deleted_at IS NULL"
        try {
            const [result]: any = await query(sql, [])
            return result.map((orderData: any) =>
                new Order(
                    orderData.id,
                    orderData.total,
                    orderData.date,
                    orderData.status,
                    orderData.deleted_at
                )
            )
        } catch (e) {
            console.log("repository error:\n", e)
            return null;
        }

    }

    //Recupera los productos asociados a una orden específica de la base de datos.
    async getOrderProducts(orderId: string): Promise<OrderProduct[] | null> {
        try {
            const sql = "SELECT * FROM Orders_Products WHERE order_id=? AND deleted_at IS NULL"
            const params: any[] = [orderId]
            const [results]: any = await query(sql, params)
            if (results) {
                return results.map((result: any) =>
                    new OrderProduct(orderId, result.product_id, result.units, result.price, null)
                );
            } else {
                return null;
            }
        } catch (e) {
            console.log("repository error:\n", e)
            return null;
        }
    }

}