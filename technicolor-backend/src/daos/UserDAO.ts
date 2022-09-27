import DatabaseService from "../services/DatabaseService";
import User from "../models/User";

async function getByEmail(email: String, useSensitiveData: boolean = false): Promise<User | null> {
    let rows = await DatabaseService.query(`SELECT * FROM users WHERE email = ?`, email)

    if (rows.length === 0) {
        return null
    }

    if (useSensitiveData) {
        return new User(rows[0])
    } else {
        return User.desensitizedUserFactory(rows[0])
    }
}

async function getById(id: String | number, useSensitiveData: boolean = false): Promise<User | null> {
    let rows = await DatabaseService.query(`SELECT * FROM users WHERE id = ?`, id)
    if (rows.length === 0) {
        return null
    } else {
        if(useSensitiveData) {
            return new User(rows[0])
        } else {
            return User.desensitizedUserFactory(rows[0])
        }
    }
}

async function edit(id: String | number, object: any): Promise<User | null | any> {
    let rows = await DatabaseService.query('UPDATE users SET ? WHERE id = ?' ,[object,id]);

    return  rows.affectedRows === 1
}


async function getAll(): Promise<User[]> {
    let rows = await DatabaseService.query(`SELECT * FROM users WHERE enabled = true`);

    return rows.map((el:any)=>{
        return User.desensitizedUserFactory(el)
    })

}

async function create(user: User): Promise<User> {
    let result = await DatabaseService.query(`INSERT INTO users SET ?`, user)
    user.id = result.insertId
    return user;
}

export default {
    getByEmail,
    getById,
    getAll,
    create,
    edit
}

