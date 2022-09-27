import DatabaseService from "../services/DatabaseService";
import Admin from "../models/Admin";

async function getByUsername(username:String, useSensitiveData : boolean = false) : Promise<Admin|null> {
    let rows = await DatabaseService.query(`SELECT * FROM administrators WHERE username = ?` , username)
    if(rows.length === 0) {
        return null
    } else {
        if(useSensitiveData) {
            return new Admin(rows[0])
        } else {
            return Admin.desensitizedAdminFactory(rows[0])
        }
    }
}

async function getByEmail(email:String, useSensitiveData : boolean = false) : Promise<Admin|null> {
    let rows = await DatabaseService.query(`SELECT * FROM administrators WHERE email = ?` , email)
    if(rows.length === 0) {
        return null
    } else {
        if(useSensitiveData) {
            return new Admin(rows[0])
        } else {
            return Admin.desensitizedAdminFactory(rows[0])
        }
    }
}

async function getById(id: String|number , useSensitiveData : boolean = false) : Promise<Admin|null> {
    let rows = await DatabaseService.query(`SELECT * FROM administrators WHERE id = ?` , id)
    if(rows.length === 0) {
        return null
    } else {
        if(useSensitiveData) {
            return new Admin(rows[0])
        } else {
            return Admin.desensitizedAdminFactory(rows[0])
        }
    }
}

async function edit(id: String|number , object: any) : Promise<Admin|null|any> {
    let rows = await DatabaseService.query('UPDATE administrators SET ? WHERE id = ?' ,[object,id]);

    return  rows.affectedRows === 1
}

async function getAll() : Promise<Admin[]> {
    let rows = await DatabaseService.query(`SELECT * FROM administrators`)
    return rows.map((el:any)=>{
        return Admin.desensitizedAdminFactory(el)
    })
}

async function create(admin: Admin) : Promise<Admin> {
    let result = await DatabaseService.query(`INSERT INTO administrators SET ?` , admin)
    admin.id = result.insertId
    return admin
}

export default {
    getByUsername,
    getByEmail,
    getById,
    getAll,
    create,
    edit,

}

