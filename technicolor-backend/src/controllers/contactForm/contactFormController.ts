import {NextFunction, Request, Response} from "express";
import * as ContactFormDAO from "../../daos/ContactFormDAO";
import {BadRequestError, EntityNotFoundError, InternalServerError} from "../../errors/RequestErrorCollection";
import ContactForm from "../../models/ContactForm";
import ModelModes from "../../models/ModelModes";
import validation from "../../utils/validation";
import hidash from "../../utils/hidash";
import EmailService from "../../services/EmailService";
import AdminDAO from "../../daos/AdminDAO";
import EmailScenario from "../../services/EmailScenario";


export async function createContactForms(req: Request, res: Response, next:NextFunction) {

    let {name, email, phone_number, message} = req.body
    let user_id = req.decoded?.user_id? req.decoded.user_id : undefined

    let newContactForm:any = new ContactForm({
        user_id, name, email, phone_number, message
    })

    newContactForm = hidash.checkProperty(newContactForm,"Contact_form", "name", "email", "message")

    if(newContactForm.error_message){
        return next(newContactForm)
    }

    if(!validation.isEmailValid(email))
        return next(new BadRequestError("Invalid email format"))

    try{
        let result = await ContactFormDAO.addContactForm(newContactForm)
        let admins = await AdminDAO.getAll()

        for(let a of admins){

            let {subject,body} = EmailScenario.contact_form_created(newContactForm)
            await EmailService.sendEmailAsync(a.email, subject,body)
        }

        let {subject,body,config} = EmailScenario.contact_form_created(newContactForm,true)
        await EmailService.sendEmailAsync(newContactForm.email, subject,body,config)


        return res.send(result)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getAllContactForms(req: Request, res: Response, next:NextFunction) {

    try{
        let result = await ContactFormDAO.getContactForms()
        return res.send(result)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getContactFormsById(req: Request, res: Response, next:NextFunction) {

    let id = req.params.id

    try{
        let result = await ContactFormDAO.getContactFormsById(id)

        if(!result)
            return next(new EntityNotFoundError("Contact form", id))

        return res.send(result)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getContactFormsByUserId(req: Request, res: Response, next:NextFunction) {

    let id = req.params.user_id

    try{
        let result = await ContactFormDAO.getContactFormsByUserId(id)

        return res.send(result)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function update(req:Request,res:Response, next:NextFunction){
    let id = parseInt(req.params.id)
    let contact_form = new ContactForm(req.body, ModelModes.UPDATE)

    if(contact_form.email && !validation.isEmailValid(contact_form.email))
        return next(new BadRequestError("Invalid email format"))

    try{
        let result = await ContactFormDAO.update(id, contact_form)

        if(!result)
            return res.send(new BadRequestError("Failed to change"))

        return res.send({success:true})
    }
    catch(e){
        return next(new InternalServerError(e))
    }
}

