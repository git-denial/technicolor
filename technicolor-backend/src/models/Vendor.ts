import hidash from "../utils/hidash";
import ModelModes from "./ModelModes";

export interface Ivendor {
    id?: number;
    email: string;
    password?: string;
    salt?: string;
    name: string
    phone_num:string
    city_code: string;
    logo_url?:string
    description:string
    enabled:boolean
    has_created_password:boolean
    created_at?: Date;
    modified_at?: Date;
}


export default class Vendor {
    id?: number;
    email: string;
    password?: string;
    salt?: string;
    name: string
    phone_num:string
    city_code: string;
    logo_url?:string
    description:string
    enabled:boolean
    has_created_password:boolean
    created_at?: Date;
    modified_at?: Date;

    constructor(user: Ivendor, mode:ModelModes = ModelModes.READ) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
        this.salt = user.salt;
        this.name = user.name
        this.phone_num = user.phone_num
        this.city_code = user.city_code;
        this.logo_url = user.logo_url
        this.description = user.description
        this.enabled = user.enabled
        this.has_created_password = user.has_created_password


        this.created_at = mode === ModelModes.CREATE? new Date() : user.created_at? new Date(user.created_at) : undefined
        this.modified_at = mode === ModelModes.CREATE || mode === ModelModes.UPDATE? new Date(): user.modified_at? new Date(user.modified_at): undefined

        hidash.clean(this)
    }

    static desensitizedVendorFactory(user: Ivendor) : Vendor {
        let du = new Vendor(user)
        delete du.password
        delete du.salt
        return du
    }



}