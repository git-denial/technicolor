import DatabaseService from "../services/DatabaseService";
import EmailTemplate from "../models/EmailTemplate";

export enum DefaultTemplates {
    DEFAULT_WAITING_PAYMENT="DEFAULT_WAITING_PAYMENT",
    DEFAULT_PAYMENT_ACCEPTED="DEFAULT_PAYMENT_ACCEPTED",
    DEFAULT_DELIVERY="DEFAULT_DELIVERY",
    DEFAULT_ARRIVAL="DEFAULT_ARRIVAL"
}


async function getById(templateId: number|string) : Promise<EmailTemplate|null> {
    let rows = await DatabaseService.query(`SELECT * FROM email_templates WHERE id = ?` , templateId)
    return EmailTemplate.getSingle(rows)
}


async function getByName(templateName: string|DefaultTemplates) {
    let rows = await DatabaseService.query(`SELECT * FROM email_templates WHERE name = ?` , templateName)
    return EmailTemplate.getSingle(rows)
}

export default {
    getById,
    getByName
}