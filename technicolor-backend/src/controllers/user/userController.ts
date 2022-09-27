import {NextFunction, Request, Response} from "express";
import UserDAO from "../../daos/UserDAO";

import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../../errors/RequestErrorCollection";
import User from "../../models/User";
import crypto from "../../utils/crypto";
import Valid from "../../utils/validation";
import jwt, {Secret} from "jsonwebtoken";
import ModelModes from "../../models/ModelModes";
import hidash from "../../utils/hidash";


export async function login(req: Request, res: Response, next: NextFunction) {
    let {email, password} = req.body;

    if(!email){
        return next(new BadRequestError('MISSING_LOGIN_CREDENTIAL'))
    }

    try {
        let user = await UserDAO.getByEmail(email, true)

        if (!user) {
            return next(new UnauthorizedError("Email not found", "EMAIL_NOT_FOUND"))
        }

        if(!user.enabled){
            return next(new UnauthorizedError("ACCOUNT_SUSPENDED"))
        }

        if (!user.salt || !user.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }

        let processedPassword = crypto.generatePassword(password, user.salt)

        if (processedPassword !== user.password) {
            return next(new UnauthorizedError("Wrong password", "USER_PASSWORD_WRONG"))
        }
        
        let desensitizedUser: any = User.desensitizedUserFactory(user);

        desensitizedUser.token = jwt.sign({
            user_id: user.id,
            email: user.email,
        }, <Secret>process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_DURATION
        })

        return res.send(desensitizedUser)

    } catch (e) {
        return next(e)
    }

}

export async function getById(req: Request, res: Response, next: NextFunction) {

    let userId = req.params.user_id
    try {
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }

        return res.send(user)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getMyself(req: Request, res: Response, next: NextFunction) {

    let userId = req.decoded.user_id
    try {
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }
        
        return res.send(user)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {

    let newUser = req.body
    let id = req.decoded.user_id

    if (!newUser.new_password){
        return res.send({msg: "Please enter the new password!"})
    }

    try {
        let currentUser = await UserDAO.getById(id, true)

        if(!currentUser || !currentUser.enabled) {
            return next(new EntityNotFoundError("User", id))
        }

        if (!currentUser.salt || !currentUser.password) {
            return next(new Error("CREDENTIAL_CORRUPT"))
        }


        currentUser.salt = crypto.generateSalt();;
        currentUser.password = crypto.generatePassword(newUser.new_password, <string>currentUser.salt);

        currentUser = new User(currentUser, ModelModes.UPDATE)

        try {
            let result = await UserDAO.edit(id, currentUser)

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
        let userId = req.params.user_id
        let newUser = req.body
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }

        if(newUser.email){
            if(user.email !== newUser.email && await UserDAO.getByEmail(newUser.email)){
                return next(new BadRequestError(`A user with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }

            if(!Valid.isEmailValid(newUser.email))
                return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))
        }

        newUser = new User({...user,...newUser}, ModelModes.UPDATE)

        let userObject = await UserDAO.edit(userId, newUser)

        if(!userObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}



export async function editSelf(req: Request, res: Response, next: NextFunction) {
    try {
        let userId = req.decoded.user_id
        let newUser = req.body
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }

        if(newUser.email){
            if(user.email !== newUser.email && await UserDAO.getByEmail(newUser.email)){
                return next(new BadRequestError(`A user with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }

            if(!Valid.isEmailValid(newUser.email))
                return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))
        }

        newUser = new User({...user,...newUser}, ModelModes.UPDATE)

        let userObject = await UserDAO.edit(userId, newUser)

        if(!userObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function tokenLogin(req: Request, res: Response, next: NextFunction) {
    let userId = req.decoded.user_id

    try {
        let user = await UserDAO.getById(userId)

        if (!user) {
            return next(new EntityNotFoundError("User", userId))
        }

        if(!user.enabled){
            return next(new UnauthorizedError("ACCOUNT_SUSPENDED"))
        }

        res.send(user)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getAll(req: Request,res: Response, next:NextFunction) {
    try{
        let users = await UserDAO.getAll()
        res.send(users)
    }
    catch(e){
        next(new InternalServerError(e))
    }

}

export async function register(req:Request, res:Response, next: NextFunction) {

    let newUser = hidash.checkProperty(req.body, "User", "full_name", "email", "password")

    if(newUser.error_message){
        return next(newUser)
    }
    newUser = new User(req.body, ModelModes.CREATE);

    if(!Valid.isEmailValid(newUser.email))
        return next(new BadRequestError(`Email format is invalid`, "INVALID_EMAIL"))

    try {

            if(await UserDAO.getByEmail(newUser.email)){
                return next(new BadRequestError(`A user with this email already exists, please choose another email`, "DUPLICATE_EMAIL"))
            }

            newUser.salt = crypto.generateSalt();
            newUser.password = crypto.generatePassword(newUser.password, <string>newUser.salt)

            let user = await UserDAO.create(newUser);

            return res.send(user)
    } catch(err) {
        next(new InternalServerError(err))
    }

}

export async function ban(req: Request, res: Response, next: NextFunction) {

    try {
        let userId = req.params.user_id
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }

        user = new User({...user,enabled:false}, ModelModes.UPDATE)

        let userObject = await UserDAO.edit(userId, user)

        if(!userObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function unBan(req: Request, res: Response, next: NextFunction) {

    try {
        let userId = req.params.user_id
        let user = await UserDAO.getById(userId)

        if(!user || !user.enabled) {
            return next(new EntityNotFoundError("User", userId))
        }

        user = new User({...user,enabled:true}, ModelModes.UPDATE)

        let userObject = await UserDAO.edit(userId, user)

        if(!userObject) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})

    } catch (e) {
        next(new InternalServerError(e))
    }
}
