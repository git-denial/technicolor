import {NextFunction, Request, Response} from "express";
import {BadRequestError, InternalServerError} from "../../errors/RequestErrorCollection";
// @ts-ignore
import fetch from "node-fetch";
// @ts-ignore
import FormData from "form-data"
import {delivery_method} from "../../models/Order";

let premium_raja_ongkir_key = process.env.PREMIUM_RAJA_ONGKIR_KEY

export async function getAllProvince(req: Request, res: Response, next: NextFunction) {

    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/province?key=${premium_raja_ongkir_key}`, {
            method: 'GET'
        });

        let result = await request.text();
        result = JSON.parse(result);

        return res.send(result);
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getAllCity(req: Request, res: Response, next: NextFunction) {

    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/city?key=${premium_raja_ongkir_key}`, {
            method: 'GET'
        });

        let result = await request.text();
        result = JSON.parse(result);

        return res.send(result);
    } catch (e) {
        next(new InternalServerError(e))
    }
}

export async function getAllCityWithProvince(req: Request, res: Response, next: NextFunction) {
    let provinceId = req.params.provinceId;
    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/city?key=${premium_raja_ongkir_key}&province=${provinceId}`, {
            method: 'GET'
        });

        let result = await request.text();
        result = JSON.parse(result);

        return res.send(result);
    } catch (e) {
        return next(new InternalServerError(e))
    }
}

export async function getPrice(req: Request, res: Response, next: NextFunction) {
    let checkout = req.body;
    checkout.key = premium_raja_ongkir_key
    if (!checkout.origin) {
        return res.send(new BadRequestError("missing 'origin'!", "BAD_REQUEST"))
    }

    if (!checkout.destination) {
        return res.send(new BadRequestError("missing 'destination'!", "BAD_REQUEST"))
    }

    if (!checkout.weight) {
        return res.send(new BadRequestError("missing 'weight'!", "BAD_REQUEST"))
    }

    if (!checkout.courier) {
        return res.send(new BadRequestError("missing 'courier'!", "BAD_REQUEST"))
    }

    let formData = new FormData();
    formData.append("key", checkout.key)
    formData.append("origin", checkout.origin + "")
    formData.append("originType", "city")
    formData.append("destination", checkout.destination + "")
    formData.append("destinationType", "city")
    formData.append("weight", checkout.weight + "")
    formData.append("courier", checkout.courier)

    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/cost`, {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });

        let respond = await request.text();
        respond = JSON.parse(respond);

        return res.send(respond);

    } catch (e) {
        return next(new InternalServerError(e))
    }

}

export async function trackDelivery(req: any, res: any, next: NextFunction) {

    let {courier, no_resi} = req.body;


    if (!courier) {
        return res.send(new BadRequestError("missing 'kurir'!", "BAD_REQUEST"))
    }

    if (!no_resi) {
        return res.send(new BadRequestError("missing 'nomor resi'!", "BAD_REQUEST"))
    }

    let formData = new FormData();
    formData.append("key", premium_raja_ongkir_key)
    formData.append("waybill", no_resi + "")
    formData.append("courier", courier + "")

    try {
        let request = await fetch(`https://pro.rajaongkir.com/api/waybill`, {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });

        let respond = await request.text();
        respond = JSON.parse(respond);

        return res.send(respond);

    } catch (e) {
        return next(new InternalServerError(e))
    }

}

export async function getAllCourier(req: Request, res: Response, next: NextFunction) {

    return res.send({

        cannot_track: [delivery_method.JNE, delivery_method.TIKI, delivery_method.RPX, delivery_method.SAP, delivery_method.JET, delivery_method.INDAH,
            delivery_method.NCS, delivery_method.IDE, delivery_method.IDL, delivery_method.DSE, delivery_method.REX],

        perfect: [delivery_method.POS, delivery_method.SICEPAT, delivery_method.JNT, delivery_method.NINJA, delivery_method.WAHANA, delivery_method.LION]
    })
}

export async function getAvailableOnly(req: Request, res: Response, next: NextFunction) {

    let availableCourier = []
    let responses = []

    try {

        let {origin, destination, weight} = req.body

        console.log(origin, destination, weight)

        let formData = new FormData();

        formData.append("key", premium_raja_ongkir_key)
        formData.append("origin", origin)
        formData.append("originType", "city")
        formData.append("destination", destination)
        formData.append("destinationType", "city")
        formData.append("weight", weight + "")
        formData.append("courier", "jne:tiki:pos")//TODO: PUT THIS TO A VARIABLE


        let request = await fetch(`https://pro.rajaongkir.com/api/cost`, {
            headers: formData.getHeaders(),
            method: 'POST',
            body: <any>formData
        });

        let respond = await request.text();
        respond = JSON.parse(respond);

        return res.send(respond);

    } catch (e) {
        return next(new InternalServerError(e))
    }
}
