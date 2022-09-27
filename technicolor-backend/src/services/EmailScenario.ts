import ContactForm from "../models/ContactForm";
import Transaction from "../models/Transaction";
import Order, {ShipmentState} from "../models/Order";
import User from "../models/User";
import {Sender} from "../models/Chat";

function payment_proof_uploaded(transaction:Transaction){

    return{
        subject: "Payment proof uploaded by user",
        body:`A user with id ${transaction.requesting_user} has uploaded a payment proof. Please go to the dashboard to confirm the payment.`,
        // body:`A user with id ${transaction.requesting_user} has uploaded a payment proof for transaction with id ${transaction.id},
        //      <br><br>
        //      the link: ${transaction.payment_proof_url}
        //      <br><br>`
    }
}

function contact_form_created (contact_form:ContactForm, for_user:boolean = false){

    let user = contact_form.user_id?`User with id ${contact_form.user_id} has created a contact form.<br><br>`:''

    return{
        subject: "Contact form received",
        body: for_user? `Your contact us form with id ${contact_form.id} has been received and will be processed soon by the admin.`
                        :`A user has filled in a contact form.`,
        config:for_user? {sendTo:Sender.USER} : undefined
        // body:`${user}
        //      The message: ${contact_form.message}
        //      <br><br>`
    }
}

async function generateItem(order:Order){

    let orderlines = await order.get_order_lines()

    if(!orderlines)
        return false

    return orderlines.map(o=>{

        if(!o.product)
            return "undefined product"

        return `${o.product.name},  quantity:${o.quantity}<br>`
    })
}

async function transaction_approved_for_vendor (order:Order, transaction:Transaction, user:User){

    return{
        subject: "Payment proof confirmed",
        body:`
             User full name: ${user.full_name}
             <br><br>
             User email: ${user.email}
             <br><br>
             User address: ${user.address}
             <br><br>
             User phone number: ${user.phone_num}
             <br><br>
             Destination: ${user.city}
             <br><br>
             Item:
             <br><br>
             ${await generateItem(order)}
             `,
        config:{sendTo:Sender.VENDOR}
    }
}

function transaction_approved_for_user (){

    return{
        subject: "Payment proof confirmed",
        body:`
             Your payment is confirmed, please wait while your order is being processed. 
             `,
        config:{sendTo:Sender.USER}
    }
}

async function transaction_expired (order:Order[]){

    return{
        subject: "Payment has expired",
        body:`
             Your transaction payment has expired...
             <br><br>
             ${await Promise.all(order.map((o:any)=>generateItem(o)))}
             `,
        config:{sendTo:Sender.USER}
    }

}

async function transaction_rejected (order:Order[]){

    return{
        subject: "Payment is rejected",
        body:`
             Your transaction payment has been rejected...
             <br><br>
             ${await Promise.all(order.map((o:any)=>generateItem(o)))}
             `,
        config:{sendTo:Sender.USER}
    }
}

function order_arrived(order:Order){

    return{
        subject: "Your order has arrvied",
        body:`System has detected that your order has arrived. Please contact us using the contact us form if there is any problem with your order.`,
        config:{sendTo:Sender.USER}
    }
}

function order_delivering(order:Order){

    let nomor_resi = order.shipment_status === ShipmentState.DELIVERING?
        `<br>You can track your order with the following delivery receipt: ${order.delivery_receipt}`
        :
        ""

    return{
        subject: "Order is on the way",
        body:`Your order (${order.code}) is in the stage of ${order.shipment_status} 
              ${nomor_resi}`,
        config:{sendTo:Sender.USER}
    }
}

function chat_received(name:string, message:string, sendTo:Sender){

    return{
        subject: "You have a new message in chat",
        body:`You have received a new message: <br><br>
${name} says : <br/>${message}`,
        config:{sendTo:sendTo}
    }
}

export default{
    payment_proof_uploaded,
    chat_received,
    order_delivering, order_arrived,
    transaction_approved_for_vendor, transaction_approved_for_user, transaction_rejected, transaction_expired,
    contact_form_created

}
