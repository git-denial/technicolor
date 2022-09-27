import Uploader from "../utils/uploadProvider"
import {
    BadRequestError,
    EntityNotFoundError,
    InternalServerError,
    UnauthorizedError
} from "../errors/RequestErrorCollection";
import {NextFunction} from "express";
import TransactionDAO from "../daos/TransactionDAO";
import Transaction, {PaymentState} from "../models/Transaction";
import AdminDAO from "../daos/AdminDAO";
import EmailScenario from "../services/EmailScenario";
import EmailService from "../services/EmailService";
import ModelModes from "../models/ModelModes";

export async function uploadVendorLogo(req: any, res: any, next:NextFunction) {


    req.info = {}
    //req.info.id = req.decoded.vendor_id || req.params.id
    req.info.purpose = "vendor_logo"

    Uploader.upload(req, res, async (err: any) => {
        try {
            if (err) {
                console.error(err)
                return res.status(500).send({
                    msg: err.message,
                    code: err.code,
                    time: err.time,
                    status_code: err.statusCode
                })
            } else {
                return res.send(req.file)
            }
        }
        catch (e) {
            return next(new InternalServerError(e))
        }
    })
}

export async function uploadProductImage(req: any, res: any, next:NextFunction) {

    req.info = {}
    //req.info.id = req.params.id
    req.info.purpose = "product_image"

    Uploader.upload(req, res, async (err: any) => {
        try {
            if (err) {
                console.error(err)
                return res.status(500).send({
                    msg: err.message,
                    code: err.code,
                    time: err.time,
                    status_code: err.statusCode
                })
            } else {
                return res.send(req.file)
            }
        } catch (e) {
            return next(new InternalServerError(e))
        }
    })
}

export async function uploadPaymentProof(req: any, res: any, next:NextFunction) {

    req.info = {}
    let user_id = req.decoded.user_id
    //req.info.id = req.params.id
    req.info.purpose = "payment_proof"

    Uploader.upload(req, res, async (err: any) => {
        try {
            if (err) {
                console.error(err)
                return res.status(500).send({
                    msg: err.message,
                    code: err.code,
                    time: err.time,
                    status_code: err.statusCode
                })
            } else {
                let transaction_id = req.body.transaction_id
                let transaction = await TransactionDAO.getById(transaction_id)

                if(!transaction)
                    return next(new EntityNotFoundError("Transaction", transaction_id))

                transaction = new Transaction(
                    {
                    ...transaction,
                    payment_status: PaymentState.PAID,
                    payment_proof_url: req.file.location,
                    paid_at: new Date()
                },ModelModes.UPDATE)

                if(transaction.requesting_user !== user_id)
                    return next(new UnauthorizedError("You are not authorized to change this transaction"))

                let result = await TransactionDAO.update(transaction_id, transaction)

                if(!result)
                    return next(new Error("Something went wrong in uploading payment proof"))

                let admins = await AdminDAO.getAll()

                for(let a of admins){

                    let {subject,body} = EmailScenario.payment_proof_uploaded(transaction)
                    await EmailService.sendEmailAsync(a.email, subject,body)
                }

                return res.send({success:true})
            }
        } catch (e) {
            return next(new InternalServerError(e))
        }
    })
}


export async function download(req: any, res: any, next: NextFunction) {

    const key = req.body.url

    if(!key)
        return next(new BadRequestError("No url defined in the body request(req.body.url === undefined)"))

    const params = {
        Key: key,
        Bucket: process.env.SPACES_BUCKET_NAME
    }


    Uploader.s3.getObject(params, (err: any, data: any) => {
        if (err) {
            console.error(err)
            res.status(500).send({msg: err.message, code: err.code, time: err.time, status_code: err.statusCode})
        } else {
            let filename = key.split("/").pop()
            res.attachment(filename)
            res.send(data.Body)
        }
    })

}


async function deleteUpload(url:string){
    const params = {
        Bucket: <string>process.env.SPACES_BUCKET_NAME,
        Key: url
    }

    console.log(params)

    try {
        await Uploader.s3.deleteObject(params).promise()
        console.log("File deleted Successfully")
    } catch (e) {
        console.error("Error in file deleting")
        console.error(e)
    }
}
