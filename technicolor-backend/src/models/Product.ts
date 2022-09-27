import hidash from "../utils/hidash";
import ModelModes from "./ModelModes";

export interface IProduct  {
    id?: number;
    vendor_id:number
    name: string
    price : number
    description?: string
    size:string[]|string
    size_description?: string
    weight:number
    main_photo_url?:string
    photos?:object
    available:boolean
    active:boolean
}

export default class Product {
    id?: number;
    vendor_id:number
    name: string
    price : number
    description?: string
    size:string[]|string
    size_description?: string
    weight:number
    main_photo_url?:string
    photos?:object|string
    available:boolean
    active:boolean

    constructor(product: IProduct, mode:ModelModes = ModelModes.READ) {

        this.id = product.id;
        this.vendor_id = product.vendor_id

        this.name = product.name
        this.price = product.price
        this.description = product.description
        this.size = product.size
        this.size_description = product.size_description
        this.weight = product.weight
        this.main_photo_url = product.main_photo_url
        this.photos = product.photos
        this.available = product.available
        this.active = product.active


        hidash.cleanUndefined(this)
    }

    toObjectForm():Product {
        if(typeof this.photos === "string") {
            this.photos = JSON.parse(<string>this.photos)
        }
        if(typeof this.size === "string") {
            this.size = JSON.parse(<string>this.size)
        }
        return this
    }

    toStringForm():Product{
        if(typeof this.photos  === "object") {
            this.photos = JSON.stringify(this.photos)
        }

        if(typeof this.size === "object") {
            this.size = JSON.stringify(this.size)
        }
        /*if(Array.isArray(this.image_array)) {
            this.image_array = JSON.stringify(this.image_array)
        }*/

        return this
    }
}
