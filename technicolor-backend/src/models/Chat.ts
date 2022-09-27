import hidash from "../utils/hidash";
import ModelModes from "./ModelModes";

export enum Sender {
    USER = "USER",
    VENDOR = "VENDOR"
}

export interface IChat  {
    id?: number;
    user_id:number
    vendor_id:number
    message : string
    sender: Sender
    created_at?: Date
}

export default class Chat {
    id?: number;
    user_id:number
    vendor_id:number
    message : string
    sender: Sender
    created_at?: Date

    constructor(chat: IChat, mode:ModelModes = ModelModes.READ) {

        this.id = chat.id;
        this.vendor_id = chat.vendor_id
        this.user_id = chat.user_id

        this.message = chat.message

        this.sender = chat.sender
        this.created_at = mode === ModelModes.CREATE? new Date() : chat.created_at? new Date(chat.created_at):undefined

        hidash.cleanUndefined(this)
    }

}
