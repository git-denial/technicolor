import ModelModes from "./ModelModes";
import hidash from "../utils/hidash";

export enum EmailScenarios {
    WAITING_PAYMENT="WAITING_PAYMENT",
    PAYMENT_SUCCESS="PAYMENT_SUCCESS",
    DELIVERY="DELIVERY",
    ARRIVAL="ARRIVAL"
}

interface IEmailTemplate{
    id?: number|string,
    name: string,
    scenario: EmailScenarios,
    subject_template: string,
    body_template: string,
    created_at: Date,
    modified_at?: Date
}

export default class EmailTemplate {
    id?: number|string
    name: string
    scenario: EmailScenarios
    subject_template: string
    body_template: string
    created_at: Date
    modified_at?: Date

    constructor(t: IEmailTemplate , mode:ModelModes=ModelModes.READ) {
        this.id = t.id
        this.name = t.name
        this.scenario = t.scenario
        this.subject_template = t.subject_template
        this.body_template = t.body_template
        this.created_at = new Date()

        this.created_at = new Date()
        if(mode === ModelModes.CREATE) {
            hidash.clean(this)
        } else if(mode === ModelModes.READ) {
            this.created_at = new Date(t.created_at)
            this.modified_at = t.modified_at ? new Date(t.modified_at) : undefined
        } else if(mode === ModelModes.UPDATE) {
            this.created_at = new Date(t.created_at)
            this.modified_at = new Date()
            hidash.clean(this)
        }
    }

    static getSingle(rows: any[]) {
        return rows[0] ? new EmailTemplate(rows[0]) : null
    }

    static getMulti(rows: any[]) {
        return rows.map((el:any)=>new EmailTemplate(el))
    }

}

