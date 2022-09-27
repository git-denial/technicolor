import {NextFunction, Request, Response} from "express";
import Admin from "../../models/Admin";
import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../../errors/RequestErrorCollection";
import crypto from "../../utils/crypto";
import jwt, {Secret} from "jsonwebtoken";
import ModelModes from "../../models/ModelModes";
import AdminDAO from "../../daos/AdminDAO";
import validation from "../../utils/validation";
import hidash from "../../utils/hidash";


/**
 * @api
 * @param req
 * @param res
 * @param next
 */
export async function login(req: Request, res: Response, next: NextFunction) {
    let {username,password} = req.body

    if(!username || !password)
        return next(new BadRequestError("MISSING_LOGIN_CREDENTIAL"))

    try {

        let admin = await AdminDAO.getByUsername(username, true)

        if(!admin)
            return next(new BadRequestError("USERNAME_NOT_FOUND"))

        if (!admin.salt || !admin.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }

        let processedPassword = crypto.generatePassword(password, admin.salt)

        if (processedPassword !== admin.password) {
            return next(new UnauthorizedError("Wrong password", "ADMIN_PASSWORD_WRONG"))
        }

        let desensitizedAdmin: any = Admin.desensitizedAdminFactory(admin)

        desensitizedAdmin.token = jwt.sign({
            admin_id: admin.id,

        }, <Secret>process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_DURATION
        })

        return res.send(desensitizedAdmin)

    } catch (e) {
        return next(e)
    }

}


export async function getAdminById(req: Request, res: Response, next: NextFunction) {

    let adminId = req.params.adminId
    try {
        let admin = await AdminDAO.getById(adminId)
        if(!admin) {
            return next(new EntityNotFoundError("Admin", adminId))
        }

        return res.send(admin)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function changeAdminPassword(req: Request, res: Response, next: NextFunction) {

    let newAdmin = req.body

    if (!newAdmin.new_password){
        return res.send({msg: "Please enter the new password!"})
    }

    try {
        let currentAdmin = await AdminDAO.getById(req.decoded.admin_id, true)

        if(!currentAdmin) {
            return next(new EntityNotFoundError("Admin", req.decoded.admin_id))
        }
        if (!currentAdmin.salt || !currentAdmin.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }

        let processedPassword = crypto.generatePassword(newAdmin.password, currentAdmin.salt)
        if (processedPassword !== currentAdmin.password) {
            return next(new UnauthorizedError("Wrong password", "ADMIN_PASSWORD_WRONG"))
        }

        let salt = crypto.generateSalt();
        currentAdmin.salt = salt;
        currentAdmin.password = crypto.generatePassword(newAdmin.new_password, salt);

        currentAdmin = new Admin(currentAdmin, ModelModes.UPDATE)

        try {
            let result = await AdminDAO.edit(req.decoded.admin_id, currentAdmin)

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

export async function editAdmin(req: Request, res: Response, next: NextFunction) {

    try {
        let adminId = req.params.adminId
        let newAdmin = req.body
        let admin = await AdminDAO.getById(adminId)

        if(!admin) {
            return next(new EntityNotFoundError("Admin", adminId))
        }

        newAdmin = new Admin({...admin,...newAdmin}, ModelModes.UPDATE)

        if(newAdmin.username){
            if(admin.username !== newAdmin.username && await AdminDAO.getByUsername(newAdmin.username)){
                return next(new BadRequestError(`A admin with this username already exists, please choose another username`, "DUPLICATE_USERNAME"))
            }
        }

        if(newAdmin.email){

            if(!validation.isEmailValid(newAdmin.email))
                return next(new BadRequestError("Invalid email format"))

            if(admin.email !== newAdmin.email && await AdminDAO.getByEmail(newAdmin.email)){
                return next(new BadRequestError(`A admin with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }
        }

        let adminObject = await AdminDAO.edit(adminId, newAdmin)

        if(!adminObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getSelf(req:any,res:any,next:NextFunction){
    let id = req.decoded.admin_id

    try{
        let self = await AdminDAO.getById(id)

        if(!self)
            return next(new EntityNotFoundError("ADMIN"))

        res.send(self)

    }
    catch(e){
        return next(new InternalServerError(e))
    }
}

export async function editAdminSelf(req: Request, res: Response, next: NextFunction) {
    try {
        let adminId = req.decoded.admin_id
        let newAdmin = req.body
        let admin = await AdminDAO.getById(adminId)

        if(!admin) {
            return next(new EntityNotFoundError("Admin", adminId))
        }

        newAdmin = new Admin({...admin,...newAdmin}, ModelModes.UPDATE)

        if(newAdmin.username){
            if(admin.username !== newAdmin.username && await AdminDAO.getByUsername(newAdmin.username)){
                return next(new BadRequestError(`A admin with this username already exists, please choose another username`, "DUPLICATE_USERNAME"))
            }
        }

        if(newAdmin.email){

            if(!validation.isEmailValid(newAdmin.email))
                return next(new BadRequestError("Invalid email format"))

            if(admin.email !== newAdmin.email && await AdminDAO.getByEmail(newAdmin.email)){
                return next(new BadRequestError(`A admin with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }
        }

        let adminObject = await AdminDAO.edit(adminId, newAdmin)

        if(!adminObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function tokenLogin(req: Request, res: Response, next: NextFunction) {
    let adminId = req.decoded.admin_id

    try {
        let admin = await AdminDAO.getById(adminId)

        if(!admin)
            return res.send(new EntityNotFoundError("ADMIN", adminId))

        res.send(admin)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getAllAdmins(req: Request,res: Response, next:NextFunction) {
    try {
        let admins = await AdminDAO.getAll()
        res.send(admins)
    }
    catch(e){
        next(new InternalServerError(e))
    }
}


export async function register(req:Request, res:Response, next: NextFunction) {

    let newAdmin = hidash.checkProperty(req.body, "Admin", "username", "email", "password")

    if(newAdmin.error_message){
        return next(newAdmin)
    }

    newAdmin = new Admin(req.body, ModelModes.CREATE);

    if(!validation.isEmailValid(newAdmin.email)){
        return next(new BadRequestError("Invalid email format"))
    }

    try {

        if(await AdminDAO.getByUsername(newAdmin.username)){
            return next(new BadRequestError(`An administrator with this username already exists, please choose another username`, "DUPLICATE_USERNAME"))
        }

        if(await AdminDAO.getByEmail(newAdmin.email)){
            return next(new BadRequestError(`An administrator with this email already exists, please choose another username`, "DUPLIACTE_EMAIL"))
        }

        let salt = crypto.generateSalt();

        newAdmin.salt = salt
        newAdmin.password = crypto.generatePassword(<string>newAdmin.password, salt)

        let admin = await AdminDAO.create(newAdmin);
        return res.send(admin)
    } catch(err) {
        next(new InternalServerError(err))
    }

}


export async function shortLogin(req: Request, res: Response, next: NextFunction) {
    let {username,password} = req.body

    if(!username || !password)
        return next(new BadRequestError("MISSING_LOGIN_CREDENTIAL"))

    try {

        let admin = await AdminDAO.getByUsername(username, true)

        if(!admin)
            return next(new BadRequestError("USERNAME_NOT_FOUND"))

        if (!admin.salt || !admin.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }

        let processedPassword = crypto.generatePassword(password, admin.salt)

        if (processedPassword !== admin.password) {
            return next(new UnauthorizedError("Wrong password", "ADMIN_PASSWORD_WRONG"))
        }

        let desensitizedAdmin: any = Admin.desensitizedAdminFactory(admin)

        desensitizedAdmin.token = jwt.sign({
            admin_id: admin.id,

        }, <Secret>process.env.TOKEN_SECRET, {
            expiresIn: "1ms"
        })

        return res.send(desensitizedAdmin)

    } catch (e) {
        return next(e)
    }

}
