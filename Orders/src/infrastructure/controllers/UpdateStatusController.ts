import { Request, Response } from "express";
import { UpdateStatusUseCase } from "../../application/useCases/UpdateStatusUseCase";
import { RabbitMQ } from "../services/RabbitMQ";
import { BaseResponse } from "../../application/dtos/BaseResponse";

export class UpdateStatusController {

    constructor(
        readonly useCase: UpdateStatusUseCase,
        readonly mqtt: RabbitMQ
    ) { }

    async run(req: Request, res: Response) {
        try {
            const id = req.params.id
            const { status } = req.body
            if (status !== 'Pagado' && status !== 'Creado' && status !=='Enviado' && status !=='pagado' && status !== 'creado' && status !=='enviado') {
                const baseResponse = new BaseResponse(null, "Invalid status", false, 400);
                return res.status(baseResponse.statusCode).json(baseResponse);
            }
            const order = await this.useCase.run(id, status)
            if (order) {
                if (status == "enviado" || status == 'Enviado') {
                    const orderProduct = await this.useCase.runView(id)
                    await this.mqtt.sendToQueue(orderProduct)
                }
                return res.status(201).send({
                    status: "Exitoso",
                    data: order,
                    message: "Actualización del estado de la orden exitoso"
                })
            }
            return res.status(417).send({
                status: "error",
                data: [],
                message: "Actualización del estado fallido"
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