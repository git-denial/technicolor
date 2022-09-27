import DatabaseService from "../services/DatabaseService";
import Vendor from "../models/Vendor";

async function getByEmail(email: String, useSensitiveData: boolean = false): Promise<Vendor | null> {
    let rows = await DatabaseService.query(`SELECT * FROM vendors WHERE email = ?`, email)

    if (rows.length === 0) {
        return null
    }

    if (useSensitiveData) {
        return new Vendor(rows[0])
    } else {
        return Vendor.desensitizedVendorFactory(rows[0])
    }
}

async function getById(id: String | number, useSensitiveData: boolean = false): Promise<Vendor | null> {
    let rows = await DatabaseService.query(`SELECT * FROM vendors WHERE id = ?`, id)
    if (rows.length === 0) {
        return null
    } else {
        if(useSensitiveData) {
            return new Vendor(rows[0])
        } else {
            return Vendor.desensitizedVendorFactory(rows[0])
        }
    }
}

async function edit(id: String | number, object: any): Promise<Vendor | null | any> {
    let rows = await DatabaseService.query('UPDATE vendors SET ? WHERE id = ?' ,[object,id]);

    return  rows.affectedRows === 1
}

async function getByString(query:string): Promise<Vendor[]> {
    let rows = await DatabaseService.query(`SELECT * FROM vendors WHERE enabled = true AND LOWER(name) LIKE "%${query.toLowerCase()}%"`);

    return rows.map((el:any)=>{
        return Vendor.desensitizedVendorFactory(el)
    })
}

async function getAll(): Promise<Vendor[]> {
    let rows = await DatabaseService.query(`SELECT * FROM vendors WHERE enabled = true`);

    return rows.map((el:any)=>{
        return Vendor.desensitizedVendorFactory(el)
    })

}

async function getByCategory(category:string): Promise<Vendor[]> {
    let rows = await DatabaseService.query(
        `SELECT v.* FROM category_vendor ct
    INNER JOIN categories c on c.id = ct.category_id
    INNER JOIN vendors v on v.id = ct.vendor_id
    WHERE enabled = true
    AND c.name = ?`,[category]
    );

    return rows.map((el:any)=>{
        return Vendor.desensitizedVendorFactory(el)
    })

}

async function create(vendor: Vendor): Promise<Vendor> {
    let result = await DatabaseService.query(`INSERT INTO vendors SET ?`, vendor)
    vendor.id = result.insertId
    return vendor;
}

export default {
    getByEmail,
    getById,
    getAll,
    getByString,
    create,
    edit,
    getByCategory
}

