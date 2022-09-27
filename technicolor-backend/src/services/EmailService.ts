import nodemailer, {SentMessageInfo} from 'nodemailer'
import logger from "../utils/logger";
import moment from 'moment'
import {Stream} from "stream";
import cryptoUtils from "../utils/crypto"
import Order from "../models/Order";
import Transaction from "../models/Transaction";
import User from "../models/User";
import {Sender} from "../models/Chat";


require('moment/locale/id')

const USER = process.env.MAILJET_USERNAME
const PASS = process.env.MAILJET_PASSWORD
const SERVICE = 'Mailjet'
// import 'moment/locale/id'

const replaceEmailTemplate = (replacer: any, emailTemplate: string) => {
    let oldTemplate = emailTemplate
    do{
        oldTemplate = emailTemplate
        for(let key in replacer) {
            emailTemplate = emailTemplate.replace(`%${key}%`, replacer[key])
        }
    } while (emailTemplate !== oldTemplate)

    return emailTemplate
}

/*const replaceBodyAndSubject = (context: OrderContext, emailTemplate: EmailTemplate, rejectionReason?: string) => {
    let replacer = generateReplacerFromContext(context, rejectionReason)
    let body = replaceEmailTemplate(replacer,emailTemplate.body_template)
    let subject = replaceEmailTemplate(replacer,emailTemplate.subject_template)
    return {
        body,subject
    }
}*/

const generateReplacerFromContext = (transaction: Transaction, order:Order, user:User, rejectionReason?: string) => {

    //logging.log(`Encrypted Participant ID : ${encryptedParticipantId} , Participant ID: ${participant.id}`)
    let replacer : any = {
        NAMA_PENGGUNA: user.full_name,
        SUREL_PENGGUNA: user.email,
        ALAMAT_PENGGUNA: order.address_info,
        METODE_PENGIRIMAN: order.delivery_method
    }

    if(transaction) {
        replacer = {
            ...replacer,
            JUMLAH_YANG_DIBAYARKAN: transaction.amount,
            TAUTAN_PEMBAYARAN: transaction.payment_proof_url,
            WAKTU_KADALUARSA_PEMBAYARAN: generateDateIndonesianString(<Date>transaction.expired_at) + ", pukul " + generateFormattedTime(moment(transaction.expired_at).utcOffset('+0700')) + " WIB"

        }
    }

    let rejectionString
    if(rejectionReason) {
        rejectionString = rejectionReason
    } else {
        if(transaction?.expired_at) {
            if(Date.now() > transaction.expired_at.getTime()) {
                rejectionString = "Pembayaran tidak diterima dalam waktu yang ditentukan"
            } else {
                rejectionString = ""
            }
        }
    }
    replacer.ALASAN_PENOLAKAN = rejectionString


    return replacer

}


const listBulan = ['Januari','Februrari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const listHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const generateZeroPaddedNumber = (value:number|string) : string => {
    let pad = '00'
    return (pad + value).slice(-pad.length)
}

const generateFormattedTime = (time: moment.Moment) : string => {
    return generateZeroPaddedNumber(time.hour()) + "." + generateZeroPaddedNumber(time.minute())
}


const generateDateTimeIndonesianString = (startTime: Date, endTime: Date) : string => {
    let momentStart = moment(startTime).utcOffset('+0700')
    let momentEnd = moment(endTime).utcOffset('+0700')
    let date = startTime.getDate()
    let month = listBulan[startTime.getMonth()]
    let year = startTime.getFullYear()
    let day = momentStart.format("dddd")

    let startTimeStr = generateFormattedTime(momentStart)
    let endTimeStr = generateFormattedTime(momentEnd)
    return `${day}, ${date} ${month} ${year}, pukul ${startTimeStr}--${endTimeStr} WIB`
}

const generateDateIndonesianString = (inputDate: Date) => {
    let date = inputDate.getDate()
    let month = listBulan[inputDate.getMonth()]
    let year = inputDate.getFullYear();
    return `${date} ${month} ${year}`
}

interface MailAttachment {
    filename?: string,
    content?: string|Buffer|Stream,
    path?: string,
    encoding?: string,
    raw?:string
}

interface IAdditionalConfiguration {
    attachments?: MailAttachment[],
    replyTo?:string,
    textMode?:boolean, //If true, will pass email as text. if false, will pass email as RichText/HTML
    fromDomain?:string,
    fromName?:string
    sendTo?:Sender
}

const sendEmailAsync = async (to:string, subject:string, body:string, config?: IAdditionalConfiguration) : Promise<SentMessageInfo> => {

    let fromDomain = config?.fromDomain ?? 'intellivent.id'
    let fromName = config?.fromName ?? 'Technicolor no-reply'
    let from = `${fromName}@${fromDomain}`

    let mailOptions : any = {
        from: from,
        to: to,
        subject: subject,
    };

    if(config?.replyTo) {
        mailOptions.replyTo = config?.replyTo
    }

    if(config?.sendTo){

        if(config.sendTo === Sender.USER)
            body = `Dear Valued User, <br><br>` + body
        else if(config.sendTo === Sender.VENDOR)
            body = `Dear Valued Partner <br><br>` + body
    }

    body += `<br><br><br><br>
             Best Regards,<br>SGU Technicolor Team`



    if(config?.textMode) {
        mailOptions.text = body
    } else {
        mailOptions.html = body
    }

    if(config?.attachments){
        if(config.attachments.length > 0){
            mailOptions.attachments = config.attachments
        }
    }

    let transporter = nodemailer.createTransport({
        service: SERVICE,
        auth: {
            user: USER,
            pass: PASS
        }
    })

    let result : SentMessageInfo = await transporter.sendMail(mailOptions)
    {
        response: "TEST-"+ cryptoUtils.generateSalt() + " EMAILTEST"
    }

    let guid = result.response.split(" ").pop()

    logger.log(`Sent email to [${to}] with subject [${subject}]. EMAIL GUID: ${"guid"}`)

    //TODO Later implement this so that the reporting system can track the status of each email

    /*let emailStatus = {
        email_guid: guid,
        from_address: from,
        to_address: to,
        subject: subject,
        content: text,
        status: EmailStatus.statuses.SENT
    }

    //catch this error so that it doesnt break the user-end flow
    try{
        await EmailStatus.create(emailStatus)
    } catch (err) {
        logging.error(err)
    }*/

    return result

}





export default {
    sendEmailAsync,
    replaceEmailTemplate,
    generateDateTimeIndonesianString,
    generateReplacerFromContext,
    //replaceBodyAndSubject
}

