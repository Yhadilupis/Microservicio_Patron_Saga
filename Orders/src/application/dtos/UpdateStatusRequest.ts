export class UpdateStatusRequest {
    public orderId: string;
    public newStatus: 'pagado' | 'creado' | 'enviado';

    constructor(orderId: string, newStatus: 'pagado' | 'creado' | 'enviado') {
        this.orderId = orderId;
        this.newStatus = newStatus;
    }
}
