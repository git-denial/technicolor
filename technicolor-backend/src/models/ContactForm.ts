import hidash from "../utils/hidash";
import ModelModes from "./ModelModes";

export interface IContactForm  {
    id?: number;
    user_id?:number
    name:string
    email : string
    message : string
    phone_number: string
    created_at?: Date
}

export default class ContactForm {

    id?: number;
    user_id?:number
    name:string
    email : string
    message : string
    phone_number: string
    created_at?: Date

    constructor(contactForm: IContactForm, mode:ModelModes = ModelModes.READ) {

        this.id = contactForm.id;
        this.user_id = contactForm.user_id

        this.name = contactForm.name

        this.email = contactForm.email

        this.message = contactForm.message

        this.phone_number = contactForm.phone_number

        this.created_at = mode === ModelModes.CREATE? new Date() : contactForm.created_at? new Date(contactForm.created_at):undefined

        hidash.cleanUndefined(this)
    }

}
