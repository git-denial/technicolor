import {NextFunction, Request, Response} from "express";
import * as ChatDAO from "../../daos/ChatDAO";
import {BadRequestError, EntityNotFoundError, InternalServerError} from "../../errors/RequestErrorCollection";
import Chat, {Sender} from "../../models/Chat";
import EmailService from "../../services/EmailService";
import VendorDAO from "../../daos/VendorDAO";
import EmailScenario from "../../services/EmailScenario";
import UserDAO from "../../daos/UserDAO";


export async function addChatUser(req: Request,res: Response, next:NextFunction) {

    let {vendor_id, message} = req.body
    let user_id = req.decoded.user_id

    let newChat = new Chat({
        vendor_id, message, user_id, sender : Sender.USER
    })

    try{
        let chat = await ChatDAO.addChat(newChat)

        let vendor = await VendorDAO.getById(vendor_id)
        let user = await UserDAO.getById(user_id)
        if(!vendor){
            return next(new EntityNotFoundError("Vendor", vendor_id))
        }
        if(!user){
            return next(new EntityNotFoundError("User", user_id))
        }

        let {subject,body} = EmailScenario.chat_received(user.full_name,message,newChat.sender)
        await EmailService.sendEmailAsync(vendor.email,subject,body)

        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function addChatVendor(req: Request, res: Response, next:NextFunction) {

    let {user_id, message} = req.body
    let vendor_id = req.decoded.vendor_id

    let newChat = new Chat({
        vendor_id, message, user_id, sender : Sender.VENDOR
    })

    try{
        let chat = await ChatDAO.addChat(newChat)

        let vendor = await VendorDAO.getById(vendor_id)
        let user = await UserDAO.getById(user_id)
        if(!vendor){
            return next(new EntityNotFoundError("Vendor", vendor_id))
        }
        if(!user){
            return next(new EntityNotFoundError("User", user_id))
        }

        let {subject,body,config} = EmailScenario.chat_received(vendor.name,message, newChat.sender)
        await EmailService.sendEmailAsync(user.email,subject,body,config)

        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getChatFromUserToVendor(req: Request, res: Response, next:NextFunction) {

    let {vendor_id} = req.params
    let user_id = req.decoded.user_id

    try{
        let chat = await ChatDAO.getChatBetweenIds(user_id, vendor_id)
        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}



export async function getChatFromVendorToUser(req: Request, res: Response, next:NextFunction) {

    let {user_id} = req.params
    let vendor_id = req.decoded.vendor_id

    try{
        let chat = await ChatDAO.getChatBetweenIds(user_id, vendor_id)
        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}


export async function getChatPartnersForVendor(req : Request, res:Response, next:NextFunction){

    let vendor_id = req.decoded.vendor_id

    try{
        let chat = await ChatDAO.getAllChatPartnerForVendor(vendor_id)
        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getChatPartnersForUser(req : Request, res:Response, next:NextFunction){

    let user_id = req.decoded.user_id

    try{
        let chat = await ChatDAO.getAllChatPartnerForUser(user_id)
        return res.send(chat)
    }
    catch(e){
        next(new InternalServerError(e))
    }


}

