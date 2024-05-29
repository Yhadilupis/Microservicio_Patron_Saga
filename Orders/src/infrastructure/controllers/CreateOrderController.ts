import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/useCases/CreateOrderUseCase";

export class CreateOrderController {
    constructor(readonly useCase: CreateOrderUseCase) {
    }

    async run(req: Request, res: Response) {
        try {
            const { productId, units, total, date, status } = req.body
            const order = await this.useCase.run(productId, units, total, date, status);
            if (order) {
                return res.status(201).send({
                    status: "Exitoso",
                    data: order,
                    message: "Orden creada exitosamente"
                })
            }
            return res.status(417).send({
                status: "error",
                data: [],
                message: "Creacion de orden fallida"
            })
        } catch (e) {
            console.log("request error", e)
            return res.status(400).send({
                message: "error",
                error: e
            })
        }
    }
}