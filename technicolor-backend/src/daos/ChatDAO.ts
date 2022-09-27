import DatabaseService from "../services/DatabaseService";
import User from "../models/User";
import Product from "../models/Product";
import Vendor from "../models/Vendor";
import Chat from "../models/Chat";
import ModelModes from "../models/ModelModes";


export async function getAllChatPartnerForUser(user_id: string): Promise<Object[]> {
    let rows = await DatabaseService.query(`SELECT vendors.*, chat_tab.latest_chat, chat.message
        FROM chat INNER JOIN vendors ON vendors.id = chat.vendor_id INNER JOIN (
            SELECT chat.vendor_id, max(created_at) as latest_chat
            FROM chat
            GROUP by vendor_id
        ) as chat_tab ON chat_tab.vendor_id = vendors.id AND chat_tab.latest_chat = chat.created_at
        WHERE user_id = ? 
        ORDER BY latest_chat DESC`, [user_id])
    return rows.map((el: any) => {

        return {
            vendor :  Vendor.desensitizedVendorFactory(el),
            message : el.message,
            latest_chat : el.latest_chat
        }

    })
}

export async function getAllChatPartnerForVendor(vendor_id: string): Promise<Object[]> {
    let rows = await DatabaseService.query(`SELECT users.*, chat_tab.latest_chat, chat.message
        FROM chat INNER JOIN users ON users.id = chat.user_id INNER JOIN (
            SELECT chat.user_id, max(created_at) as latest_chat
            FROM chat
            GROUP by user_id
        ) as chat_tab ON chat_tab.user_id = users.id AND chat_tab.latest_chat = chat.created_at
        WHERE vendor_id = ? 
        ORDER BY latest_chat DESC`, [vendor_id])
    return rows.map((el: any) => {

        return {
            user :  User.desensitizedUserFactory(el),
            message : el.message,
            latest_chat : el.latest_chat
        }

    })
}

export async function getChatBetweenIds(user_id: string, vendor_id: string): Promise<Product[]> {
    let rows = await DatabaseService.query(`SELECT * FROM chat WHERE user_id = ? AND vendor_id = ?`, [user_id, vendor_id])
    return rows.map((el: any) => {
        return new Chat(el)
    })
}

export async function addChat(chat: Chat): Promise<Chat> {

    let result = await DatabaseService.query(`INSERT INTO chat SET ?`, chat)
    chat.id = result.insertId
    return chat

}

