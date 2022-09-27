import {NextFunction, Request, Response} from "express";
import {BadRequestError, EntityNotFoundError, InternalServerError} from "../errors/RequestErrorCollection";
import categoryDAO from "../daos/categoryDAO";
import vendorDA0 from "../daos/VendorDAO"

export async function create(req: Request, res: Response, next: NextFunction) {

    let name = req.body.name

    if(!name)
        return next(new BadRequestError("No name received for new category", "MISSING_INFO"))

    try {
        let category = await categoryDAO.create({name})

        return res.send(category)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {

    let id = req.params.id
    let {name} = req.body

    if(!id)
        return next(new BadRequestError("No id received", "MISSING_INFO"))

    try {

        let category = await categoryDAO.getById(id)
        if(!category)
            return next(new EntityNotFoundError("category", id))

        let result = await categoryDAO.edit(id, {name} )

        if(!result) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function addCategorytoVendor(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.params.vendor_id
    let {id} = req.body

    if(!id)
        return next(new BadRequestError("No id received", "MISSING_INFO"))

    try {

        let category = await categoryDAO.getById(id)
        let vendor = await vendorDA0.getById(vendorId)

        if(!category)
            return next(new EntityNotFoundError("category", id))
        if(!vendor)
            return next(new EntityNotFoundError("vendor", vendorId))

        let result = await categoryDAO.addCategorytoVendor({category_id: id, vendor_id:vendorId})

        return res.send(result)
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function editCategoryVendor(req: Request, res: Response, next: NextFunction) {

    let vendorId = req.params.vendor_id
    let {old_category_id, new_category_id} = req.body

    if(!old_category_id || !new_category_id)
        return next(new BadRequestError("No id received", "MISSING_INFO"))

    try {

        let vendor = await vendorDA0.getById(vendorId)

        if(!vendor)
            return next(new EntityNotFoundError("vendor", vendorId))

        let result = await categoryDAO.editCategoryVendor({category_id: new_category_id}, old_category_id, vendorId)

        if(!result) {
            return res.send(new BadRequestError("Failed to change"))
        }

        return res.send({success:true})
    } catch (e) {
        next(new InternalServerError(e))
    }
}


export async function getAll(req:any, res:any, next:NextFunction){
    try{
        let categories = await categoryDAO.getAll()
        return res.send(categories)
    }
    catch(e){
        return next(new InternalServerError(e))
    }
}