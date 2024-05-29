import { Request, Response } from "express";
import { ListOrderUseCase } from "../../application/useCases/ListOrderUseCase";


export class ListOrderController {
    constructor(readonly useCase: ListOrderUseCase) {
    }

    async run(req: Request, res: Response) {
        try {
            const orders = await this.useCase.run()
            if (orders) {
                return res.status(201).send({
                    status: "Success",
                    data: orders,
                    message: "Ordenes obtenidas exitosamente"
                })
            }
            return res.status(417).send({
                status: "error",
                data: [],
                message: "Obtencion de ordenes fallidas"
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