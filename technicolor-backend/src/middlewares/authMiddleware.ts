import {NextFunction, Request, Response} from "express";
import jwt, {Secret} from 'jsonwebtoken'
import {RequestError} from "../errors/RequestErrorCollection";


const processToken = (req: Request, successCallback: Function, errorCallback: Function, ignore:boolean = false) => {
    if (req.headers['authorization']) {
        let token = req.headers['authorization'].split(" ")[1];
        // decode token
        if (token) {

            let secret = process.env.TOKEN_SECRET
            if (!secret) {
                errorCallback(new Error("NO_SECRET_DEFINED"))
            }

            // verifies secret and checks exp
            try {
                req.decoded = jwt.verify(token, <Secret>secret);
                successCallback();
            } catch (err) {

                console.log(err)
                let message = err.message
                message = message.toUpperCase().replace(" ", "_")
                errorCallback({msg: message, err: err})
            }


        } else {
            if(ignore){
                successCallback()
                return
            }
            //token missing
            errorCallback({msg: "NO_TOKEN_PROVIDED"})
        }
    } else {
        //no header
        errorCallback({msg: "BAD_TOKEN_FORMAT"})
    }
}


function user(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.user_id) {
            next()
        } else {
            return next(new RequestError("No user data found in the token", 403, "NO_USER_DATA"))
        }
    }, (err: any) => {
        //logger.error(err.err)
        return next(new RequestError("Refer to the code", 403, err.msg))
    })
}

function admin(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.admin_id) {
            next()
        } else {
            return next(new RequestError("No admin data found in the token", 403, "NO_ADMIN_DATA"))
        }
    }, (err: any) => {
        //logger.error(err)
        return next(new RequestError(err.msg, 403, "Refer to the code"))
    })
}

function vendor(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.vendor_id) {
            next()
        } else {
            return next(new RequestError("No vendor data found in the token", 403, "NO_VENDOR_DATA"))
        }
    }, (err: any) => {
        //logger.error(err)
        return next(new RequestError(err.msg, 403, "Refer to the code"))
    })
}

function any(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.vendor_id || req.decoded.admin_id || req.decoded.user_id) {
            next()
        } else {
            return next(new RequestError("No user/admin/vendor data found in the token", 403, "NO_DATA"))
        }
    }, (err: any) => {
        //logger.error(err)
        return next(new RequestError(err.msg, 403, "Refer to the code"))
    })
}

function admin_or_vendor(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.vendor_id || req.decoded.admin_id) {
            next()
        } else {
            return next(new RequestError("No admin/vendor data found in the token", 403, "NO_DATA"))
        }
    }, (err: any) => {
        //logger.error(err)
        return next(new RequestError(err.msg, 403, "Refer to the code"))
    })
}

function admin_or_user(req: Request, res: Response, next: NextFunction) {
    processToken(req, async () => {
        if (req.decoded.user_id || req.decoded.admin_id) {
            next()
        } else {
            return next(new RequestError("No user/admin data found in the token", 403, "NO_DATA"))
        }
    }, (err: any) => {
        //logger.error(err)
        return next(new RequestError(err.msg, 403, "Refer to the code"))
    })
}

function optional(req: Request, res: Response, next: NextFunction) {

    processToken(req, async () => {
        next()
    }, (err: any) => {
        //logger.error(err)

        return next(new RequestError(err.msg, 403, "Refer to the code"))
    },true)
}


export default {
    user,
    admin,
    vendor,
    any,
    optional,
    admin_or_vendor,
    admin_or_user
}
