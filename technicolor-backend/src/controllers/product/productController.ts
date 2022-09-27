import {NextFunction, Request, Response} from "express";
import * as ProductDAO from "../../daos/ProductDAO";
import {BadRequestError, EntityNotFoundError, InternalServerError} from "../../errors/RequestErrorCollection";
import Product from "../../models/Product";
import VendorDAO from "../../daos/VendorDAO";
import ModelModes from "../../models/ModelModes";
import hidash from "../../utils/hidash";


export async function getAllProducts(req: Request,res: Response, next:NextFunction) {

    try{
        let products = await ProductDAO.getAll()

        res.send(products)
    }
    catch(e){
        next(new InternalServerError(e))
    }


}

export async function getProductById(req: Request, res: Response, next: NextFunction) {

    let productId = req.params.product_id
    try {
        let product = await ProductDAO.getById(productId)

        if(!product || !product.active) {
            return next(new EntityNotFoundError("Product", productId))
        }

        return res.send(product)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getProductByVendorId(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.params.id
    try {
        let product = await ProductDAO.getByVendorId(vendorId)

        return res.send(product)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getByCateogry(req: Request, res: Response, next: NextFunction) {

    let category = req.body.category
    try {
        let product = await ProductDAO.getByCategory(category)

        return res.send(product)
    } catch (e) {
        next(new InternalServerError(e))
    }
}


export async function updateProduct(req: Request, res: Response, next: NextFunction) {

    let productId = req.params.product_id
    let updatedProduct = new Product(req.body)


    try {

        if( updatedProduct.vendor_id && !(await VendorDAO.getById(updatedProduct.vendor_id)) ){
            return next(new EntityNotFoundError("Vendor", updatedProduct.vendor_id))
        }

        let result = await ProductDAO.update(productId, updatedProduct)

        if(result) {
            res.send({success: true})
        } else {
            return next(new EntityNotFoundError("Product", productId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {

    let productId = req.params.product_id

    try {
        let result = await ProductDAO.deleteProduct(productId)

        if(result) {
            return res.send({success:true})
        } else {
            return next(new EntityNotFoundError("Product", productId))
        }

    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function undeleteProduct(req: Request, res: Response, next: NextFunction) {

    let productId = req.params.product_id

    try {
        let result = await ProductDAO.undeleteProduct(productId)
        if(result) {
            return res.send({success:true})
        }
        else {
            return next(new EntityNotFoundError("Product", productId))
        }
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function create(req:Request, res:Response, next: NextFunction) {

    let newProduct = hidash.checkProperty(req.body,"Product","vendor_id","name","price","weight")

    if(newProduct.error_message){
        return next(newProduct)
    }

    newProduct = new Product(req.body, ModelModes.CREATE);

    try {

        if(!(await VendorDAO.getById(newProduct.vendor_id)))
            return next(new EntityNotFoundError("Vendor", newProduct.vendor_id))

        let product = await ProductDAO.create(newProduct);
        return res.send(product)

    } catch(err) {
        return next(new InternalServerError(err))
    }

}
