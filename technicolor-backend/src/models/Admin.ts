import ModelModes from "./ModelModes"
import hidash from "../utils/hidash";

interface IAdmin {
    id?: number|string
    username: string
    email:string
    password?: string
    salt?: string
    created_at?: Date
    modified_at?: Date
}

export default class Admin {
    id?: number|string
    username: string
    email:string
    password?: string
    salt?: string
    created_at?: Date
    modified_at?: Date

    constructor(admin: IAdmin, mode : ModelModes = ModelModes.READ) {
        this.id = admin.id
        this.username = admin.username
        this.email = admin.email
        this.password = admin.password
        this.salt = admin.salt

        this.created_at = mode === ModelModes.CREATE? new Date() : admin.created_at? new Date(admin.created_at):undefined
        this.modified_at = mode === ModelModes.CREATE || mode === ModelModes.UPDATE? new Date(): admin.modified_at? new Date(admin.modified_at):undefined

        hidash.clean(this)
    }

    static desensitizedAdminFactory(admin: IAdmin, mode: ModelModes = ModelModes.READ) {
        let a: Admin = new Admin(admin,mode)
        delete a.password
        delete a.salt
        return a
    }
}