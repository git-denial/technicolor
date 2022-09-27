import ModelModes from "./ModelModes";
import hidash from "../utils/hidash";
import Product from "./Product";

interface IOrderLine{
    id? : number
    order_id: number
    product_id: number
    price: number
    customization: Object|string
    quantity: number
    description?: string
    created_at?: Date
    product?: Product
}

export default class OrderLine {
    id? : number
    order_id: number
    product_id: number
    product?: Product
    price: number
    customization: Object|string
    quantity: number
    description?: string
    created_at?: Date

    constructor(ol : IOrderLine , modes : ModelModes = ModelModes.READ) {
        this.id = ol.id
        this.order_id = ol.order_id
        this.product_id = ol.product_id

        this.price = ol.price
        this.customization = ol.customization
        this.description = ol.description
        this.quantity = ol.quantity

        this.product = ol.product

        this.created_at = modes === ModelModes.CREATE? new Date(): ol.created_at? new Date(ol.created_at) : undefined

        hidash.clean(this)

    }

    toObjectForm() {
        if(typeof this.customization === "string") {
            this.customization = JSON.parse(<string>this.customization)
        }
    }

    toStringForm() {
        if(typeof this.customization === "object") {
            this.customization = JSON.stringify(this.customization)
        }
    }

    static getOrderLines(rows: any[]) : OrderLine[] {
        return rows.map( (r:any) => {

            if(r.p_name) {
                r.product = new Product({
                    vendor_id:r.p_vendor_id,
                    name: r.p_name,
                    price : r.p_price,
                    description : r.p_description,
                    size:r.p_size,
                    size_description : r.p_size_description,
                    main_photo_url : r.p_main_photo_url,
                    photos : r.p_photos,
                    available : r.p_available,
                    active : r.p_active,
                    weight:r.p_weight
                    
                })
            }

            r.product.toObjectForm()
            let orderline = new OrderLine(r)
            orderline.toObjectForm()

            return orderline
        })
    }

    static getSingleOrderLine(rows: any[]) : OrderLine|null {
        if(rows.length === 0 ) {
            return null
        } else {
            return new OrderLine(rows[0])
        }
    }

    static prepareNewWithoutOrderId(productId: number, price: number, quantity: number, customization: Object|string, description?: string) : OrderLine {
        return new OrderLine({
            order_id: -1,
            product_id: productId,
            price:price,
            quantity: quantity,
            customization: customization,
            created_at: new Date()})
    }
}

