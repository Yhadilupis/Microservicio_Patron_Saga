interface Status {
    status: 'pagado' | 'creado' | 'enviado';
}

export class CreateOrderRequest {
    public total: number;
    public status: Status;

    constructor(total: number, status: Status) {
        this.total = total;
        this.status = status;
    }
}