import {
    BadRequestError,
    HandledInternalServerError,
    InternalServerError,
    UnauthorizedError
} from "../errors/RequestErrorCollection";
import {NextFunction, Request, Response} from "express";
import crypto from "../utils/crypto";
import jwt, {Secret} from "jsonwebtoken";
import Admin from "../models/Admin";
import AdminDAO from "../daos/AdminDAO";
import VendorDAO from "../daos/VendorDAO";
import * as ProductDAO from "../daos/ProductDAO";
import Vendor from "../models/Vendor";

/**
 * @api
 * @param req
 * @param res
 * @param next
 */

async function login(req:any,res:any,next:NextFunction){
    let {username, password, admin} = req.body

    if(!username || !password)
        return next(new BadRequestError("MISSING_LOGIN_CREDENTIAL"))


    try{
        if(admin)
        {
            try {

                let admin:any = await AdminDAO.getByUsername(username, true)

                if(!admin)
                    return next(new UnauthorizedError("EMAIL_NOT_FOUND"))

                if (!admin.salt || !admin.password) {
                    return next(new Error("CREDENTIAL_CORRUPT"))
                }

                let processedPassword = crypto.generatePassword(password, admin.salt)

                if (processedPassword !== admin.password) {
                    return next(new UnauthorizedError("Wrong password", "ADMIN_PASSWORD_WRONG"))
                }

                admin = Admin.desensitizedAdminFactory(admin)

                admin.role = "admin"
                admin.token = jwt.sign({
                    admin_id: admin.id,
                    username:admin.username,
                    role : "admin"
                }, <Secret>process.env.TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_DURATION
                })

                return res.send(admin)

            } catch (e) {
                return next(e)
            }
        }
        else if(!admin) {
            try {

                let vendor:any = await VendorDAO.getByEmail(username, true)

                if (!vendor) {
                    return next(new UnauthorizedError("Email not found", "EMAIL_NOT_FOUND"))
                }

                if(!vendor.enabled)
                    return next(new UnauthorizedError("ACCOUNT_SUSPENDED"))

                if (!vendor.salt || !vendor.password) {
                    return next(new HandledInternalServerError("CREDENTIAL CORRUPT"))
                }

                let processedPassword = crypto.generatePassword(password, vendor.salt)

                if (processedPassword !== vendor.password) {
                    return next(new UnauthorizedError("Wrong password", "VENDOR_PASSWORD_WRONG"))
                }

                vendor = Vendor.desensitizedVendorFactory(vendor);

                vendor.role = "vendor"
                vendor.token = jwt.sign({
                    vendor_id: vendor.id,
                    email: vendor.email,
                    name: vendor.name,
                    phone_num:vendor.phone_num,
                    city_code:vendor.city_code,
                    description:vendor.description,
                    role : "vendor"
                }, <Secret>process.env.TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_DURATION
                })

                return res.send(vendor)

            } catch (e) {
                return next(e)
            }
        }
    }
    catch (err) {
        next(new InternalServerError(err))
    }

}

export async function getByString(req: Request, res: Response, next: NextFunction) {

    let query = req.body.query
    try {
        let vendor = await VendorDAO.getByString(query)
        let product = await ProductDAO.getByString(query)

        return res.send({vendor:vendor, product:product})
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export default {
    login,
    getByString
}
