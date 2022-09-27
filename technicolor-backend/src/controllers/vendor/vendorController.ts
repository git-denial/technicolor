import {NextFunction, Request, Response} from "express";
import VendorDAO from "../../daos/VendorDAO";

import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../../errors/RequestErrorCollection";
import Vendor from "../../models/Vendor";
import crypto from "../../utils/crypto";
import Valid from "../../utils/validation";
import jwt, {Secret} from "jsonwebtoken";
import ModelModes from "../../models/ModelModes";
import categoryDAO from "../../daos/categoryDAO";
import hidash from "../../utils/hidash";


export async function login(req: Request, res: Response, next: NextFunction) {
    let {email, password} = req.body;

    if(!email){
        return next(new BadRequestError('MISSING_LOGIN_CREDENTIAL'))
    }

    try {
        let vendor = await VendorDAO.getByEmail(email, true)

        if (!vendor) {
            return next(new UnauthorizedError("Email not found", "EMAIL_NOT_FOUND"))
        }

        if(!vendor.enabled){
            return next(new UnauthorizedError("ACCOUNT_SUSPENDED"))
        }

        if (!vendor.salt || !vendor.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }

        let processedPassword = crypto.generatePassword(password, vendor.salt)

        if (processedPassword !== vendor.password) {
            return next(new UnauthorizedError("Wrong password", "VENDOR_PASSWORD_WRONG"))
        }

        let desensitizedVendor: any = Vendor.desensitizedVendorFactory(vendor);

        desensitizedVendor.token = jwt.sign({
            vendor_id: vendor.id,
            email: vendor.email,
        }, <Secret>process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_DURATION
        })

        return res.send(desensitizedVendor)

    } catch (e) {
        return next(e)
    }

}

export async function getById(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.params.vendor_id
    try {
        let vendor:any = await VendorDAO.getById(vendorId)

        if(!vendor || !vendor.enabled) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        vendor.categories = await categoryDAO.getByVendorId(vendorId)

        return res.send(vendor)
    } catch (e) {
        next(new InternalServerError(e))
    }
}



export async function getMyself(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.decoded.vendor_id
    try {
        let vendor = await VendorDAO.getById(vendorId)

        if(!vendor || !vendor.enabled) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        let categories = await categoryDAO.getByVendorId(vendorId)

        return res.send({
            vendor,categories
        })
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {

    let newVendor = req.body
    let id = req.decoded.vendor_id

    if (!newVendor.new_password){
        return res.send({msg: "Please enter the new password!"})
    }

    try {
        let currentVendor = await VendorDAO.getById(id, true)

        if(!currentVendor) {
            return next(new EntityNotFoundError("Vendor", id))
        }

        if (!currentVendor.salt || !currentVendor.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }


        currentVendor.salt = crypto.generateSalt();;
        currentVendor.password = crypto.generatePassword(newVendor.new_password, <string>currentVendor.salt);

        currentVendor = new Vendor(currentVendor, ModelModes.UPDATE)

        try {
            let result = await VendorDAO.edit(id, currentVendor)

            if(!result)
                return res.send(new BadRequestError("Something went wrong..."))

            return res.send({success:true})

        } catch(err) {
            next(new InternalServerError(err))
        }

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {

    try {
        let vendorId = req.params.vendor_id
        let newVendor = req.body
        let vendor = await VendorDAO.getById(vendorId)

        if(!vendor || !vendor.enabled) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        if(newVendor.email){
            if(vendor.email !== newVendor.email && await VendorDAO.getByEmail(newVendor.email)){
                return next(new BadRequestError(`A vendor with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }

            if(!Valid.isEmailValid(newVendor.email))
                return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))
        }

        newVendor = new Vendor({...vendor,...newVendor}, ModelModes.UPDATE)

        let vendorObject = await VendorDAO.edit(vendorId, newVendor)

        if(!vendorObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}



export async function editSelf(req: Request, res: Response, next: NextFunction) {
    try {
        let vendorId = req.decoded.vendor_id
        let newVendor = req.body
        let vendor = await VendorDAO.getById(vendorId)

        if(!vendor || !vendor.enabled) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        if(newVendor.email){
            if(vendor.email !== newVendor.email && await VendorDAO.getByEmail(newVendor.email)){
                return next(new BadRequestError(`A vendor with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }

            if(!Valid.isEmailValid(newVendor.email))
                return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))
        }

        newVendor = new Vendor({...vendor,...newVendor}, ModelModes.UPDATE)

        let vendorObject = await VendorDAO.edit(vendorId, newVendor)

        if(!vendorObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function tokenLogin(req: Request, res: Response, next: NextFunction) {
    let vendorId = req.decoded.vendor_id

    try {
        let vendor = await VendorDAO.getById(vendorId)

        if (!vendor) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        if(!vendor.enabled){
            return next(new UnauthorizedError("ACCOUNT_SUSPENDED"))
        }

        res.send(vendor)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getAll(req: Request,res: Response, next:NextFunction) {
    try{
        let vendors:any = await VendorDAO.getAll()

        for(let v of vendors){
            v.categories = await categoryDAO.getByVendorId(v.id)
        }

        res.send(vendors)

    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function getByCategory(req: Request,res: Response, next:NextFunction) {
    try{
        let vendors = await VendorDAO.getByCategory(req.body.category)
        res.send(vendors)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function register(req:Request, res:Response, next: NextFunction) {

    let newVendor = hidash.checkProperty(req.body, "Vendor", "name", "email", "password", "phone_num", "description")

    if(newVendor.error_message){
        return next(newVendor)
    }
    newVendor = new Vendor(req.body, ModelModes.CREATE);

    if(!Valid.isEmailValid(newVendor.email))
        return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))

    try{

        if(await VendorDAO.getByEmail(newVendor.email)){
            return next(new BadRequestError(`A vendor with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
        }

        newVendor.salt = crypto.generateSalt();
        newVendor.password = crypto.generatePassword(newVendor.password, <string>newVendor.salt)


        let vendor = await VendorDAO.create(newVendor);

        return res.send(vendor)
    } catch(err) {
        next(new InternalServerError(err))
    }

}

export async function ban(req: Request, res: Response, next: NextFunction) {

    try {
        let vendorId = req.params.vendor_id
        let vendor = await VendorDAO.getById(vendorId)

        if(!vendor || !vendor.enabled) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        vendor = new Vendor({...vendor,enabled:false}, ModelModes.UPDATE)

        vendor = await VendorDAO.edit(vendorId, vendor)

        if(!vendor) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function unBan(req: Request, res: Response, next: NextFunction) {

    try {
        let vendorId = req.params.vendor_id
        let vendor = await VendorDAO.getById(vendorId)

        if(!vendor) {
            return next(new EntityNotFoundError("Vendor", vendorId))
        }

        vendor = new Vendor({...vendor,enabled:true}, ModelModes.UPDATE)

        vendor = await VendorDAO.edit(vendorId, vendor)

        if(!vendor) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}
