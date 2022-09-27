import DatabaseService from "../services/DatabaseService";
import ContactForm from "../models/ContactForm";
import Chat from "../models/Chat";
import Product from "../models/Product";

export async function addContactForm(contactForm: ContactForm): Promise<ContactForm> {

    let result = await DatabaseService.query(`INSERT INTO contact_forms SET ?`, contactForm)
    contactForm.id = result.insertId
    return contactForm

}

export async function getContactForms(): Promise<ContactForm> {

    let rows = await DatabaseService.query(`SELECT * FROM contact_forms`)
    return rows.map((el: any) => {
        return new ContactForm(el)
    })

}

export async function getContactFormsById(id:string|number): Promise<ContactForm|null> {

    let rows = await DatabaseService.query(`SELECT * FROM contact_forms WHERE id = ?`,[id])

    if(rows.length === 0) {
        return null
    } else {
        return new ContactForm(rows[0])
    }

}

export async function getContactFormsByUserId(user_id:string|number): Promise<ContactForm> {

    let rows = await DatabaseService.query(`SELECT * FROM contact_forms WHERE user_id = ?`,[user_id])
    return rows.map((el: any) => {
        return new ContactForm(el)
    })

}

export async function update(id:number, contact_form:object):Promise<boolean>{
    let result = await DatabaseService.query(`UPDATE contact_forms SET ? WHERE id = ${id}`,[contact_form])

    return result.affectedRows === 1
}
