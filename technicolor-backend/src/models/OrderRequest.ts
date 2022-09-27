interface ISimpleOrderLine {
    product_id: number,
    customization: Object,
    description?: string
    quantity: number
}

export default class OrderRequest {

    order_lines: ISimpleOrderLine[]
    delivery_method: string
    delivery_fee: number
    address_info: string
    destination: number


    constructor(requestBody : any) {
        this.order_lines = requestBody.order_lines
        this.delivery_method = requestBody.delivery_method
        this.delivery_fee = requestBody.delivery_fee
        this.address_info = requestBody.address_info
        this.destination = requestBody.destination
    }
}

