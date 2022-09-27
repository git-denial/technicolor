import DatabaseService from "../services/DatabaseService";
import Product, {IProduct} from "../models/Product";


export async function getAll() : Promise<Product[]> {
    let rows = await DatabaseService.query(`SELECT * FROM products WHERE active = true AND available = true`)
    return rows.map((el:any)=>{
        return new Product(el).toObjectForm()
    })
}

export async function getByCategory(category:string): Promise<Product[]> {
    let rows = await DatabaseService.query(`SELECT * FROM products WHERE active = true AND category = ?`, [category]);

    return rows.map((el:any)=>{
        return new Product(el).toObjectForm()
    })

}

export async function getById(id: number|string) : Promise<Product|null> {
    let rows = await DatabaseService.query(`SELECT * FROM products WHERE id  = ?`, id)
    if(rows.length === 0) {
        return null
    } else {
        return new Product(rows[0]).toObjectForm()
    }
}

export async function getByString(query:string): Promise<Product[]> {
    let rows = await DatabaseService.query(`SELECT * FROM products WHERE active = true AND available = true AND LOWER(name) LIKE "%${query.toLowerCase()}%"`);
    return rows.map((el:any)=>{
        return new Product(el).toObjectForm()
    })
}

export async function getByVendorId(id: number|string) : Promise<Product|null> {
    let rows = await DatabaseService.query(`SELECT * FROM products WHERE active = true AND available = true AND vendor_id  = ?`, id)
    return rows.map((el:any)=>{
        return new Product(el).toObjectForm()
    })
}

export async function create(product: Product) : Promise<Product> {
    let result = await DatabaseService.query(`INSERT INTO products SET ?` , product.toStringForm())
    product.id = result.insertId
    return product.toObjectForm()
}

export async function update(id: number|string, product: Product) : Promise<any> {
    let rows = await DatabaseService.query(`UPDATE products SET ? WHERE id = ?`,[product.toStringForm(),id])

    return rows.affectedRows === 1;
}

export async function deleteProduct(id: number|string) : Promise<any> {
    let rows = await DatabaseService.query(`UPDATE products SET active = 0 WHERE id = ?`,id)

    return rows.affectedRows === 1;
}

export async function undeleteProduct(id: number|string) : Promise<any> {
    let rows = await DatabaseService.query(`UPDATE products SET active = 1 WHERE id = ?`,id)

    return rows.affectedRows === 1;
}

