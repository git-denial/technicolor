import hidash from "../utils/hidash";
import ModelModes from "./ModelModes";

export interface IUser {
    id?: number;
    email: string;
    full_name:string
    password?: string;
    salt?: string;
    city?: string;
    province?: string;
    address?: string;
    phone_num?:string;
    zip_code?:string;
    enabled:boolean;
    created_at?: Date;
    modified_at?: Date;

}


export default class User {
    id?: number;
    email: string;
    full_name:string
    password?: string;
    salt?: string;
    city?: string;
    province?: string;
    address?: string;
    phone_num?:string;
    zip_code?:string;
    enabled:boolean
    created_at?: Date;
    modified_at?: Date;

    constructor(user: IUser, mode:ModelModes = ModelModes.READ) {
        this.id = user.id;
        this.email = user.email;
        this.full_name = user.full_name
        this.password = user.password;
        this.salt = user.salt;
        this.city = user.city;
        this.province = user.province;
        this.phone_num = user.phone_num
        this.address = user.address;
        this.zip_code = user.zip_code

        this.enabled = user.enabled

        this.created_at = mode === ModelModes.CREATE? new Date() : user.created_at? new Date(user.created_at) : undefined
        this.modified_at = mode === ModelModes.CREATE || mode === ModelModes.UPDATE? new Date(): user.modified_at? new Date(user.modified_at): undefined
        
        hidash.clean(this)
    }

    static desensitizedUserFactory(user: IUser) : User {
        let du = new User(user)
        delete du.password
        delete du.salt
        return du
    }



}