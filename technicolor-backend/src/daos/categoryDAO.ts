import DatabaseService from "../services/DatabaseService";

async function create(category:any):Promise<any>{
    let result = await DatabaseService.query(`INSERT INTO categories SET ?`, [category])

    return {id:result.insertId, name:category.name}
}

async function edit(id: String | number, object: any): Promise<any> {
    let rows = await DatabaseService.query('UPDATE categories SET ? WHERE id = ?' ,[object,id]);

    return  rows.affectedRows === 1
}

async function addCategorytoVendor(object: any): Promise<any> {
    let rows = await DatabaseService.query('INSERT category_vendor SET ?' ,[object]);

    object.id = rows.insertId
    return object
}

async function editCategoryVendor(object: any, category_id:string|number, vendor_id:string|number): Promise<any> {
    let rows = await DatabaseService.query('UPDATE category_vendor SET ? WHERE category_id = ? AND vendor_id = ?' ,[object, category_id, vendor_id]);

    return  rows.affectedRows === 1
}


async function getAll():Promise<any>{
    let result:any = await DatabaseService.query(`SELECT * FROM categories`)

    return result.map( (c:any) => {
        return {id:c.id, name :c.name}
    })
}

async function getById(id: string | number): Promise<any> {
    let rows = await DatabaseService.query(`SELECT * FROM categories WHERE id = ?`, id)
    if (rows.length === 0) {
        return null
    } else {
        return rows[0]
    }
}

async function getByVendorId(vendorId: string | number): Promise<any> {
    let rows = await DatabaseService.query(
        `SELECT c.id, c.name 
        FROM categories c
        INNER JOIN category_vendor cv ON cv.category_id = c.id  
        WHERE cv.vendor_id = ?`, vendorId)

    return rows.map( (c:any) => {
        return {id:c.id, name :c.name}
    })
}

export default{
    create,
    getAll,
    getById,
    getByVendorId,
    edit,
    addCategorytoVendor,
    editCategoryVendor
}